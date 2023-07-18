constnextOfKinService = require("../services/nextOfKin.service")

exports.createnextOfKin = async (req, res) => {
    // const patientID = req.user
    const patientID = req.user
    const nextOfKinInfo = req.body

    try {
            const nextOfKinData = await nextOfKinService.createnextOfKin({...nextOfKinInfo, patientID})
            return res.status(200).json({
                Success: true,
                message: nextOfKinData
            })
        
    } catch (error) {
        res.status(500).json({
            "Success": false,
            "message": error.message
        });
    }
}

// Fetch all nextOfKin by ID
exports.getAllPatientnextOfKin = async (req, res) => {
    const patientID = req.user

    try{
        const nextOfKinData = await nextOfKinService.getAll({ patientID: patientID })
        const latestnextOfKin = nextOfKinData[nextOfKinData.length - 1]

        return res.status(201).json({
            success: true,
            message: 'Patient next of Kin fetched successfully',
            latestnextOfKin: latestnextOfKin,
            totalnextOfKin: nextOfKinData,
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })                       
    }
}
// Fetch nextOfKin by ID
exports.getnextOfKinByID = async (req, res) => {
    const _id = req.params.id
    
    try{
        const nextOfKinData = await nextOfKinService.findOne({ _id })

        return res.status(201).json({
            success: true,
            message: 'Patient next of Kin fetched successfully',
            data: nextOfKinData
        })
    } catch (error) {
        res.status(403).json({ success: false, message: error.message })                       
    }
}

