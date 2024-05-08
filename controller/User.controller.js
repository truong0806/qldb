const { User, sequelize } = require("../models");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, password, fullname, phone } = req.body;
  try {
    // tạo ra một chuỗi ngẫu nhiên
    const salt = bcrypt.genSaltSync(10);
    //mã hóa chuỗi salt + password
    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({
      email,
      password: hashPassword,
      fullname,
      phone,
      role: "admin",
      verified: false,
    });
    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send(error);
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  //b1: tìm ra user đang đăng nhập trên email
  const user = await User.findOne({
    where: {
      email,
    },
  });
  //b2 kiểm tra mật khẩu đúng không
  if (user) {
    const isAuth = bcrypt.compareSync(password, user.password);
    if (isAuth) {
      const token = jwt.sign(
        {
          email: user.email,
          type: user.type,
          role: user.role,
        },
        "hieuvh9",
        { expiresIn: 60 * 60 }
      );
      res.status(200).send({ message: "Đăng nhập thành công!!", token });
    } else {
      res.status(500).send({ message: "Đăng nhập thất bại!!" });
    }
  } else {
    res.status(404).send({ message: "Không tìm thấy email!!" });
  }
};
module.exports = {
  register,
  login,
};

