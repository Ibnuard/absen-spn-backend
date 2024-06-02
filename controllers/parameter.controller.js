const db = require("../db");
const { ERROR_MESSAGE } = require("../utils/constants");
const { Responder } = require("../utils/responder");
const PARAMETER = db.parameter;

exports.update_parameter = async (req, res) => {
  const { id } = req.params;
  const { max_clock_in, max_clock_out } = req.body;

  try {
    // get parameter
    const getParameter = await PARAMETER.findOne({
      where: {
        parameter_id: id,
      },
    });

    const param = await getParameter["dataValues"];

    // update parameter
    await PARAMETER.update(
      {
        maximum_clock_in: max_clock_in || param.max_clock_in,
        maximum_clock_out: max_clock_out || param.max_clock_out,
      },
      {
        where: {
          parameter_id: id,
        },
      }
    );
    Responder(res, "OK", null, "OK", 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};

exports.get_parameter = async (req, res) => {
  const { id } = req.params;
  try {
    const getParameter = await PARAMETER.findOne({
      where: {
        parameter_id: id,
      },
    });

    const param = await getParameter["dataValues"];

    Responder(res, "OK", null, param, 200);
    return;
  } catch (error) {
    Responder(res, "ERROR", ERROR_MESSAGE.GENERAL, null, 500);
    return;
  }
};
