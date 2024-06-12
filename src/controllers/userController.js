let userService;
if (process.env.STORE_AREA === "postgres") {
  userService = require("../servicesPostgres/userService");
} else if (process.env.STORE_AREA === "mongodb") {
  userService = require("../services/userService");
}

//note: these are also a type of middleware, so there is next
//next is not complorsury in these types
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({
      status: "success",
      result: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    await userService.createUser(req.body);
    return res.redirect("/pages/user"); //use only if using ejs only
    // res.status(201).json({
    //     status: 'success',
    //     data: newUser
    // });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
      status: "success",
      msg: "User updated Successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).json({
      status: "success",
      msg: "User deleted Successfully",
    });
  } catch (err) {
    next(err);
  }
};
