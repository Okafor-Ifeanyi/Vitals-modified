const doctorService = require('../services/doctor.service')
const patientService = require('../services/patient.service')
const healthCareProviderService = require('../services/healthCareProvider.service')



exports.doctorAuth = async (req, res, next) => {
    const _id = req.user
    try {
        const existingDoctor = await doctorService.findOne({ _id, deleted: false })

        if (!existingDoctor) {
            return res.status(403).json({
                success: false,
                message: "This user is not an authorized Doctor"
            })
        };

        next();
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

exports.patientAuth = async (req, res, next) => {
    const _id = req.user
    try {
        const existingPatient = await patientService.findOne({ _id, deleted: false })

        if (!existingPatient) {
            return res.status(403).json({
                success: false,
                message: "This user is not an authorized Patient"
            })
        };

        next();
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

exports.healthCareProviderAuth = async (req, res, next) => {
    const _id = req.user
    try {
        const existingDoctor = await healthCareProviderService.findOne({ _id, deleted: false })

        if (!existingDoctor) {
            return res.status(403).json({
                success: false,
                message: "This user is not an authorized HealthCare Provider"
            })
        };

        next();
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}