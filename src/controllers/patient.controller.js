// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const Patient = require('../models/patient.model');

const patientService = require("../services/patient.service");
const { encode_jwt } = require('../utils/jwt.util');
const { storeImage } = require('../utils/cloudinary.util');
const { sendMail } = require('../utils/email.util');


const mailgun = require("mailgun-js");
const _ = require("lodash");
const DOMAIN = "sandboxf26a5c38b52e4da68cd059e6c4d2daba.mailgun.org";
// const mg = mailgun({ apiKey: process.env.MAILIGUN_APIKEY, domain: DOMAIN });

// Login Patient
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingPatient = await patientService.findOne({
      email: email,
      deleted: false,
    });
    if (!existingPatient)
      return res.status(404).json({ message: "Patient does not exist" });

    const checkPassword = await existingPatient.matchPassword(password);
    if (!checkPassword)
      return res.status(400).json({ message: "Incorrect Password" });

    const token = encode_jwt({ _id: existingPatient._id, path: "patient" });

    res.status(200).json({
      token: token,
      Token_Type: "Bearer",
      Patient_ID: existingPatient._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register Patient
exports.register = async (req, res) => {
  const patientInfo = req.body;

  try {
    // CrossCheck if the email or phone number is existing in the database
    const existingEmail = await patientService.findOne({
      email: patientInfo.email,
    });
    const existingNumber = await patientService.findOne({
      phoneNumber: patientInfo.phoneNumber,
    });

    // Throw error if email or phone number is already existing
    if (existingEmail || existingNumber) {
      return res.status(400).json({ message: "Patient data already exists" });
    }

    // profile Picture
    if (req.files !== undefined) {
      if (req.files.profile_img !== undefined) {
        var profile_img = await storeImage(req.files.profile_img.path)
      } 
    }

    // generate Verification code
    const verification_code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    // console.log(verification_code)

    // Create Patient
    const patientData = await patientService.createPatient({...patientInfo, profile_img, verification_code});

    // Send Welcoming Email
    const welcome = await sendMail(patientInfo.email, patientInfo.firstName, "patient")
    
    // send Verification Code Email
    const verify = await sendMail(patientInfo.email, verification_code, "verification")

    {welcome, verify}

    // Response
    res.status(200).json({ Success: true, message: patientData });

  } catch (error) {
    res.status(500).json({ Success: false, message: error.message }) 
  }
};

// Verify User
exports.verifyPatient = async(req, res) => {
  const { code } = req.body
  const email = req.params.email
  
  try {
    // Check for existing patient
    const existingPatient = await patientService.findOne({ email, deleted: false });

    if (!existingPatient) {
      return res.status(404).json({ message: "Patient does not exist" }) };

    // Match the provided code to the stored code
    const verify = await existingPatient.matchVerificationCode(code);
    
    if (!verify) {
      return res.status(400).json({ message: "Incorrect code" }) };
    
    // Update patient status to verified
    const verifiedPatient = await patientService.update({ _id: existingPatient._id }, { "$set": { verified: true } })

    return res.status(200).json({
      success: true,
      message: "Your account has been verified",
      patient: verifiedPatient
    });

  } catch (error) {
      res.status(500).json({ Success: false, message: error.message }) 
  }
}

// Update a user
exports.updatePatient = async (req, res) => {
    const updateData = req.body
    
    try{
        // Check if selected email is already taken
        if(updateData.email){
            const emailAvailable = await patientService.findOne({ email: updateData.email, deleted: false })
                
            // throws an error if the username selected is taken
            if (emailAvailable){ 
                return res.status(403).json({ success: false, message: 'User with updated email already exists'})
            }
        }

        // profile Picture
        if (req.files !== undefined) {
          if (req.files.profile_img !== undefined) {
            var profile_img = await storeImage(req.files.profile_img.path)
          } 
        }

        const updatedData = await patientService.update(req.user, {...updateData, profile_img})

        return res.status(200).json({ 
            success: true, 
            message: 'Patient updated successfully', 
            data: updatedData 
        })
    } 
    catch (error) {
        return res.status(401).json({ success: false, message: error.message })                       
    }    
}

// Delete a Patient
exports.deletePatient = async (req, res) => {
  try {
    const existingPatient = await patientService.findOne({
      _id: req.user,
      deleted: false,
    });
    if (!existingPatient)
      return res.status(404).json({ message: "Patient does not exist" });

    await patientService.update(req.user, { deleted: true }); // <= change delete status to 'true'

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

// Wipe a Patient
exports.wipePatient = async (req, res) => {
  const _id = req.params.id

  try {
    const existingPatient = await patientService.findOne({ _id });
    if (!existingPatient)
      return res.status(404).json({ message: "Patient does not exist. Literally!!" });

    await patientService.delete( _id ); // <= actually deletes the patient from the db

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

// Fetch a single patient by email
exports.getPatientByEmail = async (req, res) => {
  const email = req.params.email;

  try {
    // Check if the book to delete is the database
    const existingPatient = await patientService.findOne({
      email: email,
      deleted: false,
    });

    if (!existingPatient) {
      return res
        .status(403)
        .json({ success: false, message: "Patient does not not exist" });
    }
    return res.status(201).json({
      success: true,
      message: "Patient Fetched successfully",
      data: existingPatient,
    });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

// Fetch my Profile
exports.getMyProfile = async (req, res) => {
  try {
    const myProfile = await patientService.findOne({
      _id: req.user,
      deleted: false,
    });

    res.status(201).json({
      success: true,
      message: "User Fetched successfully",
      data: myProfile,
    });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

// Fetch my Profile
exports.getpatientByID= async (req, res) => {
  try {
    const myProfile = await patientService.findOne({
      _id: req.params.id,
      deleted: false,
    });

    res.status(201).json({
      success: true,
      message: "User Fetched successfully",
      data: myProfile,
    });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

// Fetch all Patients in the db
exports.fetchAllPatients = async (req, res) => {
  try {
    // Find all the users in the system excluding the deleted ones
    const existingUser = await patientService.getAll({ deleted: false });

    res.status(200).json({
      success: true,
      message: "user fetched successfully",
      data: existingUser,
    });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

// Rest Patient Password
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  // See if a Patient with that email exists
  const availablePatient = doctorService.findOne({ email });

  if (!availablePatient) {
    return res
      .status(400)
      .json({ error: "Patient with this email does not exist" });
  } else {
    const token = jwt.sign(
      { _id: req.params.id },
      process.env.RESET_PASSWORD_KEY,
      { expiresIn: "20m" }
    );
    const data = {
      from: "noreply@hello.com",
      to: email,
      subject: "Account Activation Link",
      html: `
                    <h2>Please click on given link to reset your password</h2>
                    <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
                    `,
    };

    const resetLink = patientService.updateOne({ resetLink: token });

    if (!resetLink) {
      return res.status(400).json({ error: "Reset password link error" });
    } else {
      mg.messages().send(data, (error, body) => {
        if (error) {
          return res.json({
            erorr: error.message,
          });
        }
        return res.json({
          message: "Email has been sent, kindly follow the instructions",
        });
      });
    }
  }
};

// Reset Patient Password
exports.resetPassword = (req, res) => {
    const {resetLink, newPassword} = req.body;
    if(resetLink) {
        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, (error, decoddedData) => {
            if(error) {
                return res.status(401).json({
                    error: 'Incorrect token or it is expired'
                });
            }
            const availablePatient = patientService.findOne({resetLink });

            if(!availablePatient) {
                return res.status(400).json({error: "Patient with this token does not exist"});
            }
            const obj = {
                password: newPassword
            }

            availablePatient = _.extend(availablePatient, obj);
            availablePatient.save((err, result) => {
                if(err) {
                    return res.json({
                        error: err.message
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Your password has been changed'
                });
            })
        })
    } else {
        return res.status(401).json({
            error: 'Authentication errror!!'
        });
    }
}