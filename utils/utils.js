const md5 = require("md5");
const moment = require("moment");
require("moment/locale/id");
moment.locale("id");

function generateRandomNumber(min, max) {
  // Menghasilkan nomor acak di antara min (inklusif) dan max (inklusif)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFormattedDate(date = new Date(), sep = "") {
  // Ambil tahun, bulan, dan tanggal dari objek Date
  const year = date.getFullYear();
  // Tambahkan 1 karena bulan dimulai dari 0 (0 = Januari, 1 = Februari, dst.)
  const month = String(date.getMonth() + 1).padStart(2, "0"); // PadStart digunakan untuk menambahkan 0 di depan jika hanya 1 digit
  const day = String(date.getDate()).padStart(2, "0");

  // Gabungkan tahun, bulan, dan tanggal dengan tanda hubung
  return `${year}${sep}${month}${sep}${day}`;
}

function isMatchPassword(userPassword, dbPassword) {
  const encUserPass = md5(userPassword);

  return encUserPass == dbPassword ? true : false;
}

function mergeAbsen(data, currentDate) {
  const mergedData = {};

  data.forEach((entry) => {
    const {
      tgl_absen,
      user_id,
      kelas,
      mapel,
      mapel_id,
      kelas_id,
      jam_absen,
      type,
      periode,
    } = entry;

    if (!mergedData[tgl_absen]) {
      mergedData[tgl_absen] = {
        user_id,
        kelas,
        mapel,
        mapel_id,
        kelas_id,
        tgl_absen,
        periode,
        jam_absen_in: "-",
        jam_absen_out: "-",
      };
    }

    if (type === "CLOCK_IN") {
      mergedData[tgl_absen].jam_absen_in = jam_absen;
    } else if (type === "CLOCK_OUT") {
      mergedData[tgl_absen].jam_absen_out = jam_absen;
    }

    if (
      mergedData[tgl_absen].jam_absen_in != "-" &&
      tgl_absen == currentDate &&
      mergedData[tgl_absen].jam_absen_out == "-"
    ) {
      mergedData[tgl_absen].isCanCheckOut = true;
    } else {
      mergedData[tgl_absen].isCanCheckOut = false;
    }
  });

  return Object.values(mergedData);
}

function isTerlambat(jadwal) {
  // Konversi jadwalJamIn menjadi objek moment
  const jadwalMoment = moment(jadwal, "HH.mm");

  // Waktu sekarang
  const waktuSekarang = moment();

  // Tambahkan 15 menit ke jadwalJamIn
  const jadwalJamInPlus15Menit = jadwalMoment.add(15, "minutes");

  console.log("WAKTU SAEKARANG : ", waktuSekarang);
  console.log("JADWAL PLUS 15 MENIT", jadwalJamInPlus15Menit);

  // Periksa apakah waktu sekarang lebih dari jadwalJamIn + 15 menit
  if (waktuSekarang.isAfter(jadwalJamInPlus15Menit)) {
    return true; // Terlambat
  } else {
    return false; // Tidak terlambat
  }
}

module.exports = {
  generateRandomNumber,
  getFormattedDate,
  isMatchPassword,
  mergeAbsen,
  isTerlambat,
};
