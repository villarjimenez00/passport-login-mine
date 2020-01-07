const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: [true, { message: "user is required" }]
  },
  email: {
    type: String,
    require: [true, { message: "email is required" }]
  },
  password: {
    type: String,
    require: [true, { message: "pass is required" }]
  },
  name: {
    type: String,
    require: [true, { message: "name is required" }]
  }
});

module.exports = mongoose.model("User", userSchema);
