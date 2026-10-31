import { Page, Locator } from '@playwright/test';
import { Logger } from '../Utils/logger';

export class HomePage {
  readonly page: Page;
  readonly priceCategoryDropdown: Locator;
  readonly findTicketsButton: Locator;
  readonly cookieCloseButton: Locator;
  private readonly log = new Logger('HomePage');

  constructor(page: Page) {
    this.page = page;
    this.cookieCloseButton = page.getByRole('button', { name: 'Close' });
    this.priceCategoryDropdown = page.locator('#p');
    this.findTicketsButton = page.getByRole('button', { name: 'Find Tickets' });
  }

  async goto(eventId: string) {
    const baseUrl = process.env.url;
    if (!baseUrl) {
      this.log.error("Environment variable 'url' is not set");
      throw new Error("Environment variable 'url' is not set");
    }
    const url = `${baseUrl}?sh=${encodeURIComponent(eventId)}`;
    this.log.info(`Navigating to ${url}`);
    await this.page.goto(url);
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
    const escaped = optionText.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const option = this.priceCategoryDropdown
      .locator('option')
      .filter({ hasText: new RegExp(`^\\s*${escaped}\\s*$`) })
      .nth(occurrence);
    const value = await option.getAttribute('value');
    await this.priceCategoryDropdown.selectOption(value!);
    await this.findTicketsButton.click();
  }
}
