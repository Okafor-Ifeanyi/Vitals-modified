const router = require("express").Router();
const validate = require("../middlewares/validate.middleware");
const { isAuth } = require("../middlewares/authentication.middleware");
const { patientAuth } = require('../middlewares/path.middleware')
const {
  RegisterSchema,
  LoginSchema,
  UpdateSchema,
  forgotPasswordSchema,
  verifyCode,
  resetPasswordSchema } = require("../schemas/patient.schema");

const { getAllPatientHealthRecord } = require("../controllers/healthRecord.controller")
const {
  login,
  register,
  getMyProfile,
  updatePatient,
  deletePatient,
  wipePatient,
  resetPassword,
  forgotPassword,
  fetchAllPatients,
  getpatientByID,
  verifyPatient,
  getPatientByEmail } = require("../controllers/patient.controller");
  
router.post("/login", validate(LoginSchema), login);
router.post("/register", validate(RegisterSchema), register);
router.patch("/", validate(UpdateSchema), isAuth, updatePatient);
router.delete("/", isAuth, deletePatient);
router.delete("/wipe/:id", wipePatient);
router.get("/all", isAuth, fetchAllPatients);
router.get("/", isAuth, getMyProfile);

// HealthRecord
router.get("/healthRecords", isAuth, patientAuth, getAllPatientHealthRecord)

// Reset Password
router.put("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.put("/reset-password", validate(resetPasswordSchema), resetPassword);

// Verify patient 
router.post("/verify/:email", validate(verifyCode), verifyPatient);

// Global Search
router.get("/email/:email", getPatientByEmail);
router.get("/:id", getpatientByID);

// Verify Account
router.get("/email/", getPatientByEmail);


module.exports = router;
