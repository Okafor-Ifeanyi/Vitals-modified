const supertest = require("supertest")
const createServer = require("../utils/server.utils")
const {connect, closeConnection} = require("./connect")
require('dotenv').config()

const app = createServer(); 

const { patientPayload,
        wrongPassword,
        loginInput,
        userInput,
        invalidEmailInput,
        userUpdate, 
        userInput_NoPhoneNumber, 
        userInput_wrongConfirmPassword, 
        userInput_existingPhoneNumber } = require("./body")

/* Connecting to the database before each test. */
beforeAll(async () => {
    await connect();
});
  
/* Closing database connection after each test. */
afterAll(async () => {
    await closeConnection();
});

describe( "test how to register a user", () => {
    // validate the email and phoneNumber doesn't exist
    // testing my joi verification
    describe("testing joi validation", () => {
        test("Test wrong confirm password", async () => {
            const result = await supertest(app)
                    .post("/vitals/patients/register")
                    .send(userInput_wrongConfirmPassword)
            
            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message)
                .toBe("Confirm Password does not match the password")
        })

        test("Test missing phoneNumber", async () => {
            const result = await supertest(app)
                    .post("/vitals/patients/register")
                    .send(userInput_NoPhoneNumber)
            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message).toBe("\"phoneNumber\" is required")
        })

        test("Test invalid email", async () => {
            const result = await supertest(app)
                    .post("/vitals/patients/register")
                    .send(invalidEmailInput)
            
            // console.log(result.body)
            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message).toBe("\"email\" must be a valid email")
        })

        test("Verification Code Schema", async () => {
            const result = await supertest(app)
                    .post("/vitals/patients/verify/s54@gmail.com")
                    .send({code: 09754 })
            
            // console.log(result.body)
            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].path).toBe("code")
        })

        test("Login Schema wrong email", async () => {
            const result = await supertest(app)
                    .post("/vitals/patients/login")
                    .send({email: "moe.com", password: "ubduwda"})
            
            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message)
                .toBe('"email" must be a valid email')
        })

        test("Login Schema password min(6) ", async () => {
            const result = await supertest(app)
                    .post("/vitals/patients/login")
                    .send({email: "moe@gmail.com", password: "ubd"})
            
            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message)
                .toBe('"password" length must be at least 6 characters long')
        })
    })

    describe("Testing Patient Route", () => {
        // Register
        test("Register user", async () => {
            const result = await supertest(app)
                    .post("/vitals/patients/register")
                    .send(userInput)
            // console.log(result)
            expect(result.statusCode).toBe(200)
            expect(result.body.message).toMatchObject({
                    _id : expect.any(String),
                    firstName: expect.any(String),
                    lastName: expect.any(String),
                    email: expect.any(String),
                    phoneNumber: expect.any(String),
                    allergies: expect.any(Array),
                    verified: expect.any(Boolean),
                })
        })

        test("Existing user", async () => {
            const result = await supertest(app)
                    .post("/vitals/patients/register")
                    .send(userInput)
            
            expect(result.statusCode).toBe(400)
            expect(result.body.message).toBe('Patient data already exists')
        })

        // Login
        test("Login email not found", async () => {
            const result = await supertest(app)
                .post("/vitals/patients/login")
                .send({email: "eeddr@gmail.com", password: "jj90kko"})

            expect(result.statusCode).toBe(404)
            expect(result.body).toEqual({
                message: "Patient does not exist"
            })
        })

        test("Login Incorrect Password", async () => {
            const result = await supertest(app)
                .post("/vitals/patients/login")
                .send(wrongPassword)
            
            expect(result.statusCode).toBe(400)
            expect(result.body).toEqual({
                message: "Incorrect Password",
            })
        })

        const value = {}
        test("Login patient Successful", async () => {
            const result = await supertest(app)
                .post("/vitals/patients/login")
                .send(loginInput)
            
            value.key1 = result.body.Patient_ID;
            value.key2 = result.body.token
            expect(result.statusCode).toBe(200)
            expect(result.body).toEqual({
                token: expect.any(String),
                Token_Type: "Bearer",
                Patient_ID: expect.any(String)
            })
        })

        // Get user
        test("Get my profile as a patient", async () => {
            const result = await supertest(app)
                    .get(`/vitals/patients/`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ success: true });
        })

        test("Get patient by email", async () => {
            const result = await supertest(app)
                    .get(`/vitals/patients/email/${userInput.email}`)
            
            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ success: true });
        })

        test("Get patient by id", async () => {
            const result = await supertest(app)
                    .get(`/vitals/patients/${value.key1}`)
            
            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ success: true }); 
        })

        test("Get all patients", async () => {
            const result = await supertest(app)
                    .get(`/vitals/patients//all`)
                    .set('Authorization', `Bearer ${value.key2}`)

            // Assertions on the response
            expect(result.status).toBe(200);
            expect(result.body).toMatchObject({ success: true }); 
        })

        // Health Record
        test("Get all patient's health Records", async () => {
            const result = await supertest(app)
                    .get(`/vitals/patients/healthRecords`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ 
                success: true, 
                Total_Count: expect.any(Number) 
            });
        })

        // Update
        test("Update User", async () => {
            const result = await supertest(app)
                    .patch(`/vitals/patients/`)
                    .set('Authorization', `Bearer ${value.key2}`)
                    .send(userUpdate)
            
            // Assertions on the response
            expect(result.status).toBe(200);
            expect(result.body).toMatchObject({ success: true }); // Replace this with your expected response body
        })

        test("Update User with exsisting email", async () => {
            const result = await supertest(app)
                    .patch(`/vitals/patients/`)
                    .set('Authorization', `Bearer ${value.key2}`)
                    .send(userUpdate)
            
            // Assertions on the response
            expect(result.status).toBe(403);
            expect(result.body).toMatchObject({ success: false }); // Replace this with your expected response body
        })

        // Delete
        test("Delete User", async () => {
            const result = await supertest(app)
                    .delete(`/vitals/patients/`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // Assertions on the response
            expect(result.status).toBe(200);
            expect(result.body).toMatchObject({ success: true }); // Replace this with your expected response body
        })

        test("Delete already deleted User", async () => {
            const result = await supertest(app)
                    .delete(`/vitals/patients/`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // Assertions on the response
            expect(result.status).toBe(404);
            expect(result.body).toMatchObject({ message: "Patient does not exist" }); // Replace this with your expected response body
        })

        // Wipe
        test("Wipe user", async () => {
            // console.log(value.key1)
            // console.log(value)

            const result = await supertest(app)
                    .delete(`/vitals/patients/wipe/${value.key1}`)
            
            // console.log(result)
            expect(result.statusCode).toBe(200)
            expect(result.body.message).toBe('Patient deleted successfully')
        })

        test("Wipe unexisting user", async () => {
            const result = await supertest(app)
                    .delete(`/vitals/patients/wipe/${value.key1}`)
            
            // console.log(result)
            expect(result.statusCode).toBe(404)
            expect(result.body.message).toBe("Patient does not exist. Literally!!")
        })
    })
})