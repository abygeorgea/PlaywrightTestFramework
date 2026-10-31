import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class ConfirmationPage extends BasePage {
  readonly confirmationHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmationHeading = page.getByRole('heading', { name: 'Order Confirmed' });
  }
}
