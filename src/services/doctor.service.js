const doctorModel = require("../models/doctor.model")

class doctorService {

    // register a doctor model
    async createDoctor(doctor) {
        return await doctorModel.create(doctor)
    }

    // Edit a doctor
    async update(id, doctorData) {
        return await doctorModel.findByIdAndUpdate(id, doctorData, { 
            new: true
        })
    }

    // Delete a doctor
    async delete(filter){
        return await doctorModel.findByIdAndDelete(filter)
    }

    // find a doctor by their id
    async findOne(filter){
        return await doctorModel.findOne(filter)
    } 

    // Get all doctors 
    async getAll(filter) {
        return await doctorModel.find(filter)
    }
}

module.exports = new doctorService()