const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    /* The ref property means that only that specific user can delete that post */
    ref: "users",
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: { type: String },
  /* ensures that a single user can't keep liking the same post*/
  likes: [{ user: { type: Schema.Types.ObjectId, ref: "users" } }],
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: "users" },
      text: {
        type: String,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model("post", PostSchema);
