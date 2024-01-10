import  mongoose from "mongoose";
const Schema = mongoose.Schema;

const answersSchema = new Schema({
  content: String,
  correct: { type: Boolean, default: false},
  created_at: { type: Number, default: Date.now },
  updated_at: { type: Number, default: Date.now },
});

const questionSchema = new Schema({
  parent: String,
  title: String,
  question: String,
  answers: [answersSchema],
  correct: String,
  correct_options: String,
  recommend: String,
  created_at: { type: Number, default: Date.now },
  updated_at: { type: Number, default: Date.now },
});

const tests = mongoose.model("onthicongchuc", questionSchema);

export default tests;
