import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

//app config

const app = express();
const port = process.env.PORT || 4000;

//middlwware
app.use(express.json());
app.use(cors());

//db connection
connectDB();

//api endpoint
app.use("/api/v1/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//mongodb+srv://subhashishreddy582:Subhashshish-tomato@cluster0.cm6ufv4.mongodb.net/?
