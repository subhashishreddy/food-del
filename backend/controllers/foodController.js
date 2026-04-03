import Food from "../models/foodModel.js";
import fs from "fs";

//add food item
const addFood = async (req, res) => {
  try {
    const food = Food.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file.filename,
    });

    res.status(200).json({
      status: "success",
      message: "food added",
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error,
    });
  }
};

//all food list
const listFood = async (req, res) => {
  try {
    let foodList = await Food.find({});
    res.status(200).json({
      status: "success",
      data: {
        foodList,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

//remove food item
const removeFood = async (req, res) => {
  try {
    const food = await Food.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) {
        console.error(err);
      }
    });

    await Food.findByIdAndDelete(req.body.id);

    res.status(200).json({
      status: "success",
      message: "Food deleted",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      errorStack: error.stack,
    });
  }
};

export { addFood, listFood, removeFood };
