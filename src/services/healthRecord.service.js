const healthRecordModel = require("../models/healthRecord.model")

class healthRecordService {

    // register a healthRecord model
    async createHealthRecord(healthRecord) {
        return await healthRecordModel.create(healthRecord)
    }

    // Edit a healthRecord
    async update(id, healthRecordData) {
        return await healthRecordModel.findByIdAndUpdate(id, healthRecordData, { 
            new: true
        })
    }

    // Delete a healthRecord
    async delete(filter){
        return await healthRecordModel.findByIdAndDelete(filter)
    }

    // find a healthRecord by their id
    async findOne(filter){
        return await healthRecordModel.findOne(filter)
    } 

    // Get all healthRecords 
    async getAll(filter) {
        return await healthRecordModel.find(filter)
    }
}

module.exports = new healthRecordService()