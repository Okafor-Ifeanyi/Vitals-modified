const patientModel = require("../models/patient.model")

class patientService {

    // register a patient model
    async createPatient(patient) {
        return await patientModel.create(patient)
    }

    // Edit a patient
    async update(id, patientData) {
        return await patientModel.findByIdAndUpdate(id, patientData, { 
            new: true
        })
    }

    // Delete a patient
    async delete(filter){
        return await patientModel.findByIdAndDelete(filter)
    }

    // find a patient by their id
    async findOne(filter){
        return await patientModel.findOne(filter)
    } 

    // Get all patients 
    async getAll(filter) {
        return await patientModel.find(filter)
    }
}

module.exports = new patientService()