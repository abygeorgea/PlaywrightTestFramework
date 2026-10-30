import { Page, Locator } from '@playwright/test';

export class ConfirmationPage {
  readonly page: Page;
  readonly confirmationHeading: Locator;
  readonly customerIdText: Locator;
  readonly modalCloseButton: Locator;

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
    return await this.confirmationHeading.textContent();
  }

  async clickCustomerId() {
    await this.customerIdText.click();
  }

  async closeWelcomeModal() {
    await this.modalCloseButton.click();
  }
}
