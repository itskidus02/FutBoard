import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);



const Club = mongoose.model("Club", clubSchema);

export default Club;
