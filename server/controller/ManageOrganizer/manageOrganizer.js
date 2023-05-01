const bcrypt = require("bcryptjs");
const { organizer } = require("../../model/Auth");
const {
  isValidEmail,
  isValidMobileNumber,
} = require("../../../helper/constant");

const organizerList = async (req, res) => {
  const per_page = parseInt(req.query.per_page) || 10;
  const page_no = parseInt(req.query.page_no) || 1;

  const pagination = {
    limit: per_page,
    skip: per_page * (page_no - 1),
  };
  const totalData = await organizer.find().estimatedDocumentCount();
  const data = await organizer
    .find({})
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort({ createdAt: -1 })
    .exec();

  if (!data.length > 0) {
    res.status(401).json({
      data: data,
      totalOrganizer: totalData,
      totalPageCount: Math.ceil(totalData / per_page),
      currentPage: page_no,
      message: "No Data Found",
      status: false,
    });
    return false;
  }
  res.status(200).json({
    data: data,
    totalOrganizer: totalData,
    totalPageCount: Math.ceil(totalData / per_page),
    currentPage: page_no,
    message: "Organizer Data",
    status: true,
  });
};

const addOrganizer = async (req, res) => {
  let bdata = req.body;

  let userDB = await organizer.findOne({
    $or: [
      { name: bdata.name },
      { contactno: bdata.contactno },
      { email: bdata.email },
    ],
  });

  if (userDB) {
    if (bdata.name == userDB.name) {
      res
        .status(401)
        .json({ message: "Organizer Already Exist", status: false });
      return false;
    }
    if (bdata.contactno == userDB.contactno) {
      res
        .status(401)
        .json({ message: "Contact Number Already Exist", status: false });
      return false;
    }
    if (bdata.email == userDB.email) {
      res.status(401).json({ message: "Email Already Exist", status: false });
      return false;
    }
  }

  if (!bdata.name) {
    res.status(401).json({ message: "Enter Name", status: false });
    return false;
  }
  if (!bdata.contactno) {
    res.status(401).json({ message: "Enter Contact Number", status: false });
    return false;
  }
  if (!isValidMobileNumber(bdata.contactno)) {
    res
      .status(401)
      .json({ message: "Enter Valid Contact Number", status: false });
    return false;
  }
  if (!bdata.address) {
    res.status(401).json({ message: "Enter Address", status: false });
    return false;
  }
  if (!bdata.email) {
    res.status(401).json({ message: "Enter Email", status: false });
    return false;
  }
  if (!isValidEmail(bdata.email)) {
    res.status(401).json({ message: "Enter Valid Email", status: false });
    return false;
  }
  if (!bdata.username) {
    res.status(401).json({ message: "Enter UserName", status: false });
    return false;
  }
  if (!bdata.password) {
    res.status(401).json({ message: "Enter Password", status: false });
    return false;
  }
  if (!bdata.apikey) {
    res.status(401).json({ message: "Enter API Key", status: false });
    return false;
  }
  if (!bdata.secreatkey) {
    res.status(401).json({ message: "Enter Secreat Key", status: false });
    return false;
  }
  if (!bdata.smsapikey) {
    res.status(401).json({ message: "Enter SMS API Key", status: false });
    return false;
  }
  if (!bdata.smssender) {
    res.status(401).json({ message: "Enter SMS Sender", status: false });
    return false;
  }
  if (!bdata.smstemplate) {
    res.status(401).json({ message: "Enter SMS Template", status: false });
    return false;
  }
  if (!bdata.status) {
    bdata.status = false;
  }
  if (!bdata.paymentIntegration) {
    bdata.paymentIntegration = false;
  }
  if (!bdata.isSendSms) {
    bdata.isSendSms = false;
  }

  let hashedPassword = await bcrypt.hash(bdata.password, 8);
  bdata.password = hashedPassword;

  organizer.create(bdata);
  res
    .status(200)
    .json({ data: bdata, message: "Organizer Created", status: true });
};

const editOrganizer = async (req, res) => {
  let organizerID = req.params.organizerID;

  organizer.find({ _id: organizerID }, (err, findOrganizer) => {
    if (err) {
      res.status(401).json({ message: "Organizer not found", status: false });
      return false;
    }
    let organizerData = findOrganizer[0];
    res.status(200).json({ data: organizerData, status: true });
  });
};

const updateOrganizer = async (req, res) => {
  const bdata = req.body;
  let organizerID = req.params.organizerID;

  if (!bdata.name) {
    res.status(401).json({ message: "Enter Name", status: false });
    return false;
  }
  if (!bdata.contactno) {
    res.status(401).json({ message: "Enter Contact Number", status: false });
    return false;
  }
  if (!isValidMobileNumber(bdata.contactno)) {
    res
      .status(401)
      .json({ message: "Enter Valid Contact Number", status: false });
    return false;
  }
  if (!bdata.address) {
    res.status(401).json({ message: "Enter Address", status: false });
    return false;
  }
  if (!bdata.email) {
    res.status(401).json({ message: "Enter Email", status: false });
    return false;
  }
  if (!isValidEmail(bdata.email)) {
    res.status(401).json({ message: "Enter Valid Email", status: false });
    return false;
  }
  if (!bdata.username) {
    res.status(401).json({ message: "Enter UserName", status: false });
    return false;
  }
  if (!bdata.password) {
    res.status(401).json({ message: "Enter Password", status: false });
    return false;
  }
  if (!bdata.apikey) {
    res.status(401).json({ message: "Enter API Key", status: false });
    return false;
  }
  if (!bdata.secreatkey) {
    res.status(401).json({ message: "Enter Secreat Key", status: false });
    return false;
  }
  if (!bdata.smsapikey) {
    res.status(401).json({ message: "Enter SMS API Key", status: false });
    return false;
  }
  if (!bdata.smssender) {
    res.status(401).json({ message: "Enter SMS Sender", status: false });
    return false;
  }
  if (!bdata.smstemplate) {
    res.status(401).json({ message: "Enter SMS Template", status: false });
    return false;
  }
  if (!bdata.status) {
    bdata.status = false;
  }
  if (!bdata.paymentIntegration) {
    bdata.paymentIntegration = false;
  }
  if (!bdata.isSendSms) {
    bdata.isSendSms = false;
  }

  let hashedPassword = await bcrypt.hash(bdata.password, 8);
  bdata.password = hashedPassword;

  organizer.findOne(
    {
      _id: { $nin: organizerID },
      $or: [
        { name: bdata.name },
        { contactno: bdata.contactno },
        { email: bdata.email },
      ],
    },
    (err, isMatchOrganizer) => {
      if (err) {
        res.status(401).json({ message: "Organizer not found", status: false });
        return false;
      }
      if (isMatchOrganizer) {
        if (bdata.name == isMatchOrganizer.name) {
          res
            .status(401)
            .json({ message: "Organizer Already Exist", status: false });
          return false;
        }
        if (bdata.contactno == isMatchOrganizer.contactno) {
          res
            .status(401)
            .json({ message: "Contact Number Already Exist", status: false });
          return false;
        }
        if (bdata.email == isMatchOrganizer.email) {
          res
            .status(401)
            .json({ message: "Email Already Exist", status: false });
          return false;
        }
      }

      organizer.findByIdAndUpdate(
        organizerID,
        {
          $set: bdata,
        },
        (err, data) => {
          if (data) {
            res.status(200).json({
              data: bdata,
              message: "Update Organizer",
              status: true,
            });
          }
        }
      );
    }
  );
};

const deleteOrganizer = async (req, res) => {
  const organizerID = req.params.organizerID;

  let findOrganizer = await organizer.find({ _id: organizerID });
  if (!findOrganizer.length > 0) {
    res.status(401).json({ message: "Organizer ID not found", status: false });
    return false;
  }

  let deleteOrganizer = await organizer.deleteOne({ _id: organizerID });
  if (deleteOrganizer.deletedCount > 0) {
    res.status(200).json({ message: "Organizer Deleted", status: true });
  }
};

module.exports = {
  organizerList,
  addOrganizer,
  editOrganizer,
  updateOrganizer,
  deleteOrganizer,
};
