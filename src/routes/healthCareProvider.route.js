const router = require('express').Router();
const validate = require('../middlewares/validate.middleware')
const { isAuth } = require('../middlewares/authentication.middleware')
const { healthCareProviderAuth } = require('../middlewares/path.middleware')
const { RegisterSchema , LoginSchema, UpdateSchema } = require("../schemas/healthCareProvider.schema")


const { getDoctorByID } = require("../controllers/doctor.controller")
const { getAllHCPhealthRecords, getAllHCPsPatients } = require("../controllers/healthRecord.controller")
const { register, 
        login,
        updateHCP,
        deleteHCP,
        getMyProfile,
        removeDoctor,
        wipeHCP,
        getVerifiedDoctors,
        grantDoctorRequests,
        getHospitalByID,
        fetchAllHospitals,
        getUnverifiedDoctorRequests } = require('../controllers/healthCareProvider.controller');
        
// HealthCare Provider Requests
router.post("/login", validate(LoginSchema), login);
router.post("/register", validate(RegisterSchema), register);
router.patch("/", validate(UpdateSchema), isAuth, healthCareProviderAuth, updateHCP);
router.delete("/", isAuth, healthCareProviderAuth, deleteHCP);
router.get("/", isAuth, healthCareProviderAuth, getMyProfile);

// Application Requests from doctors
router.get("/req/", isAuth, healthCareProviderAuth, getUnverifiedDoctorRequests);
router.get("/req/:id", isAuth, healthCareProviderAuth, grantDoctorRequests);
router.delete("/req/:id", isAuth, healthCareProviderAuth, removeDoctor);

// Doctors Requests
router.get("/doctors", isAuth, healthCareProviderAuth, getVerifiedDoctors);
router.get("/doctors/:id", getDoctorByID);  // Global Search

// HealthRecords and Patients
router.get("/healthRecords", isAuth, healthCareProviderAuth, getAllHCPhealthRecords);
router.get("/patients", isAuth, healthCareProviderAuth, getAllHCPsPatients);

// Wipe out any existing
router.delete("/wipe", isAuth, wipeHCP);

// Global Search
router.get("/all", fetchAllHospitals);
router.get("/:id", getHospitalByID);


module.exports = router;