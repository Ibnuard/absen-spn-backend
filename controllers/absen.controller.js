const moment = require("moment");
const db = require("../db");
const { Responder } = require("../utils/responder");
const { ERROR_MESSAGE, ABSEN_TYPE } = require("../utils/constants");
const { mergeAbsen } = require("../utils/utils");
const ABSEN = db.absen;
const USER = db.user;

exports.absen = async (req, res) => {
  const { id } = req.params;
  const { type, kelas, mapel } = req.query;
  try {
    const getUser = await USER.findOne({
      where: {
        id: id,
      },
    });

    const userData = await getUser["dataValues"];

    // === check if already absen
    const currentDate = moment().format("DD-MM-YYYY");
    if (type == ABSEN_TYPE.CLOCK_IN) {
      const exist = await ABSEN.findOne({
        where: {
          type: ABSEN_TYPE.CLOCK_IN,
          tgl_absen: currentDate,
          user_id: id,
        },
      });

      if (exist) {
        Responder(res, "ERROR", "Anda sudah clock in hari ini.", null, 400);
        return;
      }
    } else {
      const existIn = await ABSEN.findOne({
        where: {
          type: ABSEN_TYPE.CLOCK_IN,
          tgl_absen: currentDate,
          user_id: id,
        },
      });

      if (!existIn) {
        Responder(res, "ERROR", "Anda belum clock in hari ini.", null, 400);
        return;
      }

      const exist = await ABSEN.findOne({
        where: {
          type: ABSEN_TYPE.CLOCK_OUT,
          tgl_absen: currentDate,
          user_id: id,
        },
      });

      if (exist) {
        Responder(res, "ERROR", "Anda sudah clock out hari ini.", null, 400);
        return;
      }
    }

    return await ABSEN.create({
      user_id: id,
      type: type,
      username: userData.username,
      kelas: kelas,
      mapel: mapel,
      tgl_absen: moment().format("DD-MM-YYYY"),
      jam_absen: moment().format("HH:mm"),
    })
      .then((result) => {
        return Responder(res, "OK", null, result, 200);
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

exports.rekap = async (req, res) => {
  const { id } = req.params;
  try {
    const getAbsen = await ABSEN.findAll({
      where: {
        user_id: id,
      },
    });

    const finalizeRekap = mergeAbsen(getAbsen);

    Responder(res, "OK", null, finalizeRekap, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};
