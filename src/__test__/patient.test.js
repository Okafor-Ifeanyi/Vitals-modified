const supertest = require("supertest")
const createServer = require("../utils/server.utils")
const {connect, closeConnection} = require("./connect")
require('dotenv').config()

const app = createServer(); 

const { patientPayload,
        loginInput,
        userInput, 
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
    })

    describe("testing user registration", () => {
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

        const value = {}
        test("Login User", async () => {
            const result = await supertest(app)
                .post("/vitals/patients/login")
                .send(loginInput)

            
            // console.log(result.body)
            value.key1 = result.body.Patient_ID;
            value.key2 = result.body.token
            expect(result.statusCode).toBe(200)
            expect(result.body).toEqual({
                token: expect.any(String),
                Token_Type: "Bearer",
                Patient_ID: expect.any(String)
            })
            // console.log(value)
        })

        // test("Get user", async () => {
        //     console.log(value.key1)
        //     // console.log(value)

        //     const result = await supertest(app)
        //             .delete(`/vitals/patients/wipe/${value.key1}`)
            
        //     console.log(result)
        //     expect(result.statusCode).toBe(200)
        //     expect(result.body.message).toBe('Patient deleted successfully')
        // })

        test("Wipe user", async () => {
            console.log(value.key1)
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


    // it('GET /api/books - success -  get all the books ', async () => {
	// 	const { body, statusCode } = await request(app).get('/api/books');

	// 	expect(body).toEqual(
	// 		expect.arrayContaining([
	// 			expect.objectContaining({
	// 				id: expect.any(Number),
	// 				name: expect.any(String),
	// 				author: expect.any(String)
	// 			})
	// 		])
	// 	);

	// 	expect(statusCode).toBe(200);
	// });
    // validate the check if profile image is available
    // generate verification code
    // create patient
    // should return a json object containing user id
    // send verification code
    // should respond with json in content header
    // should send a status code of 200 
    // check matching password
 })