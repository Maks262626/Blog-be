import mongoose, { Schema } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  firebaseUID: string;
  avatarUrl?: String;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firebaseUID: { type: String, required: true, unique: true },
  avatarUrl: String
}, {
  timestamps: true
})

export default mongoose.model('User', UserSchema);
