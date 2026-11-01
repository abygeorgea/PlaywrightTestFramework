import { test as setup } from '../src/UI/Fixtures/pages.fixture';
import { AUTH_FILE } from '../src/UI/Utils/paths';
import { config } from '../src/UI/Utils/config';
import scenarioData from '../testdata/purchaseTicketScenario.json';

setup('authenticate', async ({ page, homePage, loginPage }) => {
  const [firstScenario] = scenarioData;

  await setup.step('Open the event page', async () => {
    await homePage.openEvent(firstScenario.eventId);
  });

  await setup.step('Sign in', async () => {
    await loginPage.openSignInModal();
    await loginPage.login(config.emailAddress, config.password);
    await loginPage.waitForLoginComplete();
  });

  await setup.step('Save the authenticated session', async () => {
    await page.context().storageState({ path: AUTH_FILE });
  });
});
