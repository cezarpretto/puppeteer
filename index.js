const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    })
    const page = await browser.newPage()
    await page.goto('https://www.userede.com.br')
    const toggledMenu = await page.$('.my-account-gtm-trigger')
    await toggledMenu.click()
    await page._client.send('Animation.setPlaybackRate', { playbackRate: 15 })
    await page.evaluate(() => {
      document.querySelector('#usernameField').value = ''
      document.querySelector('#passwordField').value = ''
    })
    const loginBtn = await page.$('#form-login-entrar')
    await loginBtn.click()
    await page.waitForNavigation({ timeout: 0, waitUntil: ['load', 'domcontentloaded', 'networkidle0'] })
    const user = await page.evaluate(() => {
      const user = window.angular.element(document.querySelector('body')).scope().user
      return user
    })
    console.log(user.token)
    await page.screenshot({path: 'example.png'})

    await browser.close()
  } catch (e) {
    console.error(e)
  }
})();
