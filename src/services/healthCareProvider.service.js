const healthCareProviderModel = require("../models/healthCareProvider.model")

class healthCareProviderService {

    // register a healthCareProvider model
    async createhealthCareProvider(healthCareProvider) {
        return await healthCareProviderModel.create(healthCareProvider)
    }

    // Edit a healthCareProvider
    async update(id, healthCareProviderData) {
        return await healthCareProviderModel.findByIdAndUpdate(id, healthCareProviderData, { 
            new: true
        })
    }

    // Delete a healthCareProvider
    async delete(filter){
        return await healthCareProviderModel.findByIdAndDelete(filter)
    }

    // find a healthCareProvider by their id
    async findOne(filter){
        return await healthCareProviderModel.findOne(filter)
    } 

    // Get all healthCareProviders 
    async getAll(filter) {
        return await healthCareProviderModel.find(filter)
    }
}

module.exports = new healthCareProviderService()