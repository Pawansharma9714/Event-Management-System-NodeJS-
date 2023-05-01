const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const loginSchema = new Schema({
  email: String,
  username: String,
  password: String,
});

const loginHistorySchema = new Schema({
  username: String,
  token: String,
  time: { type: Date, default: Date.now },
});

const organizerSchema = new Schema(
  {
    name: String,
    contactno: Number,
    address: String,
    email: String,
    username: String,
    password: String,
    apikey: String,
    secreatkey: String,
    smsapikey: String,
    smssender: String,
    smstemplate: String,
    status: Boolean,
    paymentIntegration: Boolean,
    isSendSms: Boolean,
  },
  {
    timestamps: true
  }
);

let loginAuth = mongoose.model("Login", loginSchema);
let logHistory = mongoose.model("LoginHistory", loginHistorySchema);
let organizer = mongoose.model("Organizer", organizerSchema);

module.exports = {
  loginAuth,
  logHistory,
  organizer,
};
