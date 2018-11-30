var mongooseSetup = mongoose => {
  var Schema = mongoose.Schema;
  var userSchema = new Schema({
    uid: String,
    name: String,
    password: String
  });
  return mongoose.model("user", userSchema);
};

module.exports = {
  user: mongooseSetup
};
