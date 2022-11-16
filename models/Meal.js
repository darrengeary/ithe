import mongoose from "mongoose"

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const Meal = mongoose.models.Meal || mongoose.model("Meal", mealSchema)
export default Meal
