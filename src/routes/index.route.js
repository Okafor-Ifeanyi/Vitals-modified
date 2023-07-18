const router = require("express").Router();
const patientRouter = require("./patient.route");
const doctorRouter = require("./doctor.route");
const healthRecordRouter = require("./healthRecord.route");
const healthCareProviderRouter = require("./healthCareProvider.route");
const vitalRouter = require("./vitals.route");

require('dotenv').config()

router.get("/docs", (req, res) => 
  res.redirect("https://documenter.getpostman.com/view/19026826/2s93m7X2Jc") );

router.use("/patients", patientRouter);
router.use("/patients/vitals", vitalRouter);
router.use("/doctors", doctorRouter);
router.use("/doctors/hcps/:HCPid/healthRecord", healthRecordRouter);
router.use("/hcps", healthCareProviderRouter);

// route.use(`/${process.env.CODE}`, )
module.exports = router;