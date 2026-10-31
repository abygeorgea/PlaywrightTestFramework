import fs from 'fs';
import path from 'path';
import { test as setup } from '../src/UI/Fixtures/pages.fixture';
import { AUTH_FILE } from '../src/UI/Fixtures/auth.fixture';
import { PurchaseTicketScenario } from '../src/UI/Models/purchaseTicketScenario';

const scenarios: PurchaseTicketScenario[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../testdata/purchaseTicketScenario.json'), 'utf-8')
);

setup('authenticate', async ({ page, homePage, loginPage }) => {
  const email = process.env.emailAddress!;
  const password = process.env.password!;

  await homePage.goto(scenarios[0].eventId);
  await homePage.closeCookiePopup();
  await loginPage.openSignInModal();
  await loginPage.login(email, password);
  await loginPage.waitForLoginComplete();

  await page.context().storageState({ path: AUTH_FILE });
});
