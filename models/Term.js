import mongoose from "mongoose"

const termSchema = new mongoose.Schema(
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

const Term = mongoose.models.Term || mongoose.model("Term", termSchema)
export default Term
