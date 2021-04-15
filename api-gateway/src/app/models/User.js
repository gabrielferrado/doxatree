const mongoose = require('../../database')
const generateToken = require('../../utils/token')

const generateShortCode = () => {
  const possible = '0123456789'
  let string = ''
  for (let i = 0; i < 6; i++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return string
}

const UserSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: false,
  },
  provider: {
    type: String,
    default: null,
    enum: ['google', 'apple', 'facebook', null],
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    default: 'basic',
    enum: ['basic', 'premium', 'admin'],
  },
  phone: {
    type: Number,
    required: true,
  },
  ssn: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
    default: null,
  },
  passwordResetExpires: {
    type: String,
    select: false,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  updatedAt: {
    type: Date,
    default: null,
    select: false,
  },
  deletedAt: {
    type: Date,
    default: null,
    select: false,
  },
  idFacebook: {
    type: String,
    default: null,
    select: false,
  },
  idApple: {
    type: String,
    default: null,
    select: false,
  },
  idGoogle: {
    type: String,
    default: null,
    select: false,
  },
  idToken: {
    type: String,
    default: null,
  },
  messageToken: {
    type: String,
    default: null,
    select: false,
  },
})

UserSchema.pre('save', async function (next) {
  if (!this.idToken) {
    this.idToken = generateToken(this.email)
  }

  if (!this.active) {
    this.messageToken = generateShortCode()
  }

  next()
})

const User = mongoose.model('User', UserSchema)
module.exports = User
