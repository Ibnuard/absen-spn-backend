const db = require("../db");
const { ERROR_MESSAGE } = require("../utils/constants");
const { Responder } = require("../utils/responder");
const MAPEL = db.mapel;

exports.add_mapel = async (req, res) => {
  const { name, maxPertemuan } = req.body;
  try {
    await MAPEL.create({
      name: name,
      max_pertemuan: maxPertemuan,
    });

    Responder(res, "OK", null, { message: "OK" }, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

exports.get_mapel = async (req, res) => {
  try {
    const getMapel = await MAPEL.findAll();
    Responder(res, "OK", null, getMapel, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, 500);
    return;
  }
};

exports.delete_mapel = async (req, res) => {
  const { id } = req.params;
  try {
    await MAPEL.destroy({
      where: {
        id: id,
      },
    });

    Responder(res, "OK", null, { message: "OK" }, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, 500);
    return;
  }
};

exports.edit_mapel = async (req, res) => {
  const { name, maxPertemuan } = req.body;
  const { id } = req.params;
  try {
    await MAPEL.update(
      {
        name: name,
        max_pertemuan: maxPertemuan,
      },
      { where: { id: id } }
    );

    Responder(res, "OK", null, { message: "OK" }, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};
