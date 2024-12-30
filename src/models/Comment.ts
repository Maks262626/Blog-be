import mongoose, { ObjectId, Schema } from "mongoose";

export interface IComment {
  text: string;
  likes: number;
  likedBy: ObjectId[];
  author: ObjectId;
  article: ObjectId;
  parentId?: ObjectId;
}

const CommentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: []
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: false,
  },
}, { timestamps: true });

export default mongoose.model('Comment', CommentSchema);