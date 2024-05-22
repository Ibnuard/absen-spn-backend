const md5 = require("md5");
const db = require("../db");
const { ERROR_MESSAGE } = require("../utils/constants");
const { Responder } = require("../utils/responder");
const { isMatchPassword } = require("../utils/utils");
const USER = db.user;

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // check user
    const getUser = await USER.findOne({
      where: {
        username: username,
      },
    });

    if (!getUser) {
      Responder(res, "ERROR", "User tidak ditemukan.", null, 401);
      return;
    }

    const userData = await getUser["dataValues"];
    const userPassword = userData.password;

    const isPasswordMatch = isMatchPassword(password, userPassword);

    if (!isPasswordMatch) {
      Responder(
        res,
        "ERROR",
        "Username atau password tidak sesuai.",
        null,
        401
      );
      return;
    }

    delete userData.password;
    Responder(res, "OK", null, userData, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

exports.add_user = async (req, res) => {
  const {
    nama,
    username,
    password,
    nim,
    status,
    avatar,
    kelas,
    tahun_masuk,
    wali_kelas,
    tanggal_lahir,
    tempat_lahir,
    nomor_telp,
  } = req.body;
  try {
    const encPassword = md5(password);

    await USER.create({
      nama: nama,
      username: username,
      password: encPassword,
      nim: nim,
      status: status,
      avatar: avatar,
      kelas: kelas,
      tahun_masuk: tahun_masuk,
      wali_kelas: wali_kelas,
      tanggal_lahir: tanggal_lahir,
      tempat_lahir: tempat_lahir,
      nomor_telp: nomor_telp,
    });

    Responder(res, "OK", null, { message: "Sukses" }, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};
