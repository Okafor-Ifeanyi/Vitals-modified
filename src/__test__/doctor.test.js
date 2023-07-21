const supertest = require("supertest")
const createServer = require("../utils/server.utils")
const {connect, closeConnection} = require("./connect")
require('dotenv').config()

const app = createServer(); 

const { doctorPayload,
        wrongPassword,
        loginInput,
        doctorReg,
        invalidEmailDoctorReg,
        doctorUpdate,
        doctorNoLicenceNO,
        doctorWrongConfirmPassword } = require("./body")

/* Connecting to the database before each test. */
beforeAll(async () => {
    await connect();
});
  
/* Closing database connection after each test. */
afterAll(async () => {
    await closeConnection();
});

describe( "test how to register a doctor", () => {
    // validate the email and phoneNumber doesn't exist
    // testing my joi verification
    describe("testing joi validation", () => {
        test("Test wrong confirm password", async () => {
            const result = await supertest(app)
                    .post("/vitals/doctors/register")
                    .send(doctorWrongConfirmPassword)
            
            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message)
                .toBe("\"Confirm password\" does not match")
        })

        test("Test missing Licence NO", async () => {
            const result = await supertest(app)
                    .post("/vitals/doctors/register")
                    .send(doctorNoLicenceNO)

            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message).toBe("\"licenseNO\" is required")
        })

        test("Test invalid email", async () => {
            const result = await supertest(app)
                    .post("/vitals/doctors/register")
                    .send(invalidEmailDoctorReg)
            
            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message).toBe("\"email\" must be a valid email")
        })

        // test("Verification Code Schema", async () => {
        //     const result = await supertest(app)
        //             .post("/vitals/doctors/verify/s54@gmail.com")
        //             .send({code: 09754 })
            
        //     // console.log(result.body)
        //     expect(result.statusCode).toBe(422)
        //     expect(result.body.error[0].path).toBe("code")
        // })

        test("Login Schema wrong email", async () => {
            const result = await supertest(app)
                    .post("/vitals/doctors/login")
                    .send({email: "moe.com", password: "ubduwda"})
            
            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message)
                .toBe('"email" must be a valid email')
        })

        test("Login Schema password min(6) ", async () => {
            const result = await supertest(app)
                    .post("/vitals/doctors/login")
                    .send({email: "moe@gmail.com", password: "ubd"})
            
            expect(result.statusCode).toBe(422)
            expect(result.body.error[0].message)
                .toBe('"password" length must be at least 6 characters long')
        })
    })

    describe("Testing doctor Route", () => {
        // Register
        test("Register user", async () => {
            const result = await supertest(app)
                    .post("/vitals/doctors/register")
                    .send(doctorReg)
        
            expect(result.statusCode).toBe(200)
            expect(result.body.message).toMatchObject({
                    _id : expect.any(String),
                    firstName: expect.any(String),
                    lastName: expect.any(String),
                    email: expect.any(String),
                    licenseNO: expect.any(String),
                })
        })

        test("Existing user", async () => {
            const result = await supertest(app)
                    .post("/vitals/doctors/register")
                    .send(doctorReg)

            expect(result.statusCode).toBe(400)
            expect(result.body.message).toBe('Doctor data already exists')
        })

        // Login
        test("Login email not found", async () => {
            const result = await supertest(app)
                .post("/vitals/doctors/login")
                .send({email: "eeddr@gmail.com", password: "jj90kko"})

            expect(result.statusCode).toBe(404)
            expect(result.body).toEqual({
                message: "Doctor does not exist"
            })
        })

        test("Login Incorrect Password", async () => {
            const result = await supertest(app)
                .post("/vitals/doctors/login")
                .send(wrongPassword)
            
            // console.log(result)
            expect(result.statusCode).toBe(400)
            expect(result.body).toEqual({
                message: "Incorrect Password",
            })
        })

        const value = {}
        test("Login doctor Successful", async () => {
            const result = await supertest(app)
                .post("/vitals/doctors/login")
                .send(loginInput)
            

            value.key1 = result.body.Doctor_ID;
            value.key2 = result.body.token
            expect(result.statusCode).toBe(200)
            expect(result.body).toEqual({
                token: expect.any(String),
                Token_Type: "Bearer",
                Doctor_ID: expect.any(String)
            })
        })

        // Get user
        test("Get my profile as a doctor", async () => {
            const result = await supertest(app)
                    .get(`/vitals/doctors/`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ success: true });
        })

        // test("Get doctor by email", async () => {
        //     const result = await supertest(app)
        //             .get(`/vitals/doctors/email/${doctorReg.email}`)
            
        //     // Assertions on the response
        //     expect(result.status).toBe(201);
        //     expect(result.body).toMatchObject({ success: true });
        // })

        test("Get doctor by id", async () => {
            const result = await supertest(app)
                    .get(`/vitals/doctors/${value.key1}`)
            
            // console.log(result.body)
            // Assertions on the response
            expect(result.status).toBe(201);
            expect(result.body).toMatchObject({ success: true }); 
        })

        test("Get all doctors", async () => {
            const result = await supertest(app)
                    .get(`/vitals/doctors//all`)
                    .set('Authorization', `Bearer ${value.key2}`)

            // Assertions on the response
            expect(result.status).toBe(200);
            expect(result.body).toMatchObject({ success: true }); 
        })

        // Health Record
        test("Register user", async () => {
            const result = await supertest(app)
                    .post("/vitals/doctors/hcpref")
                    .send()
        
            expect(result.statusCode).toBe(200)
            expect(result.body.message).toMatchObject({
                    _id : expect.any(String),
                    firstName: expect.any(String),
                    lastName: expect.any(String),
                    email: expect.any(String),
                    licenseNO: expect.any(String),
                })
        })
        // test("Get all doctor's health Records", async () => {
        //     const result = await supertest(app)
        //             .get(`/vitals/doctors/healthRecords`)
        //             .set('Authorization', `Bearer ${value.key2}`)
            
        //     // Assertions on the response
        //     expect(result.status).toBe(201);
        //     expect(result.body).toMatchObject({ 
        //         success: true, 
        //         Total_Count: expect.any(Number) 
        //     });
        // })

        // Update
        test("Update User", async () => {
            const result = await supertest(app)
                    .patch(`/vitals/doctors/`)
                    .set('Authorization', `Bearer ${value.key2}`)
                    .send(doctorUpdate)
            
            // Assertions on the response
            expect(result.status).toBe(200);
            expect(result.body).toMatchObject({ success: true }); // Replace this with your expected response body
        })

        test("Update User with exsisting email", async () => {
            const result = await supertest(app)
                    .patch(`/vitals/doctors/`)
                    .set('Authorization', `Bearer ${value.key2}`)
                    .send(doctorUpdate)
            
            // Assertions on the response
            expect(result.status).toBe(403);
            expect(result.body).toMatchObject({ success: false }); // Replace this with your expected response body
        })

        // Delete
        test("Delete User", async () => {
            const result = await supertest(app)
                    .delete(`/vitals/doctors/`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // Assertions on the response
            expect(result.status).toBe(200);
            expect(result.body).toMatchObject({ success: true }); // Replace this with your expected response body
        })

        test("Delete already deleted User", async () => {
            const result = await supertest(app)
                    .delete(`/vitals/doctors/`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // Assertions on the response
            expect(result.status).toBe(404);
            expect(result.body).toMatchObject({ message: "Doctor does not exist" }); // Replace this with your expected response body
        })

        // Wipe
        test("Wipe user", async () => {
            // console.log(value.key1)
            // console.log(value)

            const result = await supertest(app)
                    .delete(`/vitals/doctors/wipe/${value.key1}`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // console.log(result.body)
            expect(result.statusCode).toBe(200)
            expect(result.body.message).toBe('doctor deleted successfully')
        })

        test("Wipe unexisting user", async () => {
            const result = await supertest(app)
                    .delete(`/vitals/doctors/wipe/${value.key1}`)
                    .set('Authorization', `Bearer ${value.key2}`)
            
            // console.log(result)
            expect(result.statusCode).toBe(404)
            expect(result.body.message).toBe("doctor does not exist. Literally!!")
        })
    })
})