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
    let objAnswer = {
      "A": 0,
      "B": 1,
      "C": 2,
      "D": 3,
      "E": 4,
    };
    while (rows.length != 0) {
      console.log("___skip____", skip);
      rows = await testSchema.find({}).skip(skip).limit(limit);
      await Promise.all(
        rows.map(async (row) => {
        //   let record = {
        //     parent: row.parent.trim(),
        //     title: row.title.trim(),
        //     question: row.question.trim(),
        //     correct: row.correct.trim(),
        //     recommend: row.recommend.replace(/Đáp\sán\sđúng:\s[A-E]/, '').trim(),
        //     correct_options: row.correct[row.correct.length - 1]
        //   }   
        //   record.answers = row.answers.map((answer, index) => {
        //     return {
        //       content: answer.content.trim(),
        //       correct: index === objAnswer[record.correct_options] ? true : false
        //     };
        //   });
        //   await testSchema.create(record);
            let index = row.answers.findIndex((answer) => answer.correct == true)
            if (index == -1) { 
                console.log("No correct answer", row._id)
            }

        })
      );

      skip += limit;
    }
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
