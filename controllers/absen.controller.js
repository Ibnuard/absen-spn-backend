const moment = require("moment");
require("moment/locale/id");
moment.locale("id");

const db = require("../db");
const { Responder } = require("../utils/responder");
const { ERROR_MESSAGE, ABSEN_TYPE } = require("../utils/constants");
const { mergeAbsen, isTerlambat } = require("../utils/utils");
const ABSEN = db.absen;
const USER = db.user;
const MAPEL = db.mapel;
const REKAP = db.rekap;
const PARAMETER = db.parameter;
const JADWAL = db.jadwal;
const SESI = db.session;

exports.absen = async (req, res) => {
  const { id } = req.params;
  const { type, kelas_id, mapel_id } = req.query;
  try {
    const getUser = await USER.findOne({
      where: {
        id: id,
      },
    });

    const userData = await getUser["dataValues"];

    // === check if already absen
    const currentDate = moment().format("DD-MM-YYYY");

    // [Satrt] -- get absen per date
    if (getDateAbsen.length > 0) {
      if (type == ABSEN_TYPE.CLOCK_IN) {
        const getClockinAbsen = await ABSEN.findOne({
          where: {
            user_id: id,
            tgl_absen: currentDate,
            type: ABSEN_TYPE.CLOCK_IN,
          },
        });

        if (getClockinAbsen) {
          Responder(res, "ERROR", "Anda sudah clock in hari ini.", null, 400);
          return;
        }

        // get mapel rekap info
        const getMapelRekap = await REKAP.findOne({
          where: {
            user_id: id,
            mapel_id: mapel,
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
        // Check if already clock in
        const getClockinAbsen = await ABSEN.findOne({
          where: {
            user_id: id,
            tgl_absen: currentDate,
            type: ABSEN_TYPE.CLOCK_IN,
          },
        });

        if (!getClockinAbsen) {
          Responder(res, "ERROR", "Anda belum clock in hari ini.", null, 400);
          return;
        }

        const clockInData = await getClockinAbsen["dataValues"];
        if (clockInData.mapel_id.toString() !== mapel.toString()) {
          Responder(
            res,
            "ERROR",
            "Mata pelajaran tidak boleh berbeda dengan mata pelajaran saat clock in."
          );
          return;
        }

        if (clockInData.kelas !== kelas) {
          Responder(
            res,
            "ERROR",
            "Kelas tidak boleh berbeda dengan kelas saat clock in."
          );
          return;
        }

        // Check if already clock out
        const getClockoutAbsen = await ABSEN.findOne({
          where: {
            user_id: id,
            tgl_absen: currentDate,
            type: ABSEN_TYPE.CLOCK_OUT,
          },
        });

        if (getClockoutAbsen) {
          Responder(res, "ERROR", "Anda sudah clock out hari ini.", null, 400);
          return;
        }
      }
    }

    // [End] -- Get absen per date

    // [Start] -- get mapel detail
    const getMapel = await MAPEL.findOne({
      where: {
        id: mapel,
      },
    });

    const mapelData = await getMapel["dataValues"];

    // [End] -- get mapel detail

    // [Start] -- Create Rekap
    async function createRekap(periode, mapel_id) {
      const getRekap = await REKAP.findOne({
        where: {
          periode: periode,
          mapel_id: mapel_id,
        },
      });

      if (type == ABSEN_TYPE.CLOCK_IN) {
        // Update rekap kehadiran
        if (!getRekap) {
          await REKAP.create({
            user_id: id,
            mapel_id: mapel_id,
            mapel: mapelData.name,
            periode: periode,
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

    // [End] --  Create Rekap

    // [Start] -- Checking parameter
    // get parameter
    const getParameter = await PARAMETER.findOne({
      where: {
        parameter_id: 1,
      },
    });

    const param = await getParameter["dataValues"];
    const max_clock_in = param.maximum_clock_in;
    const max_clock_out = param.maximum_clock_out;

    const current_hours = moment().format("HH.mm");

    if (type == ABSEN_TYPE.CLOCK_IN) {
      // Menggunakan moment untuk membandingkan waktu
      if (
        !moment(current_hours, "HH.mm").isSameOrBefore(
          moment(max_clock_in, "HH.mm")
        )
      ) {
        Responder(
          res,
          "ERROR",
          `Check in hanya bisa dilakukan sebelum pukul ${min_clock_in}.`,
          null,
          400
        );
        return;
      }
    } else if (type == ABSEN_TYPE.CLOCK_OUT) {
      // Menggunakan moment untuk membandingkan waktu
      if (
        !moment(current_hours, "HH.mm").isSameOrBefore(
          moment(max_clock_out, "HH.mm")
        )
      ) {
        Responder(
          res,
          "ERROR",
          `Check out hanya bisa dilakukan sebelum pukul ${max_clock_out}.`,
          null,
          400
        );
        return;
      }
    }

    // [End] -- Checking parameter

    // [Start] -- Writing absen history
    if (type == ABSEN_TYPE.CLOCK_OUT) {
      const getClockinAbsen = await ABSEN.findOne({
        where: {
          user_id: id,
          tgl_absen: currentDate,
          type: ABSEN_TYPE.CLOCK_IN,
        },
      });

      const clockInData = await getClockinAbsen["dataValues"];

      // Create Absen Clock Out
      return await ABSEN.create({
        type: type,
        user_id: id,
        name: userData.nama,
        nrp: userData.nrp,
        username: userData.username,
        kelas: clockInData.kelas,
        mapel_id: clockInData.mapel_id,
        mapel: clockInData.mapel,
        tgl_absen: currentDate,
        jam_absen: moment().format("HH:mm"),
        periode: clockInData.periode,
      })
        .then((result) => {
          createRekap(result.periode, result.mapel_id);

          return Responder(res, "OK", null, result, 200);
        })
        .catch((err) => {
          throw err;
        });
    }

    // Create Absen Clock In
    return await ABSEN.create({
      type: type,
      user_id: id,
      name: userData.nama,
      nrp: userData.nrp,
      username: userData.username,
      kelas: kelas,
      mapel_id: mapel,
      mapel: mapelData.name,
      tgl_absen: currentDate,
      jam_absen: moment().format("HH:mm"),
      periode: moment().format("MM-YYYY"),
    })
      .then((result) => {
        createRekap(result.periode, result.mapel_id);

        return Responder(res, "OK", null, result, 200);
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }

  // [End] -- Writing absen history
};

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
        createRekap(result, type);
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

async function createRekap(absen, type) {
  const getRekap = await REKAP.findOne({
    where: {
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
        user_id: absen.user_id,
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

exports.aktif_kelas = async (req, res) => {
  const { id } = req.params;
  try {
    const getSesi = await SESI.findOne({
      where: {
        user_id: id,
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
