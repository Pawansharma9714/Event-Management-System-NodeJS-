const bcrypt = require("bcryptjs");
const { loginAuth, logHistory } = require("../../model/Auth");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const login = async (req, res) => {
  let bdata = req.body;
  if (!bdata.username) {
    res.status(401).json({ message: "Enter Username", status: false });
    return false;
  }
  const user = await loginAuth.findOne({ username: bdata.username });
  if (!user) {
    res.status(401).json({ message: "Username not found", status: false });
    return false;
  }
  if (!bdata.password) {
    res.status(401).json({ message: "Enter Password", status: false });
    return false;
  }

  bcrypt.compare(bdata.password, user.password, (err, data) => {
    if (!data) {
      res.status(401).json({ message: "Incorrect Password", status: false });
      return false;
    }
    let tokenData = {
      userId: 12,
      username: bdata.username,
    };
    const token = jwt.sign(tokenData, "tokenSecret", {
      expiresIn: "24h",
    });

    logHistory.create({
      username: bdata.username,
      token: token,
    });
    res.status(200).json({
      username: bdata.username,
      token: token,
      message: "Login Successfully",
      status: true,
    });
  });
};

const changePassword = async (req, res) => {
  const bdata = req.body;
  if (!bdata.username) {
    res.status(401).json({ message: "Enter Username", status: false });
    return false;
  }
  if (!bdata.oldpassword) {
    res.status(401).json({ message: "Enter Old Password", status: false });
    return false;
  }
  let findOldPassMatch = await loginAuth.findOne({ username: bdata.username });
  if (!findOldPassMatch) {
    res.status(401).json({ message: "Username Incorrect", status: false });
    return false;
  }
  bcrypt.compare(
    bdata.oldpassword,
    findOldPassMatch.password,
    async (err, result) => {
      if (!result) {
        res
          .status(401)
          .json({ message: "Old Password not match", status: false });
        return false;
      }
      if (!bdata.newpassword) {
        res.status(401).json({ message: "Enter New Password", status: false });
        return false;
      }
      if (bdata.newpassword == bdata.oldpassword) {
        res
          .status(401)
          .json({ message: "Password Already Taken", status: false });
        return false;
      }
      if (!bdata.confirmpassword) {
        res
          .status(401)
          .json({ message: "Enter Confirm Password", status: false });
        return false;
      }
      if (bdata.newpassword != bdata.confirmpassword) {
        res.status(401).json({
          message: "New Password & Confirm Password must be same",
          status: false,
        });
        return false;
      }
      let hashedPassword = await bcrypt.hash(bdata.newpassword, 8);

      loginAuth.updateOne(
        { $set: { password: hashedPassword } },
        (err, result) => {
          if (err) {
            res
              .status(401)
              .json({ message: "Something Went Wrong", status: false });
            return false;
          }
          res
            .status(200)
            .json({ message: "Password Updated Successfully", status: true });
        }
      );
    }
  );
};

const forgotPassword = async (req, res) => {
  const bdata = req.body;
  if (!bdata.email) {
    return res.status(401).json({ message: "Enter Email", status: false });
  }
  loginAuth.findOne({ email: bdata.email }, async (err, data) => {
    if (!data) {
      return res
        .status(401)
        .json({ message: "Email address not found", status: false });
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    let mailOptions = {
      from: process.env.user,
      to: bdata.email,
      subject: "Password reset request",
      text: `You are receiving this email because you (or someone else) has requested a password reset for your account.`,
    };
    console.log("==1==");
    transporter.sendMail(mailOptions, (error, info) => {
      console.log("==2==");
      console.log("error==", error);
      console.log("info==", info);
      if (error) {
        console.log(error);
        return res.status(500).send("Error sending password reset email");
      }
      console.log("==3==");
      console.log("Password reset email sent:", info.response);
      res.status(200).send("Password reset email sent");
    });
    // res.status(200).json({ message: "true", status: true });
  });
};

const logout = async (req, res) => {
  const bdata = req.body;
  console.log("bdat--", bdata);
  if (!bdata.username) {
    res.status(401).json({ message: "Provide Username", status: false });
    return false;
  }
  let findUserMatch = await loginAuth.findOne({ username: bdata.username });
  if (!findUserMatch) {
    res.status(401).json({ message: "Username Incorrect", status: false });
    return false;
  }
  console.log("1111");
  res.status(200).json({ message: "true", status: true });
  // const token = jwt.sign(tokenData, "tokenSecret", {
  //   expiresIn: "24h",
  // });
};

module.exports = {
  login,
  changePassword,
  forgotPassword,
  logout,
};
