import { test as setup } from '../src/UI/Fixtures/pages.fixture';
import { AUTH_FILE } from '../src/UI/Fixtures/auth.fixture';

setup('authenticate', async ({ page, homePage, loginPage }) => {
  const email = process.env.emailAddress!;
  const password = process.env.password!;

  await homePage.goto();
  await homePage.closeCookiePopup();
  await loginPage.openSignInModal();
  await loginPage.login(email, password);
  await loginPage.waitForLoginComplete();

  await page.context().storageState({ path: AUTH_FILE });
});
