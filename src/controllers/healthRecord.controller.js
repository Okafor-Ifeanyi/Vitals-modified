const healthRecordService = require("../services/healthRecord.service")
const patientService = require('../services/patient.service')

// Create HealthRecord as a Doctor
exports.createHealthRecord = async (req, res) => {
    const doctor_id = req.user
    const healthRecordInfo = req.body
    const HCP_id = req.originalUrl.slice(21, 45);

    try {
        const healthRecordData = await healthRecordService.createHealthRecord(
            {...healthRecordInfo, doctor_id, HCP_id})
        return res.status(200).json({ Success: true, message: healthRecordData })
    } catch (error) {
        res.status(500).json({ "Success": false, "message": error.message });
    }
}

// Approve HealthRecord as a Doctor
exports.approveHealthRecord = async (req, res) => {
    const healthRecordID = req.params.id
    try {
        // Update the HCP ref
        const existingHealthRecord = await healthRecordService.findOne({ _id: healthRecordID })
        if (!existingHealthRecord) return res.status(404).json({success: false, message:"HealthRecord not found"})

        await healthRecordService.update({
            _id: healthRecordID
        },
            {
                "$set": { approvalState: true, status: "Attended" }
            })
        return res.status(200).json({ Success: true, message: "This healthRecord has been attended to" })

    } catch (error) {
        res.status(500).json({ "Success": false, "message": error.message });
    }
}
// Cancel HealthRecord as a Doctor
exports.cancelHealthRecord = async (req, res) => {
    const healthRecordID = req.body
    try {
        // Update the HCP ref
        await healthRecordService.update({
            _id: healthRecordID
        },
            {
                "$set": { approvalState: true, status: "Cancelled", deleted: true }
            })
        return res.status(200).json({ Success: true, message: "This healthRecord has been Cancelled" })

    } catch (error) {
        res.status(500).json({ "Success": false, "message": error.message });
    }
}


// Fetch all healthRecord for doctor
exports.getAllDoctorHealthRecords = async (req, res) => {
    const doctor_id = req.user

    try {
        const healthRecordData = await healthRecordService.getAll({ doctor_id })

        return res.status(201).json({
            success: true,
            message: 'Patient healthRecord fetched successfully',
            total: healthRecordData.length,
            totalhealthRecords: healthRecordData,
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })
    }
}

// Fetch all unattended healthRecord for doctor
exports.getUnattendedHealthRecords = async (req, res) => {
    const doctor_id = req.user

    try {
        const healthRecordData = await healthRecordService.getAll({ doctor_id, approvalState: false })

        return res.status(201).json({
            success: true,
            message: 'Patient healthRecord fetched successfully',
            totalhealthRecords: healthRecordData.length,
            totalhealthRecords: healthRecordData,
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })
    }
}

// Delete healthRecord
exports.deleteHealthRecord = async (req, res) => {
    const _id = req.params.id
    try {
        const existingHealthRecord = await healthRecordService.findOne({ _id });
        if (!existingHealthRecord)
        return res.status(404).json({ message: "HealthRecord does not exist" });
        
        await healthRecordService.delete({ _id: _id }); // <= change delete status to 'true'
  
      return res.status(200).json({
        success: true,
        message: "HealthRecord deleted successfully"
      });
    } catch (error) {
      res.status(403).json({ success: false, message: error.message });
    }
};

// Fetch all patient under a doctor for
exports.getAllDoctorsPatients = async (req, res) => {
    const doctor_id = req.user

    try {
        const healthRecordData = await healthRecordService.getAll({ doctor_id })

        // Makes a for loop from the healthRecordData and appends the patient id to the patient_id list
        var patient_id = [];
        for (let i = 0; i < healthRecordData.length; i++) {
            patient_id.push(healthRecordData[i].patient_id.toString())
        }

        const patients = [...new Set(patient_id)];

        // Makes a for loop from the patient_id to get the doctor with their id then appends to the patient_details list
        var patient_details = [];
        for (let i = 0; i < patients.length; i++) {
            const existingPatient = await patientService.findOne({ _id: patients[i], deleted: false })
            patient_details.push(existingPatient)
        }

        return res.status(201).json({
            success: true,
            message: 'Patient healthRecord fetched successfully',
            totalNo: patient_details.length,
            totalPatients: patient_details,
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })
    }
}

// Fetch all healthRecord for healthCareProvider
exports.getAllHCPhealthRecords = async (req, res) => {
    const HCP_id = req.user

    try {
        const Data = await healthRecordService.getAll({ HCP_id })

        return res.status(201).json({
            success: true,
            message: 'Patient healthRecords fetched successfully',
            Total_Count: Data.length,
            HealthRecords: Data
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })
    }
}

// Fetch all patient for healthCareProvider
exports.getAllHCPsPatients = async (req, res) => {
    const HCP_id = req.user

    try {
        const healthRecordData = await healthRecordService.getAll({ HCP_id })

        // Makes a for loop from the healthRecordDatas and appends the doctor id to the patient_id list
        var patient_id = [];
        for (let i = 0; i < healthRecordData.length; i++) {
            patient_id.push(healthRecordData[i].patient_id.toString())
        }

        const patients = [...new Set(patient_id)];

        // Makes a for loop from the doc_id to get the patient with their id then appends to the patient_details list
        var patient_details = [];
        for (let i = 0; i < patients.length; i++) {
            const existingPatient = await patientService.findOne({ _id: patients[i], deleted: false })
            patient_details.push(existingPatient)
        }

        return res.status(201).json({
            success: true,
            message: 'Patient healthRecord fetched successfully',
            totalNo: patient_details.length,
            totalhealthRecords: patient_details,
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })
    }
}

// Fetch all healthRecord for healthCareProvider
exports.getAllPatientHealthRecord = async (req, res) => {
    const patient_id = req.user

    try {
        const Data = await healthRecordService.getAll({ patient_id })

        return res.status(201).json({
            success: true,
            message: 'Patient healthRecords fetched successfully',
            Total_Count: Data.length,
            HealthRecords: Data.reverse()
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })
    }
}

// Fetch all healthRecord for healthCareProvider
exports.docGetAllPatientHealthRecord = async (req, res) => {
    const doctor_id = req.user
    const patient_id = req.params.id

    try {
        const Data = await healthRecordService.getAll({ patient_id })

        return res.status(201).json({
            success: true,
            message: 'Patient healthRecords fetched successfully',
            Total_Count: Data.length,
            HealthRecords: Data.reverse()
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })
    }
}