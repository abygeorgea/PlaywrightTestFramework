import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { config } from '../Utils/config';

export class HomePage extends BasePage {
  readonly priceCategoryDropdown: Locator;
  readonly findTicketsButton: Locator;
  readonly cookieCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cookieCloseButton = page.getByRole('button', { name: 'Close' });
    this.priceCategoryDropdown = page.getByRole('combobox');
    this.findTicketsButton = page.getByRole('button', { name: 'Find Tickets' });
  }

  async openEvent(eventId: string) {
    await this.goto(`${config.url}?sh=${encodeURIComponent(eventId)}`);
  }

  async closeCookiePopup() {
    try {
      await this.cookieCloseButton.click({ timeout: 5000 });
      this.log.info('Cookie popup closed');
    } catch {
      this.log.debug('No cookie popup displayed');
    }
  }

  async selectPriceByValueAndFindTickets(optionValue: string) {
    this.log.info(`Selecting price option '${optionValue}' and clicking Find Tickets`);
    await this.priceCategoryDropdown.selectOption(optionValue);
    await this.findTicketsButton.click();
  }

  async selectPriceByTextAndFindTickets(optionText: string, occurrence: number = 0) {
    this.log.info(`Selecting option '${optionText}' (occurrence ${occurrence}) and clicking Find Tickets`);
    const option = this.page.getByRole('option', { name: optionText, exact: true }).nth(occurrence);
    const value = await option.getAttribute('value');
    await this.priceCategoryDropdown.selectOption(value!);
    await this.findTicketsButton.click();
  }
}
