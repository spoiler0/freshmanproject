var mongooseSetup = mongoose => {
  var Schema = mongoose.Schema;
  var userSchema = new Schema({
    name: String,
    uid: String,
    password: String
  });
  return mongoose.model("user", userSchema);
};

module.exports = {
  user: mongooseSetup
};
