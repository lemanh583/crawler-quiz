import mongoose from "mongoose";
import mysql from "mysql2";
import schema from "./model/congchucvn.js";
// import axios from "axios";

// axios.defaults.baseURL = "http://localhost:3000";
// axios.defaults.headers.common[
//   "Authorization"
// ] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDIyMjM5MDgsImV4cCI6MTcwNDgxNTkwOH0.I0WNMS9IyowspSsCyBZuUyxGpjFgyR1z4ejrGGWTdMo`;

async function connectMongo() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/crawler");
  } catch (error) {
    throw error;
  }
}
function connectMysql() {
  try {
    const connection = mysql.createConnection({
      host: "14.225.206.113",
      user: "root",
      password: "htO16v8glP0tm7f",
      database: "quiz",
    });
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
      }
    
      console.log('Connected to MySQL!');
      connection.end();
    });
    return connection;
  } catch (error) {
    throw error;
  }
}

let arrayEn = [
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

let examTopic = {
  "Hiến Pháp 2013": ["Kho bạc nhà nước", "Hải Quan", "Thuế", "Thống kê", "Bảo hiểm xã hội", "Ngân hàng nhà nước"],
  "Hoạt động công vụ và các nghị định về công chức": ["Kho bạc nhà nước", "Hải Quan", "Thuế"],
  "Luật Ban Hành Văn Bản QPPL": ["Kho bạc nhà nước", "Hải Quan", "Thuế", "Bảo hiểm xã hội"],
  "Luật cán bộ công chức": ["Kho bạc nhà nước", "Hải Quan", "Thuế", "Thống kê", "Ngân hàng nhà nước"],
  "Luật Tổ Chức Chính Phủ - Quốc Hội": ["Kho bạc nhà nước", "Hải Quan", "Thuế", "Thống kê", "Bảo hiểm xã hội", "Ngân hàng nhà nước"],
  "Luật Viên Chức": ["Kho bạc nhà nước", "Hải Quan", "Thuế", "Thống kê", "Bảo hiểm xã hội"],
  "Nghị định 34-2016 và nghị định 154-2020 hướng dẫn Luật Ban hành văn bản quy phạm pháp luật": [
    "Kho bạc nhà nước",
    "Hải Quan",
    "Thuế",
    "Bảo hiểm xã hội",
  ],
  "Nghị định 101-2017 về đào tạo, bồi dưỡng cán bộ, công chức, viên chức": ["Kho bạc nhà nước", "Hải Quan", "Thuế"],
  "Nghị Định 123 và 101 quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Bộ, cơ quan ngang bộ": [
    "Kho bạc nhà nước",
    "Hải Quan",
    "Thuế",
    "Thống kê",
    "Ngân hàng nhà nước",
  ],
  "Nghị định 138 Quy định về tuyển dụng, sử dụng và quản lý công chức": ["Kho bạc nhà nước", "Hải Quan", "Thuế", "Thống kê", "Ngân hàng nhà nước"],
  "Nghị quyết số 76-NQ-CP ngày 15-7-2021": ["Kho bạc nhà nước", "Hải Quan", "Thuế"],
  "Nghị định 30-2020 của Chính phủ về công tác văn thư": ["Hải Quan", "Thuế", "Bảo hiểm xã hội"],
  "Nghị định 112 về xử lý kỷ luật cán bộ, công chức, viên chức": ["Hải Quan", "Thuế", "Thống kê", "Bảo hiểm xã hội"],
  "Nghị định 90 về đánh giá, xếp loại chất lượng cán bộ, công chức, viên chức.": ["Hải Quan", "Thuế", "Bảo hiểm xã hội", "Ngân hàng nhà nước"],
  "Luật Phòng chống tham nhũng": ["Thuế"],
  "Luật Tổ Chức chính quyền địa phương": ["Thuế", "Thống kê"],
  "Nghị quyết Đại hội 13 của Đảng": ["Thuế"],
  "Nghị quyết Đại hội đại biểu toàn quốc lần thứ 13 của Đảng": ["Thuế"],
  "Nghị định 115-2020 tuyển dụng, sử dụng và quản lý viên chức": ["Bảo hiểm xã hội"],
};

let topics = [
  { id: 7, title: "Thuế" },
  { id: 6, title: "Tiếng Anh" },
  { id: 4, title: "Kho bạc nhà nước" },
  { id: 5, title: "Bảo hiểm xã hội" },
  { id: 2, title: "Hải Quan" },
  { id: 1, title: "Thống kê" },
  { id: 3, title: "Ngân hàng nhà nước" },
];

// async function handle(connectionMysql) {
//   try {
//     let files = await schema.find({ parent: { $nin: arrayEn } }).distinct("parent");
//     for (let file of files) {
//       // insert to category mysql
//       let rsCategory = await axios.post("/admin/category/create", {
//         title: file?.trim(),
//         type: "exam",
//       });
//       let category = rsCategory.data?.data;
//       let titles = await schema.find({ parent: file }).distinct("title");
//       for (let [index, t] of titles.entries()) {
//         let count = await schema.countDocuments({ parent: file, title: t });
//         if (count == 0) {
//           continue;
//         }
//         console.log("t", t);
//         // insert to exam mysql
//         let rsExam = await axios.post("/admin/exam/create", {
//           title: t?.trim(),
//           category_id: category.id,
//           type: "import",
//           // lang_type: "en"
//         });
//         let exam = rsExam.data?.data;

//         let skip = 0;
//         let limit = 50;
//         let rows = [1];
//         while (rows.length != 0) {
//           rows = await schema.find({ parent: file, title: t }).skip(skip).limit(limit);

//           for (let row of rows) {
//             // insert questions mysql
//             let question = await execQuery(connectionMysql, `INSERT INTO questions SET ?`, {
//               created_at: new Date(),
//               updated_at: new Date(),
//               title: row.question?.trim(),
//               recommend: row.recommend?.trim(),
//               type: "single",
//             });

//             await execQuery(connectionMysql, `INSERT INTO exam_questions SET ?`, {
//               created_at: new Date(),
//               updated_at: new Date(),
//               question_id: question.insertId,
//               exam_id: exam.id,
//             });

//             await Promise.all(
//               row.answers.map(async (answer, index) => {
//                 await execQuery(connectionMysql, `INSERT INTO answers SET ?`, {
//                   created_at: new Date(),
//                   updated_at: new Date(),
//                   title: answer.content?.trim(),
//                   correct: answer.correct,
//                   question_id: question.insertId,
//                   default_order: index,
//                 });
//               })
//             );
//           }

//           skip += limit;
//         }
//       }
//     }
//   } catch (error) {
//     throw error;
//   }
// }

async function execQuery(connectionMysql, query, data) {
  return new Promise((resolve, reject) => {
    connectionMysql.query(query, data, (err, results) => {
      if (err) {
        reject("Error query:" + query + " : " + err);
        return;
      }
      resolve(results);
    });
  });
}

(async () => {
  try {
    // await connectMongo();
    let connectionMysql = connectMysql();
    // connectionMysql.
    // await handle(connectionMysql);
    console.log("Done");
  } catch (error) {
    console.error(error);
  }
})();
