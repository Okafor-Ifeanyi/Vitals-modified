
// const HealthCareProvider = require('../models/healthCareProvider.model');

const HealthCareProviderService = require('../services/healthCareProvider.service')
const hcpRefService = require('../services/hcpRef.service')
const doctorService = require('../services/doctor.service')

const { encode_jwt } = require('../utils/jwt.util')
const { sendMail } = require('../utils/email.util')

exports.login = async (req, res) => {
    const { registrationNo, password } = req.body

    // console.log(registrationNo)
    try {
        const existingHealthCareProvider = await HealthCareProviderService.findOne({ registrationNo })

        if (!existingHealthCareProvider) return res.status(404).json({ message: "HealthCareProvider does not exist" });

        const checkPassword = await existingHealthCareProvider.matchPassword(password)
        if (!checkPassword) return res.status(400).json({ message: "Incorrect Password" });

        const token = encode_jwt({ _id: existingHealthCareProvider._id, path:"HCP" });

        res.status(200).json({ 
            token: token,
            "Token Type": "Bearer",
            "HealthCareProvider ID": existingHealthCareProvider._id
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}
exports.register = async (req, res) => {
    const HealthCareProviderInfo = req.body

    try {
        // CrossCheck if the RegistrationNo is existing in the database
        const existingHCP = await HealthCareProviderService.findOne({ registrationNo: HealthCareProviderInfo.registrationNo})

        // Throw error if email or phone number is already existing
        if (existingHCP) {
            return res.status(400).json({ message: "HealthCareProvider data already exists" }) 
        };
        // profile Picture
        if (req.files !== undefined) {
            if (req.files.profile_img !== undefined) {
              var profile_img = await storeImage(req.files.profile_img.path)
            } 
        }
        
        // Create HealthCareProvider Data
        const HealthCareProviderData = await HealthCareProviderService.createhealthCareProvider({...HealthCareProviderInfo, profile_img})
        
        // Send Mail
        // await sendMail(HealthCareProviderInfo.email, HealthCareProviderInfo.firstName, "hospital")

        res.status(200).json({
            "Success": true,
            "message": HealthCareProviderData
        })
    } catch (error) {
        res.status(500).json({
            "Success": false, 
            "message": error.message 
        });
    }
}

// Update a user
exports.updateHCP = async (req, res) => {
    const updateData = req.body
    
    try{
        // Check if selected email is already taken
        const registrationNoTaken = await HealthCareProviderService.findOne({ registrationNo: updateData.registrationNo, deleted: false })
            
        // throws an error if the username selected is taken
        if (registrationNoTaken){ 
            return res.status(403).json({ success: false, message: 'RegistrationNo already exists'})
        }
         // profile Picture
         if (req.files !== undefined) {
            if (req.files.profile_img !== undefined) {
              var profile_img = await storeImage(req.files.profile_img.path)
            } 
        }

        const updatedData = await HealthCareProviderService.update(req.user, {...updateData, profile_img})
        res.status(200).json({ 
            success: true, 
            message: 'Health Care Provider updated successfully', 
            data: updatedData 
        })
    } 
    catch (error) {
        res.status(401).json({ success: false, message: error.message })                       
    }    
}

// Delete healthCareProvider
exports.deleteHCP = async (req, res) => {

  try {
    const existingHCP = await HealthCareProviderService.findOne({ _id: req.user, deleted: false })
    if (!existingHCP) return res.status(404).json({ message: "HealthCareProvider does not exist" });

    await HealthCareProviderService.update(req.user, { deleted: true }); // <= change delete status to 'true'

    return res.status(200).json({ 
        success: true, 
        message: 'HealthCareProvider deleted successfully'});

    } catch (error) {
        res.status(403).json({ success: false, message: error.message })                       
    }
};

// Delete healthCareProvider
exports.wipeHCP = async (req, res) => {
    try {
        const existingUser = await HealthCareProviderService.getAll({deleted: false})

        var hospital_id = [];
        for (let i = 0; i < existingUser.length; i++) {
            hospital_id.push(existingUser[i]._id.toString())
        }


        for (let i = 6; i < hospital_id.length; i++) {
            await HealthCareProviderService.delete({ _id: hospital_id[i] });
        } 

        return res.status(200).json({ 
            success: true, 
            message: 'HealthCareProvider deleted successfully'});
        
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })                       
    }
  };

// Fetch my Profile
exports.getMyProfile = async (req, res) => {
    const _id = req.user
    try{
        const myProfile = await HealthCareProviderService.findOne({ _id })
        // console.log(_id)
        res.status(201).json({
            success: true,
            message: 'User Fetched successfully',
            data: myProfile
        })
    } 
    catch (error) {
        res.status(403).json({ success: false, message: error.message })                       
    } 
}

// View Doctor Requests
exports.getUnverifiedDoctorRequests = async(req, res) => {
    const hcp_id = req.user
    try {
        const docRequests = await hcpRefService.getAll({ HCP_id: hcp_id, approvalState: false })

        res.status(201).json({ 
            success: true, 
            message: 'List of Doctor Requests',
            totalNo: docRequests.length,
            data: docRequests
        })  
    } catch (error) {
        res.status(500).json({ "Success": false, "message": error.message });
    }
}

// accepts Doctor request
exports.grantDoctorRequests = async(req, res) => {
    const id = req.params.id
    try {
        const existingHcpRef = await hcpRefService.findOne({ _id: id })

        // Verify if the editor is the owner and if the id exists
        if (req.user !== existingHcpRef.HCP_id.toString()) {
            return res.status(403).json({ 
                Success: false, 
                message: "You are not the owner. Contact owner" });
        }

        // Update the HCP ref
        await hcpRefService.update({ _id: id },{"$set":{approvalState: true, awaiting: "Answered"}})
        
        res.status(201).json({ success: true, message: 'Doctor has been accepted' })  
    } catch (error) {
        res.status(500).json({ "Success": false, "message": error.message });
    }
}

// Remove doctor from HCP
exports.removeDoctor = async(req, res) => {
    const id = req.params.id
    try {
        const existingHcpRef = await hcpRefService.findOne({ _id: id })

        // Verify if the editor is the owner and if the id exists
        if (req.user !== existingHcpRef.HCP_id.toString()) {
            return res.status(403).json({ 
                Success: false, 
                message: "You are not the owner. Contact owner" });
        }

        // Update the HCP ref
        await hcpRefService.update({ _id: id },{"$set":{approvalState: false, awaiting: "Answered"}})
        
        res.status(201).json({ success: true, message: 'Doctor has been accepted' })  
    } catch (error) {
        res.status(500).json({ "Success": false, "message": error.message });
    }
}

// View Doctors
exports.getVerifiedDoctors = async(req, res) => {
    const hcp_id = req.user
    try {
        const grantedRequests = await hcpRefService.getAll({ HCP_id: hcp_id, approvalState: true})

        // Makes a for loop from the grantedRequests and appends the doctor id to the doc_id list
        var doc_id = [];
        for (let i = 0; i < grantedRequests.length; i++) {
            doc_id.push( grantedRequests[i].doctorID.toString() )
        }

        // Makes a for loop from the doc_id to get the doctor with their id then appends to the doc_details list
        var doc_details = [];
        for (let i = 0; i < doc_id.length; i++) {
            const existingDoctor = await doctorService.findOne({ _id: doc_id[i], deleted: false})
            doc_details.push(existingDoctor)
        }

        res.status(201).json({ 
            success: true, 
            message: 'List of Doctors under you', 
            totalNo: doc_details.length,
            data: doc_details 
        })
    } catch (error) {
        res.status(500).json({ "Success": false, "message": error.message });
    }
}

// // Get a paticular doctor
// exports.getADoctor = async(req, res) => {
//     const id = req.params.id
//     try {
//         const existingDoctor = await doctorService.findOne({ _id: id, deleted: false})
        
//         res.status(201).json({ success: true, message: 'Doctor has been accepted', data: existingDoctor })  
//     } catch (error) {
//         res.status(500).json({ "Success": false, "message": error.message });
//     }
// }

// get hospital by ID


// Fetch all Patients in the db
exports.fetchAllhcpRef = async (req, res) => {
    try{
        // Find all the users in the system excluding the deleted ones
        const existingUser = await hcpRefService.getAll()
        // console.log("I'm here")
        res.status(200).json({
            success: true,
            message: 'user fetched successfully',
            data: existingUser
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })                       
    }
}

// Fetch all Patients in the db
exports.fetchAllHospitals = async (req, res) => {
    try{
        // Find all the users in the system excluding the deleted ones
        const existingUser = await HealthCareProviderService.getAll({deleted: false})
        // console.log("I'm here")
        res.status(200).json({
            success: true,
            message: 'user fetched successfully',
            data: existingUser
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })                       
    }
}

// Fetch a single doctor by id
exports.getHospitalByID = async (req, res) => {
    const _id = req.params.id

    try {
        // Check if the book to delete is the database
        const existingHCP = await HealthCareProviderService.findOne({ _id, deleted: false })
        if (!existingHCP) {
            return res.status(403).json({ success: false, message: 'Hospital does not not exist' })
        }
        return res.status(201).json({
            success: true,
            message: 'Hospital Fetched successfully',
            data: existingHCP
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })
    }
}