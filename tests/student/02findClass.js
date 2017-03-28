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
  'Find a class': (browser) => {
    browser
      .end();
  },
};
