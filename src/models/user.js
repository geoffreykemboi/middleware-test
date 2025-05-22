const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  createdAt: Date,
  updatedAt: Date
});

// Virtual property for fullName
userSchema.virtual('fullName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (name) {
    let parts = name.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  });

// Middleware to auto-update timestamps
userSchema.pre('save', function (next) {
  let now = Date.now();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

// Export the model
let UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;

// Connecting to MongoDB
mongoose.connect("mongodb://localhost:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a new user instance
let model = new UserModel();
model.fullName = 'Thomas Anderson';

model.save()
  .then(doc => {
    console.log("User saved:", doc);
  })
  .catch(err => {
    console.error("Error:", err);
  });
