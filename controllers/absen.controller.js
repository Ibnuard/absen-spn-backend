const moment = require("moment");
const db = require("../db");
const { Responder } = require("../utils/responder");
const { ERROR_MESSAGE, ABSEN_TYPE } = require("../utils/constants");
const { mergeAbsen } = require("../utils/utils");
const ABSEN = db.absen;
const USER = db.user;
const MAPEL = db.mapel;
const REKAP = db.rekap;

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

    const getDateAbsen = await ABSEN.findAll({
      where: {
        user_id: id,
        tgl_absen: currentDate,
      },
    });

    // get absen per date
    if (getDateAbsen) {
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
        console.log("CI DATA", clockInData.mapel_id);
        console.log("US DATA", mapel);
        if (clockInData.mapel_id.toString() !== mapel.toString()) {
          Responder(
            res,
            "ERROR",
            "Mata pelajaran tidak boleh berbeda dengan mata pelajaran saat Clock In."
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

    // get mapel detail
    const getMapel = await MAPEL.findOne({
      where: {
        id: mapel,
      },
    });

    const mapelData = await getMapel["dataValues"];

    // Create Rekap
    async function createRekap(periode, mapel_id) {
      const getRekap = await REKAP.findOne({
        where: {
          periode: periode,
          mapel_id: mapel_id,
        },
      });

      // Update rekap kehadiran
      if (getRekap) {
        const rekapData = await getRekap["dataValues"];
        await REKAP.update(
          { kehadiran: rekapData.kehadiran + 1 },
          { where: { id: rekapData.id } }
        );
      } else {
        await REKAP.create({
          user_id: id,
          mapel_id: mapel_id,
          mapel: mapelData.name,
          periode: periode,
          kehadiran: 1,
          max_kehadiran: mapelData.max_pertemuan,
        });
      }
    }

    // Create Absen
    return await ABSEN.create({
      type: type,
      user_id: id,
      name: userData.nama,
      nim: userData.nim,
      username: userData.username,
      kelas: kelas,
      mapel_id: mapel,
      mapel: mapelData.name,
      tgl_absen: currentDate,
      jam_absen: moment().format("HH:mm"),
      periode: moment().format("MM-YYYY"),
    })
      .then((result) => {
        if (type == ABSEN_TYPE.CLOCK_OUT) {
          createRekap(result.periode, result.mapel_id);
        }

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

exports.history_absen = async (req, res) => {
  const { id } = req.params;
  try {
    const getAbsen = await ABSEN.findAll({
      where: {
        user_id: id,
      },
    });

    const finalizeHistory = mergeAbsen(getAbsen);

    Responder(res, "OK", null, finalizeHistory, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};
