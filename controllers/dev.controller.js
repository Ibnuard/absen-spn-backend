const db = require("../db");
const { Responder } = require("../utils/responder");

exports.testPayload = async (req, res) => {
  const { data, file } = req.body;
  try {
    console.log(data);
    Responder(res, "OK", null, { success: true }, 200);
    return;
  } catch (error) {
    console.log(error);
    Responder(res, "ERROR", null, { success: false }, 400);
    return;
  }
};
