// models/link.model.js
import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, "Original URL is required."],
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu đến User model
      required: false, // Có thể là false để cho phép người dùng vãng lai tạo link
    },
  },
  {
    timestamps: true,
  }
);

const Link = mongoose.model("Link", LinkSchema, "shorter_link");

export default Link;
