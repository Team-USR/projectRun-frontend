module.exports = {
  'Demo test app': function (browser) {
    browser
      .url('http://localhost:3000/#/home')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('button[id=loginButton]', 1000)
      .click('button[id=loginButton]')
      .pause(1000)
      .end();
  },
};
