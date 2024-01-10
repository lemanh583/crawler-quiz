import testSchema from "./model/congchucvn.js";
import Excel from "exceljs";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/crawler");
  } catch (error) {
    throw error;
  }
}

async function handle() {
  try {
    // const writeStream = fs.createWriteStream('myFile.txt');
    let files = await testSchema.distinct("parent");
    for (let file of files) {
      // writeStream.write("parent: " + file + '\n');
      let workbook = new Excel.Workbook();

      let titles = await testSchema.find({ parent: file }).distinct("title");
      for (let [index, t] of titles.entries()) {
        // writeStream.write(t + '\n');
        let count = await testSchema.countDocuments({ parent: file, title: t });
        if (count == 0) {
          continue;
        }
        let nameWorksheet = t
        if (t.length > 30) {
          nameWorksheet = "Test" + index;
        }
        var worksheet = workbook.addWorksheet(nameWorksheet);
        worksheet.columns = [
          { header: "Question", key: "question", width: 50 },
          { header: "A", key: "a", width: 50 },
          { header: "B", key: "b", width: 50 },
          { header: "C", key: "c", width: 50 },
          { header: "D", key: "d", width: 50 },
          { header: "Answer", key: "answer", width: 50 },
          { header: "Recommend", key: "recommend", width: 50 },
        ];
        let skip = 0;
        let limit = 50;
        let rows = [1];
        while (rows.length != 0) {
          rows = await testSchema.find({ parent: file, title: t }).skip(skip).limit(limit);
          for (let row of rows) {
            worksheet.addRow({
              question: row.question,
              a: row.answers[0].content,
              b: row.answers[1]?.content,
              c: row.answers[2]?.content,
              d: row.answers[3]?.content,
              answer: row.correct,
              recommend: row.recommend,
            });
          }
          skip += limit;
        }
      }
      await workbook.xlsx.writeFile(
        path.join(__dirname, "congchucvnxlxs", file.replace(/[\/\\]/g, "-") + ".xlsx")
      );
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
