import mongoose from "mongoose"

const holidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
  },
  {
    timestamps: true,
  }
)

const Holiday =
  mongoose.models.Holiday || mongoose.model("Holiday", holidaySchema)
export default Holiday
