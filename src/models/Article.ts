import mongoose, { ObjectId, Schema } from "mongoose";

export interface IArticle {
  title: string;
  text: string;
  tags: ObjectId[];
  comments: ObjectId[];
  commentsCount: number;
  viewsCount: number;
  likes: number;
  likedBy: ObjectId[];
  author: ObjectId
  imageUrls?: string[]
}

const ArticleSchema = new Schema<IArticle>({
  title: { type: String, required: true },
  text: { type: String, required: true },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    default: []
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: []
  }],
  commentsCount: { type: Number, default: 0 },
  viewsCount: { type: Number, default: 0 },
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
  imageUrls: [{ type: String }]
}, {
  timestamps: true
})

export default mongoose.model('Article', ArticleSchema);
