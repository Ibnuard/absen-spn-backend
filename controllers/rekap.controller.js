const db = require("../db");
const { ERROR_MESSAGE } = require("../utils/constants");
const { Responder } = require("../utils/responder");
const REKAP = db.rekap;

exports.get_rekap = async (req, res) => {
  const { id } = req.params;
  try {
    const getRekap = await REKAP.findAll({
      where: {
        user_id: id,
      },
    });
    Responder(res, "OK", null, getRekap, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};
