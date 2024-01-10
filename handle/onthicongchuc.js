import testSchema from "../model/onthicongchuc.js";

class HandleWebOnThiCongChuc {
  constructor(page) {
    this.page = page;
    this.link = [
      {
        name: "Từng chuyên đề",
      },
    ];
  }

  async run() {
    await this.login();

    await this.page.goto("https://test.onthicongchucvienchuc.com/course/view.php?id=10");
    let parentEl = await this.page.$$(".topics > li");
    let indexParentEl = 0;
    while (indexParentEl < parentEl.length) {
      let parent = parentEl[indexParentEl];
      let sessionText = await parent.$eval("h3.sectionname", (el) => el.textContent);
      sessionText = sessionText.trim();

      let topicElement = await parent.$$("div.activity-item");
      // console.log("topic element", topicElement.length);
      let topicIndex = 0;
      while (topicIndex < topicElement.length) {
        let element = topicElement[topicIndex];
        let type = await element.$eval(
          ".media-body > .text-uppercase.small",
          (el) => el.textContent
        );
        type = type.trim();
        if (type != "Trắc nghiệm") {
          topicIndex += 1;
          continue;
        }

        let title = await element.$eval("a", (el) => el.textContent);

        let link = await element.$("a");
        await link.click();

        await this.waitForTimeout(2000)

        let seeAgainEl = await this.page.$(".table-responsive .cell.c4 a")
        // console.log("See Again", seeAgainEl)
        await seeAgainEl.click()        

        // let btnSubmitContinues = await this.page.waitForSelector("button.btn.btn-primary");
        // await btnSubmitContinues.click("button.btn.btn-primary");

        await this.waitForTimeout(2000);
        let currentLink = this.page.url();
        let page = 0;
        // await this.page.goto(currentLink + "&page=" + page);

        // await this.waitForTimeout(2000);
        //   let nextNav = await this.page.waitForSelector("#mod_quiz-next-nav")
        let value = "Trang tiếp";

        while (value == "Trang tiếp") {
          await this.getQuestions(title, sessionText);
          page += 1;
          await this.page.goto(currentLink + "&page=" + page);
          await this.waitForTimeout(2000);
          value = await this.page.$eval(".arrow_link.mod_quiz-next-nav > .arrow_text", (el) => el.textContent).catch((e) => e?.message);
          console.log('___value___', value);
        }

        await this.page.goto("https://test.onthicongchucvienchuc.com/course/view.php?id=10");
        await this.waitForTimeout(2000);

        parentEl = await this.page.$$(".topics > li");
        parent = parentEl[indexParentEl];
        topicElement = await parent.$$("div.activity-item");
        topicIndex += 1;
      }

      parentEl = await this.page.$$(".topics > li");
      indexParentEl += 1;
    }

    await this.page.close();
  }

  async login() {
    await this.page.goto("https://test.onthicongchucvienchuc.com/login/index.php");
    await this.page.type("#username", "bongyeunaruse");
    await this.page.type("#password", "Team@2020");
    await this.page.click("#loginbtn");
  }

  async getQuestions(title, sectionName) {
    let questions = await this.page.$$(".que .content");
    for (let element of questions) {
      let question = await element.$eval(".qtext", (el) => el.textContent);
      await this.waitForTimeout(2000);
      let answers = await this.getAnswers(element);
      let correctAnswer = await this.getCorrectAnswer(element);
      let obj = {
        parent: sectionName?.trim(),
        title: title.replace("Trắc nghiệm", "").trim(),
        question: question.trim(),
        answers,
        correct: correctAnswer.correct?.trim(),
        recommend: correctAnswer.recommend?.trim()
      };
      let correct_options = this.getCorrectOption(obj.answers, obj.correct)
      obj.correct_options = correct_options
      console.log("____obj____", obj.question);
      await testSchema.create(obj);
    }
  }

  getCorrectOption(answers, correct) {
    let regex = /\b(\w)\w*(?=\.\s)/g
    if (regex.test(correct)) {
      return correct.match(regex)?.[0]?.toUpperCase()
    }
    let objAnswer = {
      0 : 'A',
      1 : 'B',
      2 : 'C',
      3 : 'D',
      4 : 'E',
    }
    let index = answers.findIndex(answer => answer.content ===  correct)
    return index !== -1 ? objAnswer[index] : ""
  }

  async getAnswers(contentElement) {
    let answers = await contentElement.$$(".answer > div");
    let array = await Promise.all(
      answers.map(async (answerEl) => {
        let text = await answerEl.$eval(".flex-fill.ml-1", (el) => el.textContent);
        return {
          content: text.trim(),
        };
      })
    );
    return array;
  }

  async getCorrectAnswer(contentElement) {
    // let answer = await contentElement.$(".answer > div");
    // let btnGetCorrect = await contentElement.$(".im-controls > input");
    // if (btnGetCorrect) {
    //   await answer.click();
    //   await btnGetCorrect.click();
    //   await this.waitForTimeout(2000);
    // }

    let correctEl = await contentElement.$(".outcome.clearfix");
    if (correctEl) {
      let text = await correctEl.$eval(".feedback .rightanswer", (el) => el.textContent);
      let recommend = await correctEl.$eval(".feedback .specificfeedback", (el) => el.textContent).catch(() => "");
      console.log("___correctText____", text);
      return {
        correct: text.replace("The correct answer is:", ""),
        recommend
      };
    }
    return {
      correct: "",
      recommend: ""
    };
  }

  async waitForTimeout(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }

  async actionTest() {
    await this.login();

    await this.page.goto("https://test.onthicongchucvienchuc.com/course/view.php?id=10");
    let allEl = await this.page.$$("div.activity-item");
    let allIndex = 0;
    while (allIndex < allEl.length) {
      let element = allEl[allIndex];

      let link = await element.$("a");
      await link.click();

      await this.waitForTimeout(2000);
      let btnSubmitContinues = await this.page.waitForSelector("button.btn.btn-primary");
      await btnSubmitContinues.click("button.btn.btn-primary");

      await this.waitForTimeout(2000);
      let currentLink = this.page.url();
      let page = 0;
      await this.page.goto(currentLink + "&page=" + page);
      await this.waitForTimeout(2000);

      let value = "Trang tiếp";
      while (value == "Trang tiếp") {
        let questions = await this.page.$$(".que .content");

        for (let el of questions) {
          let answer = await el.$(".answer > div");
          let btnGetCorrect = await el.$(".im-controls > input");
          if (btnGetCorrect) {
            await answer.click();
          }
        }

        page += 1;
        await this.page.goto(currentLink + "&page=" + page);
        await this.waitForTimeout(2000);
        value = await this.page.$eval("#mod_quiz-next-nav", (el) => el.value);
      }
    }
  }
}

export default HandleWebOnThiCongChuc;
