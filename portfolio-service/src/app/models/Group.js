import mongoose from "../../database";

export const GroupSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  metaPercentage: {
    type: Number,
    required: true,
  },
  lockets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Locket",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// eslint-disable-next-line func-names
GroupSchema.pre("save", async function () {
  this.updatedAt = Date.now();
});

const Group = mongoose.model("Group", GroupSchema);
export default Group;
