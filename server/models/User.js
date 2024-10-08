const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address!'],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
  games: [{type: Schema.Types.ObjectId, ref: 'Game'}],
  cards: [{type: Schema.Types.ObjectId, ref: 'Card'}],
  friendInvites: [{type: Schema.Types.ObjectId, ref: 'User'}],
  gameInvites: [{type: Schema.Types.ObjectId, ref: 'Game'}]
});

// set up pre-save middleware to create password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.pre('updateOne', async function(next){
  for (const person of this.friendInvites){
    const possibleFriend = await User.findById({_id: person}).populate('friendInvites')
    console.log(possibleFriend)
  }
  next()
})

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
