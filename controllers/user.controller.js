const md5 = require("md5");
const db = require("../db");
const { ERROR_MESSAGE } = require("../utils/constants");
const { Responder } = require("../utils/responder");
const { isMatchPassword } = require("../utils/utils");
const { uploadImagesCloudinary } = require("../utils/cloudinary");

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
  const { nama, username, password, nrp, avatar, jabatan, pangkat } = req.body;
  try {
    const encPassword = md5(password);

    const getAllUser = await USER.findOne({
      where: {
        username: username,
      },
    });

    if (getAllUser) {
      Responder(res, "ERROR", "Username telah dipakai.", null, 400);
      return;
    }

    await USER.create({
      nama: nama,
      username: username,
      password: encPassword,
      nrp: nrp,
      avatar:
        avatar ||
        "https://res.cloudinary.com/dx4b4m2n2/image/upload/v1716547951/tb9fft00rdblrq5wdruf.jpg",
      jabatan: jabatan.toUpperCase(),
      pangkat: pangkat.toUpperCase(),
    });

    Responder(res, "OK", null, { message: "Sukses" }, 200);
    return;
  } catch (error) {
    console.log(error);
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

exports.update_avatar = async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;
  try {
    const uploadPic = await uploadImagesCloudinary(image);
    if (uploadPic.url) {
      // Update user
      await USER.update(
        { avatar: uploadPic.url },
        {
          where: {
            id: id,
          },
        }
      );

      // Get Updated user
      const getUser = await USER.findOne({ where: { id: id } });
      const userData = await getUser["dataValues"];
      Responder(res, "OK", null, userData, 200);
      return;
    } else {
      Responder(res, "ERROR", "Gagal mengupload gambar.", null, 400);
      return;
    }
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, 400);
    return;
  }
};

exports.get_users = async (req, res) => {
  try {
    const getUsers = await USER.findAll();
    Responder(res, "OK", null, getUsers, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, 400);
    return;
  }
};

exports.delete_user = async (req, res) => {
  const { id } = req.params;
  try {
    await USER.destroy({ where: { id: id } });
    Responder(res, "OK", null, { message: "OK" }, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, 400);
    return;
  }
};

exports.edit_user = async (req, res) => {
  const { nama, nrp, jabatan, pangkat } = req.body;
  const { id } = req.params;
  try {
    await USER.update(
      {
        nama: nama,
        nrp: nrp,
        jabatan: jabatan.toUpperCase(),
        pangkat: pangkat.toUpperCse(),
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
