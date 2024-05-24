const db = require("../db");
const { ERROR_MESSAGE } = require("../utils/constants");
const { Responder } = require("../utils/responder");
const KELAS = db.kelas;

exports.get_kelas = async (req, res) => {
  try {
    const getKelas = await KELAS.findAll();
    Responder(res, "OK", null, getKelas, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

exports.add_kelas = async (req, res) => {
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

exports.delete_kelas = async (req, res) => {
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

exports.edit_kelas = async (req, res) => {
  const { kelas } = req.query;
  const { id } = req.params;
  try {
    await KELAS.update(
      {
        kelas: kelas,
      },
      {
        where: {
          id: id,
        },
      }
    );

    Responder(res, "OK", null, { message: "Sukses" }, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};
