const mongoose = require("mongoose")
const userId = new mongoose.Types.ObjectId().toString();

exports.patientPayload = {
    _id: userId,
    firstName: "BIO",
    email: "oluwaseyi@gmail.com",
    phoneNumber: "201447854",
    address: "27A Eziobodo",
    gender: "M",
    allergies: [ "Cough" ],
    bio: "I am not Gay",
    blood_group: "O-",
    genotype: "AC",
    lastName:"TestUser13456789",
}

exports.userInput = {
    firstName: "bio",
    lastName: "Bio Bio",
    email: "s54@gmail.com",
    password: "duttyy",
    confirm_password: "duttyy",
    phoneNumber: "08196270120"
}

exports.invalidEmailInput = {
    firstName: "bio",
    lastName: "Bio Bio",
    email: "s54.com",
    password: "duttyy",
    confirm_password: "duttyy",
    phoneNumber: "08196270120"
}

exports.userUpdate = {
    firstName: "bio",
    lastName: "Bio Bio",
    email: "zeus@gmail.com",
    blood_group: "A-",
    genotype: "AA",
}

exports.loginInput = {
    email: "s54@gmail.com",
    password: "duttyy"
}

exports.wrongPassword = {
    email: "s54@gmail.com",
    password: "dutty33"
}

exports.userInput_wrongConfirmPassword = {
    firstName: "bio",
    lastName: "Bio Bio",
    email: "ser@gmail.com",
    password: "duttyy",
    confirm_password: "eerry",
    phoneNumber: "08129741530"
}

exports.userInput_NoPhoneNumber = {
    firstName: "bio",
    lastName: "Bio Bio",
    email: "ser@gmail.com",
    password: "duttyy",
    confirm_password: "duttyy"
}

exports.doctorReg= {
    firstName: "bio",
    lastName: "Bio Bio",
    email: "s54@gmail.com",
    password: "duttyy",
    confirm_password: "duttyy",
    licenseNO: "MDCN/R/82426", 
    specialty: "Nursing Services"
}

exports.invalidEmailDoctorReg= {
    firstName: "bio",
    lastName: "Bio Bio",
    email: "ser.com",
    password: "duttyy",
    confirm_password: "duttyy",
    licenceNO: "MDCN/R/82426",
    specialty: "Nursing Services"
}

exports.doctorUpdate= {
    firstName: "bio",
    lastName: "Bio Bio",
    email: "meet@gmail.com",
}

exports.doctorNoLicenceNO = {
    firstName: "bio",
    lastName: "Bio Bio",
    email: "ser23@gmail.com",
    password: "duttyy",
    confirm_password: "duttyy",
    phoneNumber: "08129741530",
    specialty: "Nursing Services"
}

exports.doctorWrongConfirmPassword = {
    firstName: "bio",
    lastName: "Bio Bio",
    email: "ser@gmail.com",
    password: "duttyy",
    confirm_password: "eerry",
    phoneNumber: "08129741530",
    licenceNO: "MDCN/R/82426",
    specialty: "Nursing Services"
}

exports.hospitalReg= {
    name: "bio",
    password: "duttyy",
    confirm_password: "duttyy",
    address: "08129741530",
    registrationNo: "MDCN/R/82426"
}

exports.hospitalLogin= {
    registrationNo: "MDCN/R/82426",
    password: "duttyy"
}

exports.hospitalWrongLogin= {
    registrationNo: "MDCN/R/82426",
    password: "duttyye"
}

exports.invalidRegNO= {
    name: "bio",
    password: "duttyy",
    confirm_password: "duttyy",
    address: "08129741530",
    registrationNo: "MDCN/R/82426"
}

exports.hospitalUpdate= {
    registrationNo: "MDCN/R/2426",
    name: "ESUT",
    address: "08129741530"
}

exports.hospitalNoRegistrationNO = {
    name: "bio",
    password: "duttyy",
    confirm_password: "duttyy",
    address: "08129741530",
}

exports.hospitalWrongConfirmPassword = {
    name: "bio",
    password: "duttyy",
    confirm_password: "eerry",
    address: "08129741530",
    registrationNo: "MDCN/R/82426"
}