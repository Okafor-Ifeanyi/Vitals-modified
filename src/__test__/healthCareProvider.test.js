const supertest = require("supertest")
const createServer = require("../utils/server.utils")
const {connect, closeConnection} = require("./connect")
require('dotenv').config()

const app = createServer(); 
const value = {}
const HcpRef_id = "64c1bd454bf26e76cedbf128"
const doctor_id = "64c1bf3d0832e53b5f9257ca"


const { hospitalPayload,
        wrongPassword,
        hospitalLogin,
        hospitalReg,
        invalidEmailHeReg,
        hospitalUpdate,
        hospitalNoRegistrationNO,
        hospitalWrongConfirmPassword, 
        loginInput} = require("./body")

/* Connecting to the database before each test. */
beforeAll(async () => {
    jest.setTimeout(30000)
    await connect();
});
  
/* Closing database connection after each test. */
afterAll(async () => {
    await closeConnection();
});

describe( "test how to register a hospital", () => {
    // validate the email and phoneNumber doesn't exist
    // testing my joi verification
    describe("testing joi validation", () => {
        test("Test wrong confirm password", async () => {
            const result = await supertest(app)
                    .post("/vitals/hcps/register")
                    .send(hospitalWrongConfirmPassword)
            
            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message)
                .toBe("\"Confirm password\" does not match")
        })

        test("Test missing Registration NO", async () => {
            const result = await supertest(app)
                    .post("/vitals/hcps/register")
                    .send(hospitalNoRegistrationNO)

            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message).toBe("\"registrationNo\" is required")
        })

        // test("Verification Code Schema", async () => {
        //     const result = await supertest(app)
        //             .post("/vitals/hcps/verify/s54@gmail.com")
        //             .send({code: 09754 })
            
        //     // console.log(result.body)
        //     expect(result.statusCode).toBe(422)
        //     expect(result.body.error[0].path).toBe("code")
        // })

        test("Login Schema wrong Registration NO format", async () => {
            const result = await supertest(app)
                    .post("/vitals/hcps/login")
                    .send({registrationNo: 001, password: "ubduwda"})
            
            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message)
                .toBe("\"registrationNo\" must be a string")
        })

        test("Login Schema password min(6) ", async () => {
            const result = await supertest(app)
                    .post("/vitals/hcps/login")
                    .send({registrationNo: `mohd\jbd\l0hh`, password: "ubd"})
            
            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message)
                .toBe('"password" length must be at least 6 characters long')
        })
    })

    describe("Testing hospital Route", () => {
        // Register
        test("Register user", async () => {
            const result = await supertest(app)
                    .post("/vitals/hcps/register")
                    .send(hospitalReg)
        
            expect(result.statusCode).toBe(200)
            expect(result.body.message).toMatchObject({
                    _id : expect.any(String),
                    name: expect.any(String),
                    address: expect.any(String),
                    registrationNo: expect.any(String),
                })
        })

        test("Existing user", async () => {
            const result = await supertest(app)
                    .post("/vitals/hcps/register")
                    .send(hospitalReg)

            expect(result.statusCode).toBe(400)
            expect(result.body.message).toBe('HealthCareProvider data already exists')
        })

        // Login
        test("Login reg Number not found", async () => {
            const result = await supertest(app)
                .post("/vitals/hcps/login")
                .send({registrationNo: "eeddr@gmail.com", password: "jj90kko"})

            expect(result.statusCode).toBe(404)
            expect(result.body).toEqual({
                message: "HealthCareProvider does not exist"
            })
        })

        test("Login Incorrect Password", async () => {
            const result = await supertest(app)
                .post("/vitals/hcps/login")
                .send({registrationNo: "MDCN/R/82426", password: "jj90kko"})
            
            // console.log(result)
            expect(result.statusCode).toBe(400)
            expect(result.body).toEqual({
                message: "Incorrect Password",
            })
        })
        
        test("Login hospital Successful", async () => {
            const result = await supertest(app)
                .post("/vitals/hcps/login")
                .send(hospitalLogin)

            value.key1 = result.body.HealthCareProvider_ID;
            value.key2 = result.body.token
            expect(result.statusCode).toBe(200)
            expect(result.body).toEqual({
                token: expect.any(String),
                Token_Type: "Bearer",
                HealthCareProvider_ID: expect.any(String)
            })
        })

        // Get user
        test("Get my profile as a hospital", async () => {
            const result = await supertest(app)
                    .get(`/vitals/hcps/`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ success: true });
        })

        // test("Get hospital by email", async () => {
        //     const result = await supertest(app)
        //             .get(`/vitals/hcps/email/${hospitalReg.email}`)
            
        //     // Assertions on the response
        //     expect(result.status).toBe(201);
        //     expect(result.body).toMatchObject({ success: true });
        // })

        test("Get hospital by id", async () => {
            const result = await supertest(app)
                    .get(`/vitals/hcps/${value.key1}`)
            
            // console.log(result.body)
            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ success: true }); 
        })

        test("Get all hospitals", async () => {
            const result = await supertest(app)
                    .get(`/vitals/hcps/all`)
                    .set('Authorization', `Bearer ${value.key2}`)

            // Assertions on the response
            expect(result.status).toBe(200);
            expect(result.body).toMatchObject({ success: true }); 
        })

        test("Update User", async () => {
            const result = await supertest(app)
                    .patch(`/vitals/hcps/`)
                    .set('Authorization', `Bearer ${value.key2}`)
                    .send(hospitalUpdate)
            
            // Assertions on the response
            expect(result.status).toBe(200);
            expect(result.body).toMatchObject({ success: true }); // Replace this with your expected response body
        })

        test("Update User with existing Registration Number", async () => {
            const result = await supertest(app)
                    .patch(`/vitals/hcps/`)
                    .set('Authorization', `Bearer ${value.key2}`)
                    .send(hospitalUpdate)
            
            // Assertions on the response
            expect(result.status).toBe(403);
            expect(result.body).toMatchObject({ success: false }); // Replace this with your expected response body
        })
    })
    
    // get all the hcpref in db /hcpref/all
    describe("Testing external routes to store data", () => {
        test("Get all hcpref", async () => {
            const result = await supertest(app)
                    .get(`/vitals/hcps/hcpref/all`)
                    .set('Authorization', `Bearer ${value.key2}`)

            value.HcpRef_id = result.body.data[0]._id.toString()
            // console.log(value.HcpRef_id)
            // Assertions on the response
            expect(result.status).toBe(200);
            expect(result.body).toMatchObject({ success: true }); 
        })

        test("Get all doctors", async () => {
            const result = await supertest(app)
                    .get(`/vitals/doctors/all`)

            value.doctor_id = result.body.data[0]._id.toString()
            console.log(value.doctor_id)

            // Assertions on the response
            expect(result.status).toBe(200);
            expect(result.body).toMatchObject({ success: true }); 
        })
    })

    describe("Testing hospital Route - Health Record", () => {
        // Health Record
        // test("Register user", async () => {
        //     const result = await supertest(app)
        //             .post("/vitals/hcps/hcpref")
        //             .send()
        
        //     expect(result.statusCode).toBe(200)
        //     expect(result.body.message).toMatchObject({
        //             _id : expect.any(String),
        //             firstName: expect.any(String),
        //             lastName: expect.any(String),
        //             email: expect.any(String),
        //             licenseNO: expect.any(String),
        //         })
        // })
        // test("Get all hospital's health Records", async () => {
        //     const result = await supertest(app)
        //             .get(`/vitals/hcps/healthRecords`)
        //             .set('Authorization', `Bearer ${value.key2}`)
            
        //     // Assertions on the response
        //     expect(result.status).toBe(201);
        //     expect(result.body).toMatchObject({ 
        //         success: true, 
        //         Total_Count: expect.any(Number) 
        //     });
        // })

        // Update
        test("Grant doc application - request not found", async () => {
            const result = await supertest(app)
                    .get(`/vitals/hcps/req/${value.doctor_id}`)
                    .set('Authorization', `Bearer ${value.key2}`)

            // Assertions on the response
            expect(result.status).toBe(404);
            expect(result.body).toMatchObject({ 
                success: false, 
                message: "No pending request found" });
            
        })

        test("Grant doc application - Successful", async () => {
            const result = await supertest(app)
                    .get(`/vitals/hcps/req/${value.HcpRef_id}`)
                    .set('Authorization', `Bearer ${value.key2}`)

            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ 
                success: true, 
                message: "Doctor has been accepted" });
            
        })

        // remove doctor from hospital del /req/:id
        test("remove doc from hospital - Successful", async () => {
            const result = await supertest(app)
                    .delete(`/vitals/hcps/req/${value.HcpRef_id}`)
                    .set('Authorization', `Bearer ${value.key2}`)

            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ 
                success: true,  message: "Doctor has been deleted" });
            
        })

        test("remove doc from hospital - request not found", async () => {
            const result = await supertest(app)
                    .delete(`/vitals/hcps/req/${value.doctor_id}`)
                    .set('Authorization', `Bearer ${value.key2}`)

            // Assertions on the response
            expect(result.status).toBe(404);
            expect(result.body).toMatchObject({ 
                success: false,  message: "No pending request found" });
            
        })

        // Get verified doctors /doctors
        test("Get verified doctors", async () => {
            const result = await supertest(app)
                    .get(`/vitals/hcps/doctors`)
                    .set('Authorization', `Bearer ${value.key2}`)

            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ 
                success: true,  
                totalNo: expect.any(Number) 
            });
        })

        // get a doctor /doctors/:id
        test("Get doctors by id", async () => {
            const result = await supertest(app)
                    .get(`/vitals/hcps/doctors/${value.doctor_id}`)

            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ success: true })
            expect(result.body.data).toMatchObject({
                _id: expect.any(String),
                email: expect.any(String),
                specialty: expect.any(String),
                licenseNO: expect.any(String)
            });
        })

        // Get all health Records affiliated to hospital /healthRecords
        test("Get health Records in hospital", async () => {
            const result = await supertest(app)
                    .get(`/vitals/hcps/healthRecords`)
                    .set('Authorization', `Bearer ${value.key2}`)

            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ 
                success: true,  
                Total_Count: expect.any(Number) 
            });
        })

        // Get all patients affiliated to hospital /patients
        test("Get all patients in hospital", async () => {
            const result = await supertest(app)
                    .get(`/vitals/hcps/patients`)
                    .set('Authorization', `Bearer ${value.key2}`)

            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ 
                success: true,  
                totalNo: expect.any(Number) 
            });
        })

        // get all application request form doctors /req
        test("Get all doctors application", async () => {
            const result = await supertest(app)
                    .get(`/vitals/hcps/req`)
                    .set('Authorization', `Bearer ${value.key2}`)

            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ 
                success: true,
                totalNo: expect.any(Number) }); 
        })

        // Delete
        test("Delete User", async () => {
            const result = await supertest(app)
                    .delete(`/vitals/hcps/`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // Assertions on the response
            expect(result.status).toBe(200);
            expect(result.body).toMatchObject({ success: true }); // Replace this with your expected response body
        })

        test("Delete already deleted User", async () => {
            const result = await supertest(app)
                    .delete(`/vitals/hcps/`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // Assertions on the response
            expect(result.status).toBe(403);
            expect(result.body).toMatchObject({ message: "This user is not an authorized HealthCare Provider" }); // Replace this with your expected response body
        })

        // Wipe
        test("Wipe user", async () => {
            // console.log(value.key1)
            // console.log(value)

            const result = await supertest(app)
                    .delete(`/vitals/hcps/wipe`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // console.log(result.body)
            expect(result.statusCode).toBe(200)
            expect(result.body.message).toBe('HealthCareProvider deleted successfully')
        })

        test("Wipe unexisting user", async () => {
            const result = await supertest(app)
                    .delete(`/vitals/hcps/wipe`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // console.log(result)
            expect(result.statusCode).toBe(403)
            expect(result.body).toMatchObject({ success: false })
        })

        // grant doc application request /req/:id
        // test("Grant doc application - Succeful", async () => {
        //     const result = await supertest(app)
        //             .get(`/vitals/hcps/req/${}`)
        //             .set('Authorization', `Bearer ${value.key2}`)

        //     // Assertions on the response
        //     expect(result.status).toBe(201);
        //     expect(result.body).toMatchObject({ success: true });
        //     expect(result.body.HcpRef).toMatchObject({ 
        //         approvalState: true, 
        //         awaiting: "Answered"
        //     }) 
        // })
    })
})