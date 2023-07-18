const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const doctorSchema = new Schema({
    wallet_address: {
        type: String,
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: [true, 'A doctor must have an email']
    },
    password: {
        type: String,
        required: true,
    },
    resetLink: {
        type: String,
        default: ''
    },
    licenseNO: {
        type: String,
        required: true
    },
    grade: {
        type: String,
    },
    specialty: {
        type: String,
        required: true,
    },
    profile_img: {
        type: String,
    },
    HCP_ID: {
        type: Schema.Types.ObjectId,
        ref: "providerModel"
    },
    deleted: {
        type: Boolean, required: true, default: false
    } 
}, { timestamps: true });

// Encrypt password before pushing to database
doctorSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

doctorSchema.methods.matchPassword  = async function (password) {
    if(!password) throw new Error("Password is missing, can not compare")

    try{
        const result = await bcrypt.compare(password, this.password)
        return result;
    } catch (e) {
        return res.json({ Success: false, message: 'Error while comparing password!', error: e.message})
    }
}

doctorSchema.methods.toJSON = function () {
    const userData = this.toObject(); 
 
    delete userData.password;
    delete userData.deleted;
    return userData; 
  };


const doctorModel = mongoose.model("Doctor", doctorSchema);

module.exports = doctorModel