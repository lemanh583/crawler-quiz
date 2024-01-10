import testSchema from "../model/test.js";

class HandleWebCongChucVN {
  constructor(page, browser) {
    this.page = page;
    this.browser = browser;
  }

  async run() {
    this.getTinHocPage()
    return
    await this.login()
    await this.page.goto("https://congchucvn.com/", { waitUntil: "load"});
    // this.waitForTimeout(2000);
    let parentEl = await this.page.$$(".container-fluid > .col-md-6");
    let indexParentEl = 72;
    while (indexParentEl < 73) {
      let parent = parentEl[indexParentEl];
      let textParent = await parent.$eval("h2", (el) => el.textContent).catch((e) => "");
      console.log("__textParent__: " + textParent + " - index: " + indexParentEl)
      
      // click action test
      let linkParent = await parent.$("a");
      await linkParent.click();
      await this.page.waitForNavigation({ waitUntil: "load" })
      await this.waitForTimeout(2000);

      let testAllEl = await this.page.$$("#content_page .item");
      let testAllIndex = 4;
      // if (indexParentEl >= 75) {
      //   testAllIndex = 0
      // }
      
      // get test
      while (testAllIndex < testAllEl.length) {
        console.log("____index_test____", testAllIndex)
        let testEl = testAllEl[testAllIndex];

        // get text test
        let textTest = await testEl.$eval("a", (el) => el.textContent);

        let currentLinkTest = await this.page.url();

        // get link and click
        let link = await testEl.$("a");
        await link.click();
        await this.page.waitForNavigation({ waitUntil: "load" })
        await this.waitForTimeout(2000);

        await this.getQuestion(textParent, textTest);

        await this.page.goto(currentLinkTest, { waitUntil: "load" });
        await this.waitForTimeout(2000);
        testAllEl = await this.page.$$("#content_page .item");
        console.log("re get length: " + testAllEl?.length)
        testAllIndex += 1;
      }

      // re-end
      await this.page.goto("https://congchucvn.com/", { waitUntil: "load" });
      // this.waitForTimeout(2000);
      parentEl = await this.page.$$(".container-fluid > .col-md-6");
      indexParentEl += 1;
    }
  }

  async login() {
    await this.page.goto("https://congchucvn.com/login.php", { waitUntil: "load" })
    await this.page.type("input[name=email]", "ledinhnam107@gmail.com");
    await this.page.type("input[name=pass]", "123456");
    await this.page.click(".btn.btn-success");
    // await this.page.waitForNavigation({ waitUntil: "load" })
    // await this.waitForTimeout(2000)
  }

  async getQuestion(parent, title) {
    let btnNext = "Next";
    let questions = [1]
    while (questions.length > 0) {
      // await this.waitForTimeout(2000)   
      questions = await this.page.$$("div.question");
      let textQuestion = await questions[0].$eval("p", (el) => el.textContent).catch((e) => 'failed to find element matching selector "p"');
      if (textQuestion == 'failed to find element matching selector "p"') {
        textQuestion = await questions[0].$eval("div", (el) => el.textContent).catch(() => '')
      }
      if (textQuestion?.trim() == '') {
        textQuestion = await questions[0].$eval("li", (el) => el.textContent).catch((e) => "not found li")
      }
      if (textQuestion == "not found li") {
        let listP = await questions[0].$$("p")
        let arr = await Promise.all(
          listP.map((p) => {
            return p.evaluate(ep => ep.textContent)
          })
        )
        textQuestion = arr.join(" ")
      }
      questions.shift();

      // checked
      // await this.waitForTimeout(1000)
      let optionA = questions[0]
      // let checkEl = await optionA.$("input")
      // await checkEl.click();
      // await checkEl.click();
      await optionA.$eval("input[type=radio]", elem => elem.click());
      await optionA.$eval("input[type=radio]", elem => elem.click());

      // await this.waitForTimeout(2000)
      let answers = await this.getAnswers(questions);

      let el = await this.page.$(".fb-comments")
      await el?.evaluate(el => el.remove());
      // await this.page.$eval("#facebook", el => el.remove());

      // const context = this.browser.defaultBrowserContext();
      // URL An array of permissions
      // await context.overridePermissions("https://www.facebook.com", ["notifications"]);

      // await this.waitForTimeout(3000);
      let submitQuestion = await this.page.$("#cauhoi .click input");
      // console.log(submitQuestion)
      await submitQuestion.click();
      
      // await this.waitForTimeout(2500);
      await this.page.waitForSelector("#feedback .success")
      
      let textAnswer = "";
      let checkText = await this.page.$eval("#feedback .success", (el) => el.textContent);
      if (checkText == "Wonderful. Correct answer") {
        textAnswer = "Đáp án đúng: A";
        // await this.page.click(".show .hienthi");
      } else {
        textAnswer = checkText;
      }

      // let listTagP = await this.page.$$("#feedback .noidung_cauhoi > p")
      // // await this.waitForTimeout(1000)
      // let recommend = await this.getRecommend(listTagP)
      // await this.waitForTimeout(2000)
      let obj = {
        parent,
        title: title?.trim(),
        question: textQuestion,
        answers,
        correct: textAnswer,
        recommend: ""
      };

    //   console.log("____obj____", obj)

      await testSchema.create(obj);
      console.log("___textQuestion____", obj.question)
    
      await this.page.click(".click .next").catch((err) => err.message);
      await this.waitForTimeout(2000)
      questions = await this.page.$$(".question").catch(() => []);
    //   btnNext = await this.page.$eval(".click .next", (el) => el.value).catch((err) => err.message);
    //   console.log('btnNext', btnNext);
    }
  }

  async getAnswers(answers) {
    // console.log("___answer__", answers);
    let array = await Promise.all(
      answers.map(async (answerEl) => {
        await answerEl.waitForSelector("label")
        let text = await answerEl.$eval("label", (el) => el.textContent);
        return {
          content: text?.trim(),
        };
      })
    );
    // console.log("___array__", array);
    return array;
  }

  async getRecommend(listTag) {
    let array = await Promise.all(
      listTag.map(async (answerEl) => {
        let text = await answerEl.evaluate(el => el.textContent)
        return text?.trim();
      })
    );
    return array.join("\n");
  }

  async getTinHocPage() {
    await this.login()
    await this.waitForTimeout(2000)
    await this.page.goto("https://congchucvn.com/tin", { waitUntil: "load"});
    let items = await this.page.$$("#content .item");
    let indexItems = 0;

    while (indexItems < items.length) {
      let element = items[indexItems]
      let link = await element.waitForSelector("a")
      let textTest = await link.evaluate(el => el.textContent)
      await link.click()

      await this.waitForTimeout(2000)
      // let textParent = await element.$eval("> a", (el) => el.textContent);
      // await element.$eval("> a", el => el.click())
      // await this.page.waitForNavigation({ waitUntil: "load" })
      
      await this.getQuestion("Bộ câu hỏi trắc nghiệm Tin học thi công chức, viên chức", textTest);
      
      await this.page.goto("https://congchucvn.com/tin", { waitUntil: "load"});
      items = await this.page.$$("#content .item");
      indexItems += 1
    }

  }

  async waitForTimeout(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }
}

export default HandleWebCongChucVN;
