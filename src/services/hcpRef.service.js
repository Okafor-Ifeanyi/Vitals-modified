const hcpRefModel = require("../models/hcpRef.model")

class hcpRefService {

    // register a hcpRef model
    async createHcpRef(hcpRef) {
        return await hcpRefModel.create(hcpRef)
    }

    // Edit a hcpRef
    async update(id, hcpRefData) {
        return await hcpRefModel.findByIdAndUpdate(id, hcpRefData, { 
            new: true
        })
    }

    // Delete a hcpRef
    async delete(filter){
        return await hcpRefModel.findByIdAndDelete(filter)
    }

    // find a hcpRef by their id
    async findOne(filter){
        return await hcpRefModel.findOne(filter)
    } 

    // Get all hcpRefs 
    async getAll(filter) {
        return await hcpRefModel.find(filter)
    }
}

module.exports = new hcpRefService()