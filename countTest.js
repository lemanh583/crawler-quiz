import testSchema from "./model/congchucvn.js";
import oldSchema from "./model/test.js";
import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/crawler");
  } catch (error) {
    throw error;
  }
}

async function handle() {
  try {
    let skip = 0;
    let limit = 50;
    let rows = [1];
    let count = 0
    let parentDistinct = await testSchema.distinct("parent");
    for (let parent of parentDistinct) {
        let titleDistinct = await testSchema.find({ parent: parent}).distinct("title");
        count += titleDistinct.length;
    }
    console.log(count);
  } catch (error) {
    throw error;
  }
}

(async () => {
  try {
    await connectDB();
    await handle();
    console.log("Done !");
  } catch (error) {
    console.error(error);
  }
})();
