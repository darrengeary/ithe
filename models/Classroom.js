import mongoose from "mongoose"

const classroomSchema = new mongoose.Schema(
  {
    name: { type: String },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    totalPupils: { type: Number },
  },
  {
    timestamps: true,
  }
)

const Classroom =
  mongoose.models.Classroom || mongoose.model("Classroom", classroomSchema)
export default Classroom
