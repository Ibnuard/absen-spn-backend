const moment = require("moment");
require("moment/locale/id");
moment.locale("id");

const db = require("../db");
const { sequelize } = require("../db");
const { Responder } = require("../utils/responder");
const { ERROR_MESSAGE, ABSEN_TYPE } = require("../utils/constants");
const { mergeAbsen, isTerlambat } = require("../utils/utils");
const { Op } = require("sequelize");
const ABSEN = db.absen;
const USER = db.user;
const MAPEL = db.mapel;
const REKAP = db.rekap;
const PARAMETER = db.parameter;
const JADWAL = db.jadwal;
const SESI = db.session;

exports.new_absen = async (req, res) => {
  const { id } = req.params;
  const { type, kelas_id, mapel_id } = req.query;
  try {
    // ===================== PARAM PROCESS ==============================

    // ====== GET USER
    const getUser = await USER.findOne({
      where: {
        id: id,
      },
    });

    const userData = await getUser["dataValues"];

    // ===== Current Date
    const currentDate = moment().format("DD-MM-YYYY");

    // ===== Check jadwal
    const currentDay = moment().format("dddd").toLowerCase();
    const getJadwal = await JADWAL.findOne({
      where: {
        kelas_id: kelas_id,
        mapel_id: mapel_id,
        jadwal_day: currentDay,
      },
    });

    // == Jadwal not found
    if (!getJadwal) {
      Responder(res, "ERROR", "Jadwal tidak ditemukan.", null, 400);
      return;
    }

    const jadwalData = await getJadwal["dataValues"];
    const jadwalJamIn = jadwalData.jam_in;
    const jadwalJamOut = jadwalData.jam_out;
    const jadwalMapel = jadwalData.mapel;
    const jadwalKelas = jadwalData.kelas;

    // ========================= ABSEN PROCESS =========================

    // =========== ABSEN CLOCK IN
    if (type == ABSEN_TYPE.CLOCK_IN) {
      const getAbsen = await ABSEN.findOne({
        where: {
          user_id: id,
          jadwal_id: jadwalData.id,
          type: type,
          tgl_absen: currentDate,
        },
      });

      // check if already absen
      if (getAbsen) {
        Responder(
          res,
          "ERROR",
          "Anda sudah check in untuk jadwal mata pelajaran ini.",
          null,
          400
        );
        return;
      }

      // check if terlambat
      const cekTerlambat = isTerlambat(jadwalJamIn);

      if (cekTerlambat) {
        Responder(
          res,
          "ERROR",
          "Check in sudah terlambat, maksimal 15 menit dari jadwal yang ditentukan.",
          null,
          400
        );
        return;
      }

      // check if already max kehadiran
      const getMapelRekap = await REKAP.findOne({
        where: {
          user_id: id,
          mapel_id: mapel_id,
          periode: moment().format("MM-YYYY"),
        },
      });

      // Check if mapel limit
      if (getMapelRekap) {
        const mapelRekapData = await getMapelRekap["dataValues"];
        if (mapelRekapData.kehadiran >= mapelRekapData.max_kehadiran) {
          Responder(
            res,
            "ERROR",
            "Kehadiran untuk mapel ini sudah maksimal.",
            null,
            400
          );
          return;
        }
      }
    } else {
      // =========== ABSEN CLOCK OUT

      // Check clock in data
      const getClockInAbsen = await ABSEN.findOne({
        where: {
          user_id: id,
          type: ABSEN_TYPE.CLOCK_IN,
          jadwal_id: jadwalData.id,
          tgl_absen: currentDate,
        },
      });

      if (!getClockInAbsen) {
        Responder(
          res,
          "ERROR",
          "Anda belum check in untuk jadwal mata pelajaran ini."
        );
        return;
      }

      // check is terlambat
      const cekTerlambat = isTerlambat(jadwalJamOut);

      if (cekTerlambat) {
        Responder(
          res,
          "ERROR",
          "Check out sudah terlambat, maksimal 15 menit dari jadwal yang ditentukan."
        );
        return;
      }

      // check if already clock out
      const getClockOutAbsen = await ABSEN.findOne({
        where: {
          user_id: id,
          type: ABSEN_TYPE.CLOCK_OUT,
          jadwal_id: jadwalData.id,
          tgl_absen: currentDate,
        },
      });

      if (getClockOutAbsen) {
        Responder(
          res,
          "ERROR",
          "Anda sudah check out untuk jadwal mata pelajaran ini.",
          null,
          400
        );
        return;
      }
    }

    // Create Absen Clock In
    return await ABSEN.create({
      type: type,
      user_id: id,
      name: userData.nama,
      nrp: userData.nrp,
      username: userData.username,
      jadwal_id: jadwalData.id,
      kelas: jadwalKelas,
      kelas_id: kelas_id,
      mapel_id: mapel_id,
      mapel: jadwalMapel,
      tgl_absen: currentDate,
      jam_absen: moment().format("HH:mm"),
      periode: moment().format("MM-YYYY"),
    })
      .then((result) => {
        createRekap(result, type, id);
        checkSession(id, jadwalData, type);

        return Responder(res, "OK", null, result, 200);
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    console.log(error);
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

async function createRekap(absen, type, iduser) {
  const getRekap = await REKAP.findOne({
    where: {
      user_id: iduser,
      periode: absen.periode,
      mapel_id: absen.mapel_id,
      kelas_id: absen.kelas_id,
    },
  });

  const getMapel = await MAPEL.findOne({
    where: {
      id: absen.mapel_id,
    },
  });

  const mapelData = await getMapel["dataValues"];

  if (type == ABSEN_TYPE.CLOCK_IN) {
    // Update rekap kehadiran
    if (!getRekap) {
      await REKAP.create({
        user_id: iduser,
        mapel_id: absen.mapel_id,
        mapel: absen.mapel,
        kelas_id: absen.kelas_id,
        kelas: absen.kelas,
        periode: absen.periode,
        kehadiran: 0,
        max_kehadiran: mapelData.max_pertemuan,
      });
    }
  } else {
    const rekapData = await getRekap["dataValues"];
    await REKAP.update(
      { kehadiran: rekapData.kehadiran + 1 },
      { where: { id: rekapData.id } }
    );
  }
}

async function checkSession(user_id, jadwal, type) {
  if (type == ABSEN_TYPE.CLOCK_IN) {
    await SESI.create({
      user_id: user_id,
      kelas_id: jadwal.kelas_id,
      kelas: jadwal.kelas,
      mapel_id: jadwal.mapel_id,
      mapel: jadwal.mapel,
      date: moment().format("DD-MM-YYYY"),
    });
  } else {
    await SESI.destroy({ where: { user_id: user_id } });
  }
}

exports.history_absen = async (req, res) => {
  const { id } = req.params;
  const { mapelId, periode } = req.query;
  try {
    const getAbsen = await ABSEN.findAll({
      where: {
        user_id: id,
        mapel_id: mapelId,
        periode: periode,
      },
    });

    // === check if already absen
    const currentDate = moment().format("DD-MM-YYYY");

    const finalizeHistory = mergeAbsen(getAbsen, currentDate);

    Responder(res, "OK", null, finalizeHistory, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

exports.history_absen_new = async (req, res) => {
  const { id } = req.params;
  const { mapelId, periode } = req.query;
  try {
    const currentDate = moment().format("YYYY-MM-DD"); // Pastikan format sesuai dengan format tanggal di database

    const query = `
      SELECT 
          user_id,
          kelas,
          mapel,
          mapel_id,
          kelas_id,
          tgl_absen,
          periode,
          MAX(CASE WHEN type = 'CLOCK_IN' THEN jam_absen ELSE '-' END) AS jam_absen_in,
          MAX(CASE WHEN type = 'CLOCK_OUT' THEN jam_absen ELSE '-' END) AS jam_absen_out,
          CASE 
              WHEN MAX(CASE WHEN type = 'CLOCK_IN' THEN jam_absen ELSE NULL END) IS NOT NULL
              AND tgl_absen = :currentDate
              AND MAX(CASE WHEN type = 'CLOCK_OUT' THEN jam_absen ELSE NULL END) IS NULL
              THEN 1
              ELSE 0
          END AS isCanCheckOut
      FROM 
          absens
      WHERE 
          user_id = :id
          AND mapel_id = :mapelId
          AND periode = :periode
      GROUP BY 
          user_id, kelas, mapel, mapel_id, kelas_id, tgl_absen, periode;
    `;

    const finalizeHistory = await sequelize.query(query, {
      replacements: { id, mapelId, periode, currentDate },
      type: sequelize.QueryTypes.SELECT,
    });

    Responder(res, "OK", null, finalizeHistory, 200);
    return;
  } catch (error) {
    console.error(error); // Tambahkan logging error untuk debugging
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

exports.history_absen_all = async (req, res) => {
  const { mapelId, periode } = req.query;
  try {
    const currentDate = moment().format("YYYY-MM-DD"); // Pastikan format sesuai dengan format tanggal di database

    const query = `
      SELECT 
          user_id,
          name,
          kelas,
          mapel,
          mapel_id,
          kelas_id,
          tgl_absen,
          periode,
          MAX(CASE WHEN type = 'CLOCK_IN' THEN jam_absen ELSE '-' END) AS jam_absen_in,
          MAX(CASE WHEN type = 'CLOCK_OUT' THEN jam_absen ELSE '-' END) AS jam_absen_out,
          CASE 
              WHEN MAX(CASE WHEN type = 'CLOCK_IN' THEN jam_absen ELSE NULL END) IS NOT NULL
              AND tgl_absen = :currentDate
              AND MAX(CASE WHEN type = 'CLOCK_OUT' THEN jam_absen ELSE NULL END) IS NULL
              THEN 1
              ELSE 0
          END AS isCanCheckOut
      FROM 
          absens
      WHERE 
          mapel_id = :mapelId
          AND periode = :periode
      GROUP BY 
          user_id, kelas, mapel, mapel_id, kelas_id, tgl_absen, periode;
    `;

    const finalizeHistory = await sequelize.query(query, {
      replacements: { mapelId, periode, currentDate },
      type: sequelize.QueryTypes.SELECT,
    });

    Responder(res, "OK", null, finalizeHistory, 200);
    return;
  } catch (error) {
    console.error(error); // Tambahkan logging error untuk debugging
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

exports.aktif_kelas = async (req, res) => {
  const { id } = req.params;
  try {
    const getSesi = await SESI.findOne({
      where: {
        user_id: id,
        date: moment().format("DD-MM-YYYY"),
      },
    });

    // destroy unused aktif kelas
    await SESI.destroy({
      where: {
        user_id: id,
        date: {
          [Op.ne]: moment().format("DD-MM-YYYY"),
        },
      },
    });

    if (getSesi) {
      const sesiData = await getSesi["dataValues"];
      Responder(res, "OK", null, sesiData, 200);
      return;
    } else {
      Responder(
        res,
        "OK",
        null,
        {
          user_id: null,
          kelas_id: null,
          kelas: null,
          mapel_id: null,
          mapel: null,
        },
        200
      );
    }
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};
