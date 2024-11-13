import mongoose, { Schema,model, Document, Types } from 'mongoose';

const userSchema = new Schema({
  username: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roleId: { type: Schema.Types.ObjectId, ref: 'Role' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});


const User = mongoose.models.User || model('User', userSchema);
export default User;
