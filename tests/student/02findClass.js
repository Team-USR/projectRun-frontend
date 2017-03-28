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
  'Go to a class': (browser) => {
    browser //eslint-disable-line
      .click('a[id=class-nav]')
      .pause(1000)
      .waitForElementVisible('div[class=groupPanelWrapper]', 2000)
      .waitForElementVisible('div[class=quizList]', 1000)
      .useXpath()
      .expect.element('//button[contains(text(), "Nightwatch class")]').to.be.present;

    browser
      .useCss()
      .setValue('input[id=searchBar]', 'nightwatch class')
      .waitForElementVisible('li[class=classesNav]', 2000)
      .useXpath()
      .click('//li[contains(@class, "classesNav")]//button[contains(text(), "Nightwatch class")]')
      .pause(2000)
      .useCss()
      .waitForElementVisible('div[class="line-chart-container"] div[class="recharts-wrapper"]', 1000);
  },

  'Find a class': (browser) => {
    browser //eslint-disable-line
      .pause(1000)
      .useXpath()
      .click('//button[contains(text(), "Join a class")]')
      .useCss()
      .waitForElementVisible('input[id=searchBarClasses]', 2000)
      .expect.element('div[class=pendingClasses]').to.be.present;

    browser //eslint-disable-line
      .setValue('input[id=searchBarClasses]', 'ouhqwbiehpqwe')
      .pause(2500)
      .expect.element('span[class="glyphicon-plus"]').not.to.be.present;

    browser //eslint-disable-line
      .clearValue('input[id=searchBarClasses]')
      .setValue('input[id=searchBarClasses]', 'software')
      .pause(2500)
      .useXpath()
      .expect.element('//button[contains(text(), "Software Engineering")]').to.be.present;

    browser.end();
  },
};
