import mongoose from "mongoose"

const pupilSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, //parent
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  },
  {
    timestamps: true,
  }
)

const Pupil = mongoose.models.Pupil || mongoose.model("Pupil", pupilSchema)
export default Pupil
