import oldSchema from "./model/congchucvn.js";
import newSchema from "./model/newconchucvn.js";
import mongoose from "mongoose";

let categoryEn = [
  "Ôn tập nghữ pháp + từ vựng Anh văn 12 unit 1 - unit 16 note",
  "Trắc nghiệm anh văn 12 theo chủ đề bài học note",
  "Trắc nghiệm Mai Lan Huong 12 unit 1 - unit 4 note",
  "16 Đề thi thử tiếng anh công chức Phần 5",
  "17 Đề thi thử tiếng anh công chức Phần 4",
  "20 Đề thi thử tiếng anh công chức Phần 3",
  "Trắc nghiệm Mai Lan Hương 11 unit 13 - unit 16 note",
  "20 Đề thi thử anh văn công chức Phần 2",
  "Trắc nghiệm Mai Lan Hương 12 -  unit 13 - 16 note",
  "NGỮ PHÁP - Trắc nghiệm sự phù hợp giữa chủ ngữ và động từ",
  "NGỮ PHÁP - Trắc nghiệm liên từ trong tiếng Anh",
  "NGỮ PHÁP -  trắc nghiệm mạo từ trong tiếng anh",
  "NGỮ PHÁP - trắc nghiệm word form trong tiếng anh",
  "NGỮ PHÁP - Trắc nghiệm giới từ trong Tiếng Anh",
  "Ngữ pháp - Phrasal Verb and Idioms",
  "NGỮ PHÁP - 420 câu trắc nghiệm 12 thì trong Tiếng Anh",
  "NGỮ PHÁP - 300 câu trắc nghiệm full về mệnh đề IF",
  "NGỮ PHÁP - 230 câu trắc nghiệm toàn tập về mệnh đề quan hệ",
  "NGỮ PHÁP - Trắc nghiệm V_ing, V_bare, to V - có giải chi tiết",
  "Hướng dẫn giải chi tiết bài tập trắc nghiệm Mai Lan Huong 12 đề unit 9 - 12",
  "18 Đề thi thử anh văn công chức Phần 1",
  "Luyện tập Ngữ pháp và Từ vựng trong đề thi công chức tiếng anh",
  "Hướng dẫn giải chi tiết bài tập trắc nghiệm Mai Lan Huong 12 đề unit 5 - unit 8",
  "Luyện tập ngữ pháp đề thi tiếng anh A2 công chức theo chủ đề",
  "Hướng dẫn giải chi tiết bài tập trắc nghiệm Mai Lan Hương 11 unit 9 - unit 12 note",
  "Hướng dẫn giải chi tiết bài tập trắc nghiệm Mai Lan Hương 11 unit 5 - unit 8 note",
  "Hướng dẫn giải chi tiết bài tập trắc nghiệm Mai Lan Hương 11 unit 1 - unit 4 note",
  "Đề thi công chức tiếng anh nâng cao",
];

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/crawler");
  } catch (error) {
    throw error;
  }
}

async function handle() {
  try {
    let categoriesName = await oldSchema.distinct("parent");
    for (let categoryName of categoriesName) {
      let examsName = await oldSchema.find({ parent: categoryName }).distinct("title");
      let examsDb = [];

      let isEn = categoryEn.includes(categoryName);

      for (let examName of examsName) {
        let recordQuestions = await oldSchema.find({ parent: categoryName, title: examName });
        let questionsDb = [];
        for (let recordQuestion of recordQuestions) {
          let newQuestion = {
            title: recordQuestion.question,
            recommend: recordQuestion.recommend,
            answers: recordQuestion.answers.map(item => { return { title: item.content, correct: item.correct } }),
          };
          questionsDb.push(newQuestion);
        }
        let newExam = {
          title: examName,
          lang: isEn ? "en" : "vi",
          questions: questionsDb,
        };
        examsDb.push(newExam);
      }

      let newCategory = new newSchema({
        title: categoryName,
        exams: examsDb,
        lang: isEn ? "en" : "vi",
      });
      await newCategory.save();
      console.log(newCategory.title);
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
