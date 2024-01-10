import  mongoose from "mongoose";
const Schema = mongoose.Schema;

const answersSchema = new Schema({
  title: String,
  correct: { type: Boolean, default: false },
});

const questionsSchema = new Schema({
    title: String,
    recommend: String,
    answers: [answersSchema]
})

const examSchema = new Schema({
    title: String,
    lang: { type: String, default: 'vi'},
    questions: [questionsSchema]
})

const categorySchema = new Schema({
  title: String,
  exams: [examSchema],
  lang: { type: String, default: 'vi'},
  created_at: { type: Number, default: Date.now },
  updated_at: { type: Number, default: Date.now },
});

const tests = mongoose.model("newcongchucvn", categorySchema);

export default tests;
