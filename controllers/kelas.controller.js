const db = require("../db");
const { ERROR_MESSAGE } = require("../utils/constants");
const { Responder } = require("../utils/responder");
const KELAS = db.kelas;

exports.get_kelas = async () => {
  try {
    const getKelas = await KELAS.findAll();
    let temp = [];
    for (let data of getKelas) {
      temp.push(data.kelas);
    }
    Responder(res, "OK", null, temp, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

exports.add_kelas = async () => {
  const { kelas } = req.query;
  try {
    await KELAS.create({
      kelas: kelas,
    });

    Responder(res, "OK", null, { message: "Sukses" }, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

exports.delete_kelas = async () => {
  const { id } = req.params;
  try {
    await KELAS.destroy({
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
