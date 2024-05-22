const express = require("express");

const router = express.Router();

// controllers
const dev = require("../controllers/dev.controller");

// ==== routes

// Dev
router.post("/dev", dev.testPayload);

module.exports = { router };
