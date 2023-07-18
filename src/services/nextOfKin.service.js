const vitalsModel = require("../models/vitals.model")

class vitalsService {
    // register a vitals model
    async createVitals(vitals) {
        return await vitalsModel.create(vitals)
    }

    // Edit a vitals
    async update(id, vitalsData) {
        return await vitalsModel.findByIdAndUpdate(id, vitalsData, { 
            new: true
        })
    }

    // Delete a vitals
    // async delete(filter){
    //     return await vitalsModel.findByAndDelete(id)
    // }

    // find a vitals by their id
    async findOne(filter){
        return await vitalsModel.findOne(filter)
    } 

    // Get all vitals 
    async getAll(filter) {
        return await vitalsModel.find(filter)
    }
}

module.exports = new vitalsService()