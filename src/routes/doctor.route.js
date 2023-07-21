const router = require('express').Router();
const validate = require('../middlewares/validate.middleware')
const { isAuth } = require('../middlewares/authentication.middleware')
const { doctorAuth } = require('../middlewares/path.middleware')
const { RegisterSchema,
        LoginSchema, 
        UpdateSchema, 
        forgotPasswordSchema, resetPasswordSchema } = require("../schemas/doctor.schema")
const { hcpRefSchema } = require("../schemas/hcpRef.schema")
// getDoctorByID
const { register,
        login,
        updateDoctor,
        deleteDoctor,
        wipeDoctor,
        getDoctorByID,
        getMyProfile,
        getHcpRequests,
        grantHcpRequests,
        removeHcp,
        getMyHcps,
        getAHcp,
        registerHCP,
        forgotPassword,
        resetPassword,
        fetchAllDoctors } = require('../controllers/doctor.controller');
        
// Doctor CRUD and Queries
router.post("/login", validate(LoginSchema), login);
router.post("/register", validate(RegisterSchema), register);
router.patch("/", validate(UpdateSchema), isAuth, updateDoctor);
router.delete("/", isAuth, deleteDoctor);
router.delete("/wipe/:id", isAuth, wipeDoctor);
router.get("/", isAuth, getMyProfile);


// Reset Password
router.put("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.put("/reset-password", validate(resetPasswordSchema), resetPassword);

// HealthCare Provider Application Request
router.post("/hcpref", validate(hcpRefSchema), isAuth, doctorAuth, registerHCP);
router.get("/req", isAuth, doctorAuth, getHcpRequests);
router.get("/req/:id", isAuth, doctorAuth, grantHcpRequests);
router.delete("/req/:id", isAuth, doctorAuth, removeHcp);

// Health care provider funtionalities as a Doctor
router.get("/hcps", isAuth, doctorAuth, getMyHcps);
router.get("/hcps/:id", isAuth, doctorAuth, getAHcp);

// Reset Password
router.post("/forgot", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset/:token", validate(resetPasswordSchema), resetPassword);

// healthRecords
router.get("doctor/hcps/:id/");

// Global search
router.get("/all", fetchAllDoctors); 
router.get("/:id", getDoctorByID); 

module.exports = router;