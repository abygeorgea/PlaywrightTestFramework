import { test as base } from '@playwright/test';
import { HomePage } from '../Pages/homePage';
import { EventDetailsPage } from '../Pages/eventDetailsPage';
import { SummaryPage } from '../Pages/summaryPage';
import { CheckoutPage } from '../Pages/checkoutPage';
import { ConfirmationPage } from '../Pages/confirmationPage';
import { LoginPage } from '../Pages/loginPage';

type PageFixtures = {
  homePage: HomePage;
  eventDetailsPage: EventDetailsPage;
  summaryPage: SummaryPage;
  checkoutPage: CheckoutPage;
  confirmationPage: ConfirmationPage;
  loginPage: LoginPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  eventDetailsPage: async ({ page }, use) => {
    await use(new EventDetailsPage(page));
  },
  summaryPage: async ({ page }, use) => {
    await use(new SummaryPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  confirmationPage: async ({ page }, use) => {
    await use(new ConfirmationPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
