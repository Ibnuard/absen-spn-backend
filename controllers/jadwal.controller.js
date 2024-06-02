const db = require("../db");
const { ERROR_MESSAGE } = require("../utils/constants");
const { Responder } = require("../utils/responder");
const JADWAL = db.jadwal;
const KELAS = db.kelas;
const MAPEL = db.mapel;

exports.get_jadwal = async (req, res) => {
  try {
    const getJadwal = await JADWAL.findAll();
    Responder(res, "OK", null, getJadwal, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

exports.add_jadwal = async (req, res) => {
  const { mapel_id, kelas_id, jadwal_day, lokasi, jam_in, jam_out } = req.body;
  try {
    const getKelas = await KELAS.findOne({
      where: {
        id: kelas_id,
      },
    });

    const getMapel = await MAPEL.findOne({
      where: {
        id: mapel_id,
      },
    });

    const mapelData = await getMapel["dataValues"];
    const kelasData = await getKelas["dataValues"];

    const title = `${kelasData.kelas} - ${mapelData.name}`;

    const getJadwal = await JADWAL.findOne({
      where: {
        mapel_id: mapel_id,
        kelas_id: kelas_id,
        jadwal_day: jadwal_day.toLowerCase(),
      },
    });

    if (getJadwal) {
      Responder(
        res,
        "ERROR",
        `Sudah ada jadwal untuk kelas dan mapel di hari ${jadwal_day}`,
        400
      );
      return;
    }

    return await JADWAL.create({
      title: title,
      mapel_id: mapel_id,
      kelas_id: kelas_id,
      kelas: kelasData.kelas,
      mapel: mapelData.name,
      jadwal_day: jadwal_day.toLowerCase(),
      lokasi: lokasi,
      jam_in: jam_in,
      jam_out: jam_out,
    })
      .then((result) => {
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

exports.delete_jadwal = async (req, res) => {
  const { id } = req.params;
  try {
    await JADWAL.destroy({
      where: {
        id: id,
      },
    });
    Responder(res, "OK", null, { message: "Sukses" }, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

exports.edit_jadwal = async (req, res) => {
  const { lokasi, jam_in, jam_out } = req.body;
  const { id } = req.params;
  try {
    return await JADWAL.update(
      {
        lokasi: lokasi,
        jam_in: jam_in,
        jam_out: jam_out,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((result) => {
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
