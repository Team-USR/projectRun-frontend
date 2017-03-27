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
      .moveToElement('div[class=quizList]', 10, 10)
      .click('div[class=quizList] button[type=button]')
      .waitForElementVisible('div[class=inProgress]', 2000)
      .click('button[id=continueQuizButton]')
      .pause(2000)
      .click('div[class=choicesListMultipleChoice] label[for="0"]')
      .click('div[class=choicesListMultipleChoice] label[for="1"]')
      .pause(1000)
      .end();
      // .click('div[class=singleMultipleChoice] input[value=0]')
      // .pause(1000)
      // .click('div[class=matchRightElement] select[id=0] option[value=Red]')
      // .click('div[class=matchRightElement] select[id=1] option[value=Watch]')
      // .pause(1000);
  },
};
