import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcryptjs';

const userSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String }
});

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hash(this.password, 10);
  next();
});

// Méthode de comparaison de mot de passe
userSchema.methods.comparePassword = function (plainPwd) {
  return compare(plainPwd, this.password);
};

export const User = model('User', userSchema);