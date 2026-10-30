import { Page, Locator } from '@playwright/test';
import { Logger } from '../Utils/logger';

export class ConfirmationPage {
  readonly page: Page;
  readonly confirmationHeading: Locator;
  readonly customerIdText: Locator;
  readonly modalCloseButton: Locator;
  private readonly log = new Logger('ConfirmationPage');

  constructor(page: Page) {
    this.page = page;
    this.confirmationHeading = page.getByRole('heading', { name: 'Order Confirmed' });
    this.customerIdText = page.getByText('Customer ID:');

    this.modalCloseButton = page
      .frameLocator('iframe[title="Modal Message"]')
      .getByRole('button', { name: 'Close Message' });
  }

  async getConfirmationMessage(): Promise<string | null> {
    await this.confirmationHeading.click();
    const message = await this.confirmationHeading.textContent();
    this.log.info(`Confirmation message: '${message}'`);
    return message;
  }

  async clickCustomerId() {
    this.log.info('Clicking customer ID');
    await this.customerIdText.click();
  }

  async closeWelcomeModal() {
    this.log.info('Closing welcome modal');
    await this.modalCloseButton.click();
  }
}
