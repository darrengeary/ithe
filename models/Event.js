import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pupil: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pupil",
    },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  },

  {
    timestamps: true,
  }
)

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema)
export default Event
