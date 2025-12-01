import mongoose, { Schema, Model } from 'mongoose';

// Comment Schema
interface IComment {
  movieEpisode: string;
  name: string;
  comment: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  movieEpisode: { type: String, required: true },
  name: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Vote Schema
interface IVote {
  movieEpisode: string;
  likes: number;
  dislikes: number;
}

const VoteSchema = new Schema<IVote>({
  movieEpisode: { type: String, required: true, unique: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

// Export models
export const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
export const Vote: Model<IVote> = mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);

export type { IComment, IVote };
