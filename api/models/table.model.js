import mongoose, { Schema } from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clubs: [
      {
        clubId: {
          type: Schema.Types.ObjectId,
          ref: "Club",
          required: true,
        },
        played: {
          type: Number,
          default: 0,
        },
        won: {
          type: Number,
          default: 0,
        },
        lost: {
          type: Number,
          default: 0,
        },
        drawn: {
          type: Number,
          default: 0,
        },
        goalsScored: {
          type: Number,
          default: 0,
        },
        goalsConceded: {
          type: Number,
          default: 0,
        },
        goalDifference: {
          type: Number,
          default: 0,
        },
        points: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const Table = mongoose.model("Table", tableSchema);

export default User;
