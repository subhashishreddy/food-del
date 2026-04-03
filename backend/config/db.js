import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://subhashishreddy582:Subhashshish-tomato@cluster0.cm6ufv4.mongodb.net/food-del"
    )
    .then(() => console.log("Database is connected"));
};
