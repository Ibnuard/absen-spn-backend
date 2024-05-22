const db = require("../db");
const { ERROR_MESSAGE } = require("../utils/constants");
const { Responder } = require("../utils/responder");
const JADWAL = db.jadwal;

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
  const { title, tanggal, jam_in, jam_out } = req.body;
  try {
    return await JADWAL.create({
      title: title,
      tanggal: tanggal,
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
