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

exports.loginInput = {
    email: "s54@gmail.com",
    password: "duttyy"
}

exports.userInput_existingPhoneNumber = {
    firstName: "bio",
    lastName: "Bio Bio",
    email: "ser23@gmail.com",
    password: "duttyy",
    confirm_password: "duttyy",
    phoneNumber: "08129741530"
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