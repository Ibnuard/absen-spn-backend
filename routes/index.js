const express = require("express");

const router = express.Router();

// controllers
const dev = require("../controllers/dev.controller");
const user = require("../controllers/user.controller");
const absen = require("../controllers/absen.controller");
const jadwal = require("../controllers/jadwal.controller");
const kelas = require("../controllers/kelas.controller");
const mapel = require("../controllers/mapel.controller");
const rekap = require("../controllers/rekap.controller");

// ==== routes

// Dev
router.post("/dev", dev.testPayload);

// User
router.post("/login", user.login);
router.post("/register", user.add_user);
router.post("/update-profile/:id", user.update_avatar);
router.get("/users", user.get_users);

// Absen
router.post("/absen/:id", absen.absen);
router.get("/history/:id", absen.history_absen);

// Jadwal
router.post("/jadwal", jadwal.add_jadwal);
router.get("/jadwal", jadwal.get_jadwal);
router.delete("/jadwal/:id", jadwal.delete_jadwal);

// Kelas
router.post("/kelas", kelas.add_kelas);
router.get("/kelas", kelas.get_kelas);
router.delete("/kelas/:id", kelas.delete_kelas);

// Mapel
router.post("/mapel", mapel.add_mapel);
router.get("/mapel", mapel.get_mapel);
router.delete("/mapel/:id", mapel.delete_mapel);

// Rekap
router.get("/rekap/:id", rekap.get_rekap);

module.exports = { router };
