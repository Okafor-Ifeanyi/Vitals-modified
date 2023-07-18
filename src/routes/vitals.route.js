const router = require('express').Router();
const validate = require('../middlewares/validate.middleware')
const { isAuth } = require('../middlewares/authentication.middleware')
const { doctorAuth, patientAuth } = require('../middlewares/path.middleware')
const { createSchema } = require("../schemas/vitals.schema")

const { createVital,
        getVitalByID,
        getMyVitals } = require('../controllers/vitals.controller');

router.post("/:id", validate(createSchema), isAuth, doctorAuth, createVital);
router.get("/me", isAuth, patientAuth, getMyVitals);
router.get("/:vitalID", isAuth, getVitalByID);

module.exports = router;