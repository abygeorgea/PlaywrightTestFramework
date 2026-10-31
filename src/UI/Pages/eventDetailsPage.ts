import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class EventDetailsPage extends BasePage {
  readonly nextButton: Locator;

  constructor(page: Page) {
    super(page);
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

  async selectDeliveryMethod(methodText: string) {
    this.log.info(`Selecting delivery method '${methodText}'`);
    const radio = this.page.getByRole('radio', { name: methodText });
    await this.page.getByText(methodText, { exact: true }).click();
    if (!(await radio.isChecked())) {
      this.log.error(`Delivery method '${methodText}' was not selected`);
      throw new Error(`Delivery method '${methodText}' was not selected`);
    }
  }

  async proceedToNext() {
    this.log.info('Proceeding to next step');
    await this.nextButton.click();
  }
}
