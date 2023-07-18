const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const healthCareProviderSchema = new mongoose.Schema(
  {
    wallet_address: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    },
    email: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    registrationNo: {
      type: String,
      required: true,
      unique: true
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  { timestamps: true }
);

// Encrypt password before pushing to database
healthCareProviderSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

healthCareProviderSchema.methods.matchPassword = async function (password) {
  if (!password) throw new Error("Password is missing, can not compare");

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (e) {
      return res.json({ 
        Success: false,
        message: 'Error while comparing password!',
        error: e.message})
  }
};

healthCareProviderSchema.methods.toJSON = function () {
  const userData = this.toObject(); 

  delete userData.password;
  delete userData.deleted;
  return userData; 
};

const HCPModel = mongoose.model("HealthCareProvider", healthCareProviderSchema );
module.exports = HCPModel;
