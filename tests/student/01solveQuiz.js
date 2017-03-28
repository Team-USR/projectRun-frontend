module.exports = {
  'Student login': (browser) => {
    browser
      .url('http://localhost:3000/#/home')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('button[id=loginButton]', 1000)
      .click('button[id=loginButton]')
      .waitForElementVisible('div[class=loginPage]', 1000)
      .setValue('input[id=formEmail]', 'nightwatchtest@gmail.com')
      .pause(500)
      .setValue('input[id=formPassword]', 'nightwatchtest')
      .click('button[type=submit]')
      .waitForElementVisible('h1[class=welcome_message]', 2000)
      .expect.element('h1[class=welcome_message]').text.to.contain('Welcome, Nightwatch!');
  },
  'Start a quiz': (browser) => {
    browser
      .click('a[id=quiz-nav]')
      .pause(1000)
      .waitForElementVisible('div[class=pie-chart-container]', 2000)
      .pause(2000)
      .moveToElement('div[class=quizList]', 10, 10)
      .click('div[class=quizList] button[type=button]')
      .waitForElementVisible('div[class=inProgress]', 2000)
      .useXpath()
      .click('//button[contains(text(), "Continue")] | //button[contains(text(), "Start")]')
      .useCss()
      .pause(2000)
      .click('div[class=choicesListMultipleChoice] label[for="12"] input[type=checkbox]')
      .click('div[class=choicesListMultipleChoice] label[for="13"] input[type=checkbox]')
      .click('label[for="15"] input[type=radio]')
      .moveToElement('div[class=matchRightElement]', 100, 100)
      .waitForElementVisible('div[class=matchQuizTitle]', 1000)
      .click('div[class=matchRightElement] select[id="0"] option[value="Red"]')
      .click('div[class=matchRightElement] select[id="1"] option[value="Watch"]')
      .pause(2000)
      .moveToElement('input[class="cloze-gap"]', 100, 100)
      .setValue('input[class="cloze-gap"][id="1"]', 'blue')
      .pause(2000)
      .moveToElement('div[id=wordsContainer]', 100, 100)
      .click('div[id=wordsContainer] button[type=button]')
      .pause(500)
      .click('div[id=wordsContainer] button[type=button]')
      .pause(500)
      .click('div[id=wordsContainer] button[type=button]')
      .pause(500)
      .click('div[id=wordsContainer] button[type=button]')
      .pause(1000)
      .moveToElement('div[class=submitPanel]', 100, 100)
      .click('div[class=submitPanel] button[type=button]')
      .pause(1000)
      .expect.element('div[class=submitPanel] h5').text.to.contain('Last updated');

    browser
      .click('div[class=submitPanel] button[type=button]')
      .useXpath()
      .click('//button[contains(text(), "SUBMIT")]')
      .useCss()
      .pause(2000)
      .end();
  },
};
