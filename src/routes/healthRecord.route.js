const router = require('express').Router();
const validate = require('../middlewares/validate.middleware')
const { isAuth } = require('../middlewares/authentication.middleware')
const { doctorAuth } = require('../middlewares/path.middleware')
const { createSchema } = require("../schemas/healthRecord.schema")

const { createHealthRecord,
        approveHealthRecord,
        cancelHealthRecord,
        deleteHealthRecord, 
        getAllDoctorHealthRecords,
        getUnattendedHealthRecords,
        docGetAllPatientHealthRecord,
        getAllDoctorsPatients } = require('../controllers/healthRecord.controller');

// HealthRecord CRUD and Queries
router.post("/create", validate(createSchema), isAuth, doctorAuth, createHealthRecord);
router.delete("/:id", isAuth, doctorAuth, cancelHealthRecord);

// router.delete("/:id", isAuth, doctorAuth, deleteHealthRecord);
router.get("/all", isAuth, doctorAuth, getAllDoctorHealthRecords);
router.get("/patients", isAuth, doctorAuth, getAllDoctorsPatients);

router.get("/patients/:id/healthRecord", isAuth, doctorAuth, docGetAllPatientHealthRecord);

router.get("/pending", isAuth, doctorAuth, getUnattendedHealthRecords);
router.get("/:id", isAuth, doctorAuth, approveHealthRecord);


module.exports = router;