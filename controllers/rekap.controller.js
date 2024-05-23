const { Op } = require("sequelize");
const db = require("../db");
const { ERROR_MESSAGE } = require("../utils/constants");
const { Responder } = require("../utils/responder");
const REKAP = db.rekap;

exports.get_rekap = async (req, res) => {
  const { id } = req.params;
  const { search } = req.query;

  try {
    const whereCondition = {
      user_id: id,
    };

    // Jika terdapat parameter pencarian, tambahkan kondisi pencarian untuk mapel
    if (search) {
      whereCondition.mapel = {
        [Op.like]: `%${search}%`,
      };
    }

    const getRekap = await REKAP.findAll({
      where: whereCondition,
    });

    Responder(res, "OK", null, getRekap, 200);
    return;
  } catch (error) {
    console.log(error);
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};
