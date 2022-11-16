import mongoose from "mongoose"

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const School = mongoose.models.School || mongoose.model("School", schoolSchema)
export default School
