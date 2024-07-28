import mongoose, { Schema } from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    homeClubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    awayClubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    homeGoals: {
      type: Number,
      required: true,
    },
    awayGoals: {
      type: Number,
      required: true,
    },
    matchDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userRef: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clubs: [
      {
        clubId: {
          type: mongoose.Schema.Types.ObjectId,
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
    matches: [matchSchema],
  },
  { timestamps: true }
);

const Table = mongoose.model("Table", tableSchema);

export default Table;
