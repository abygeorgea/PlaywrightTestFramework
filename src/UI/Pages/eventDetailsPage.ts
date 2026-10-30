import { Page, Locator } from '@playwright/test';

export class EventDetailsPage {
  readonly page: Page;
  readonly deliveryMethodContainer: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.deliveryMethodContainer = page.locator('#delivery-methods, .delivery-options');
    this.nextButton = page.getByRole('button', { name: 'Next' });
  }

  async selectTicketByPrice(priceText: string) {
    const priceLocator = this.page.getByText(priceText, { exact: false }).first();
    await priceLocator.click();
  }

  private ticketLabel(ticketText: string): Locator {
    const escaped = ticketText.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page
      .locator('label')
      .filter({ hasText: new RegExp(`^\\s*${escaped}(\\s|\\(|$)`) })
      .first();
  }

  private ticketButton(ticketText: string, action: 'increase' | 'decrease'): Locator {
    const index = action === 'decrease' ? 1 : 2;
    return this.ticketLabel(ticketText).locator(`xpath=following::button[${index}]`);
  }

  async adjustTicketQuantity(ticketText: string, action: 'increase' | 'decrease' = 'increase', clicks: number = 1) {
    const button = this.ticketButton(ticketText, action);
    for (let i = 0; i < clicks; i++) {
      await button.click();
    }
  }

  async getTicketQuantity(ticketText: string): Promise<number> {
    const text = await this.ticketButton(ticketText, 'decrease')
      .locator('xpath=following-sibling::*[1]')
      .innerText();
    return parseInt(text.trim(), 10);
  }

  async selectDeliveryMethod(methodText: string) {
    await this.page.getByRole('radio', { name: methodText }).check();
  }

  async proceedToNext() {
    await this.nextButton.click();
  }
}
