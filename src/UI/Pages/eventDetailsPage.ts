import { Page, Locator } from '@playwright/test';
import { Logger } from '../Utils/logger';

export class EventDetailsPage {
  readonly page: Page;
  readonly deliveryMethodContainer: Locator;
  readonly nextButton: Locator;
  private readonly log = new Logger('EventDetailsPage');

  constructor(page: Page) {
    this.page = page;
    this.deliveryMethodContainer = page.locator('#delivery-methods, .delivery-options');
    this.nextButton = page.getByRole('button', { name: 'Next' });
  }

  async selectTicketByPrice(priceText: string) {
    this.log.info(`Selecting ticket by price '${priceText}'`);
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
    this.log.info(`Clicking ${action} for '${ticketText}' ${clicks} time(s)`);
    const button = this.ticketButton(ticketText, action);
    try {
      for (let i = 0; i < clicks; i++) {
        await button.click();
      }
    } catch (error) {
      this.log.error(`Failed to ${action} quantity for '${ticketText}'`, error);
      throw error;
    }
  }

  async getTicketQuantity(ticketText: string): Promise<number> {
    const text = await this.ticketButton(ticketText, 'decrease')
      .locator('xpath=following-sibling::*[1]')
      .innerText();
    const quantity = parseInt(text.trim(), 10);
    this.log.info(`Quantity for '${ticketText}' is ${quantity}`);
    return quantity;
  }

  async selectDeliveryMethod(methodText: string) {
    this.log.info(`Selecting delivery method '${methodText}'`);
    await this.page.getByRole('radio', { name: methodText }).check();
  }

  async proceedToNext() {
    this.log.info('Proceeding to next step');
    await this.nextButton.click();
  }
}
