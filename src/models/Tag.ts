import mongoose, { Schema } from "mongoose";

export interface ITag {
  name: string;
}

const TagSchema = new Schema<ITag>({
  name: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Tag', TagSchema);