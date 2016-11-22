var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var UserSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email: String,
  locations: [{
    lat: Number,
    long: Number,
    comments: [String],
    photosURL: String
  }],
  hashed_password: String
});
mongoose.model('User', UserSchema);
ser ', UserSchema);
ser ', UserSchema);
