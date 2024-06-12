let userService;
if (process.env.STORE_AREA === "postgres") {
  userService = require("../servicesPostgres/userService");
} else if (process.env.STORE_AREA === "mongodb") {
  userService = require("../services/userService");
}

exports.signup = async (req, res, next) => {
  try {
    const { newUser, token } = await userService.createUser(req.body);
    res.status(201).json({
      status: "success",
      token,
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const token = await userService.login(req.body);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    next(err);
  }
};
