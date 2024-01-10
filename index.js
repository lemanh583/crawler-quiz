import puppeteer from "puppeteer";
import fs from "fs";
import mongoose from "mongoose";
import minimist from "minimist";
import HandleWebOnThiCongChuc from "./handle/onthicongchuc.js";
import HandleWebCongChucVN from "./handle/congchucvn.js";

const argv = minimist(process.argv.slice(2));

(async () => {
  try {
    await connectDB();
    await handleCrawler();
  } catch (error) {
    console.error(error);
  }
})();

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/crawler");
  } catch (error) {
    throw error;
  }
}

async function handleCrawler() {
  try {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // await page.setViewport({ width: 1080, height: 1024 });
    console.log(argv)
    switch (argv.p) {
      case 1:
        let ins = new HandleWebOnThiCongChuc(page)
        await ins.run();
        break;
      case 2:
        let insB = new HandleWebCongChucVN(page, browser)
        await insB.run()
        break;
      default:
        // await page.close();
        break;
    }
  } catch (error) {
    throw error;
  }
}

