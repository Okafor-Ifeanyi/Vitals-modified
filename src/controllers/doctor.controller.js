// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor.model');

const doctorService = require('../services/doctor.service')
const hcpRefService = require('../services/hcpRef.service')
const hcpProviderService = require('../services/healthCareProvider.service')
const patientService = require('../services/patient.service')
const { encode_jwt } = require('../utils/jwt.util')
const { sendMail } = require('../utils/email.util')
const { storeImage } = require('../utils/cloudinary.util');

// const mailgun = require('mailgun-js');
const _ = require('lodash');
// const DOMAIN = 'sandbox550cb5b8a4a34a4a87ec1ecb19d72bed.mailgun.org';
// const mg = mailgun({apiKey: process.env.MAILIGUN_APIKEY,  domain: DOMAIN});

// register a doctor
exports.register = async (req, res) => {
    const doctorInfo = req.body

    try {
        // CrossCheck if the email or phone number is existing in the database
        const existingLicenseNO = await doctorService.findOne({ licenseNO: doctorInfo.licenseNO })

        // Throw error if email or phone number is already existing
        if (existingLicenseNO) {
            return res.status(400).json({ message: "Doctor data already exists" })
        };
        // console.log(profile_img)

        // profile Picture
        if (req.files !== undefined) {
            if (req.files.profile_img !== undefined) {
                var profile_img = await storeImage(req.files.profile_img.path)
            } 
        }
        
        // Create doctor Data
        const doctorData = await doctorService.createDoctor({...doctorInfo, profile_img })
        
        // Send Mail
        await sendMail(doctorInfo.email, doctorInfo.firstName, "doctor")
        
        // Create HCP ref if healthcare provider ID is provided
        if (doctorInfo.healthCareProviderID) {
            await hcpRefService.createHcpRef({
                HCP_id: doctorInfo.healthCareProviderID,
                doctorID: doctorData._id
            })
            // res.status(200).json({ "Success": true, message: "Health Care Provider request sent created"})
        }

        return res.status(200).json({
            "Success": true,
            "message": doctorData
        })
    } catch (error) {
        res.status(500).json({
            "Success": false,
            "message": error.message
        });
    }
}

// login a Doctor
exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const existingDoctor = await doctorService.findOne({ email, deleted: false })
        
        // const existingDoctor = await doctorService.createDoctor.findOne({ email })

        if (!existingDoctor) return res.status(404).json({ message: "Doctor does not exist" });

        const checkPassword = await existingDoctor.matchPassword(password)
        if (!checkPassword) return res.status(400).json({ message: "Incorrect Password" });

        const token = encode_jwt({ _id: existingDoctor.id });

        res.status(200).json({
            token: token,
            "Token_Type": "Bearer",
            "Doctor_ID": existingDoctor._id
        })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

// update a doctor
exports.updateDoctor = async (req, res) => {
    const updateData = req.body

    try {
        // Check if selected email is already taken
        const emailAvailable = await doctorService.findOne({ email: updateData.email, deleted: false })

        // throws an error if the username selected is taken
        if (emailAvailable) {
            return res.status(403).json({ success: false, message: 'Doctor with update email already exists' })
        }

        // profile Picture
        if (req.files !== undefined) {
            if (req.files.profile_img !== undefined) {
              var profile_img = await storeImage(req.files.profile_img.path)
            } 
        }

        const updatedData = await doctorService.update(req.user, {...updateData, profile_img})
        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully',
            data: updatedData
        })
    }
    catch (error) {
        res.status(401).json({ success: false, message: error.message })
    }
}

// Delete a Doctor
exports.deleteDoctor = async (req, res) => {
    try {
        const existingDoctor = await doctorService.findOne({ _id: req.user, deleted: false })
        if (!existingDoctor) return res.status(404).json({ message: "Doctor does not exist" });

        await doctorService.update(req.user, { deleted: true }); // <= change delete status to 'true'

        return res.status(200).json({
            success: true,
            message: 'Doctor deleted successfully'
        });

    } catch (error) {
        res.status(403).json({ success: false, message: error.message })
    }
}

// Wipe a Doctor
exports.wipeDoctor = async (req, res) => {
    const _id = req.params.id
  
    try {
      const existingDoctor = await doctorService.findOne({ _id });
      if (!existingDoctor)
        return res.status(404).json({ message: "doctor does not exist. Literally!!" });
  
      await doctorService.delete( _id ); // <= actually deletes the patient from the db
  
      return res.status(200).json({
        success: true,
        message: "doctor deleted successfully",
      });
    } catch (error) {
      res.status(403).json({ success: false, message: error.message });
    }
  };

// Fetch a single doctor by id
exports.getDoctorByID = async (req, res) => {
    const _id = req.params.id

    try {
        // Check if the book to delete is the database
        const existingDoctor = await doctorService.findOne({ _id, deleted: false })

        if (!existingDoctor) {
            return res.status(403).json({ success: false, message: 'Doctor does not not exist' })
        }
        return res.status(201).json({
            success: true,
            message: 'Doctor Fetched successfully',
            data: existingDoctor
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })
    }
}

// Fetch all doctors in the db
exports.fetchAllDoctors = async (req, res) => {

    try {
        // Find all the users in the system excluding the deleted ones
        const existingDoctor = await doctorService.getAll({ deleted: false })

        res.status(200).json({
            success: true,
            message: 'user fetched successfully',
            data: existingDoctor
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })
    }
}

exports.registerHCP = async (req, res) => {
    // hcpRef
    const Data = req.body

    try {
        // console.log("dd")
        // check if it exists
        const existingHcpRef = await hcpRefService.findOne({ HCP_id: Data.HCP_id, doctorID: req.user })
        
        if (existingHcpRef) {
            return res.status(401).json({ Success: true, message: "This Request already Exists" });
        }

        const doctorRequest = await hcpRefService.createHcpRef({ HCP_id: Data.HCP_id, doctorID: req.user })
        res.status(200).json({
            "Success": true,
            "message": doctorRequest
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })
    }
}

// Forgot Password
exports.forgotPassword = ( req, res) => {
    const { email } = req.body;
 
        // See if a user with that email exists
        const availableDoc = doctorService.findOne({ email });

            if(!availableDoc) {
                return res.status(400).json({error: "Doctor with this email does not exist"});
            } else {
            
            const token = jwt.sign({_id: req.params.id}, process.env.RESET_PASSWORD_KEY, {expiresIn: '20m'});
            const data = {
                from: 'noreply@hello.com',
                to: email,
                subject: 'Account Activation Link',
                html: `
                    <h2>Please click on given link to reset your password</h2>
                    <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
                    `
            };

            const resetLink = Doctor.updateOne({resetLink: token});
             
                if(!resetLink) {
                    return res.status(400).json({error: 'Reset password link error'})
                } else {
                    mg.messages().send(data, (error, body) => {
                        if(error) {
                            return res.json({
                                erorr: error.message
                            });
                        }
                        return res.json({message: 'Email has been sent, kindly follow the instructions'});
                    });
                }
        
        }

}

exports.resetPassword = (req, res) => {
    const {resetLink, newPassword} = req.body;
    if(resetLink) {
        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, (error, decoddedData) => {
            if(error) {
                return res.status(401).json({
                    error: 'Incorrect token or it is expired'
                });
            }
            const availableDoc = doctorService.findOne({resetLink });

            if(!availableDoc) {
                return res.status(400).json({error: "Doctor with this token does not exist"});
            }
            const obj = {
                password: newPassword
            }

            availableDoc = _.extend(availableDoc, obj);
            availableDoc.save((err, result) => {
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

// Fetch doctor Profile
exports.getMyProfile = async (req, res) => {
    try {
        const myProfile = await doctorService.findOne({ _id: req.user, deleted: false })

        res.status(201).json({
            success: true,
            message: 'Doctor Fetched successfully',
            data: myProfile
        })
    }
    catch (error) {
        res.status(403).json({ success: false, message: error.message })
    }
}

// View Hospital Requests
exports.getHcpRequests = async (req, res) => {
    const doctorID = req.user
    try {
        const hcpRequests = await hcpRefService.getAll({ doctorID, approvalState: false })

        res.status(201).json({ success: true, message: 'List of Health Care Provider Requests', data: hcpRequests })
    } catch (error) {
        res.status(500).json({ "Success": false, "message": error.message });
    }
}

// accepts request
exports.grantHcpRequests = async (req, res) => {
    const id = req.params.id
    try {
        const existingHcpRef = await hcpRefService.findOne({ _id: id })

        // Verify if the editor is the owner and if the id exists
        if (req.user !== existingHcpRef.doctorID.toString()) {
            // console.log(existingHcpRef.doctorID)
            return res.status(403).json({
                Success: false,
                message: "You are not the owner. Contact owner"
            });
        }

        // Update the HCP ref
        await hcpRefService.update({ _id: id }, { "$set": { approvalState: true, awaiting: "Answered" } })

        res.status(201).json({ success: true, message: 'HCP has been accepted' })
    } catch (error) {
        res.status(500).json({ "Success": false, "message": error.message });
    }
}

// Remove hospital from HCP
exports.removeHcp = async (req, res) => {
    const id = req.params.id
    try {
        const existingHcpRef = await hcpRefService.findOne({ _id: id })

        // Verify if the editor is the owner and if the id exists
        if (req.user !== existingHcpRef.HCP_id.toString()) {
            return res.status(403).json({
                Success: false,
                message: "You are not the owner. Contact owner"
            });
        }

        // Update the HCP ref
        await hcpRefService.update({ _id: id }, { "$set": { approvalState: false, awaiting: "Answered" } })

        res.status(201).json({ success: true, message: 'Doctor has been accepted' })
    } catch (error) {
        res.status(500).json({ "Success": false, "message": error.message });
    }
}

// View hcps
exports.getMyHcps = async (req, res) => {
    const doctor_id = req.user
    try {
        const grantedRequests = await  hcpRefService.getAll({ doctorID: doctor_id, approvalState: true })
        // Makes a for loop from the grantedRequests and appends the doctor id to the doc_id list
        var hcp_id = [];
        for (let i = 0; i < grantedRequests.length; i++) {
            hcp_id.push(grantedRequests[i].HCP_id.toString())
        }

        // Makes a for loop from the doc_id to get the doctor with their id then appends to the doc_details list
        var hcp_details = [];
        for (let i = 0; i < hcp_id.length; i++) {
            const existingHcp = await hcpProviderService.findOne({ _id: hcp_id[i], deleted: false })
            hcp_details.push(existingHcp)
        }

        res.status(201).json({
            success: true,
            message: 'List of Health Care Providers you are under',
            data: hcp_details
        })
    } catch (error) {
        res.status(500).json({ "Success": false, "message": error.message });
    }
}

// Get a paticular hcp
exports.getAHcp = async (req, res) => {
    const id = req.params.id
    try {
        const existingHcp = await hcpProviderService.findOne({ _id: id, deleted: false })

        res.status(201).json({ success: true, message: 'Health Care Provider has been accepted', data: existingHcp })
    } catch (error) {
        res.status(500).json({ "Success": false, "message": error.message });
    }
}