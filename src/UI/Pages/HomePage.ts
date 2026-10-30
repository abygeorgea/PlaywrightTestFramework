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

  async goto() {
    this.log.info('Navigating to the show page');
    await this.page.goto('https://premier.ticketek.com.au/shows/show.aspx?sh=ESPLOAD');
  }

  async closeCookiePopup() {
    try {
      await this.cookieCloseButton.click({ timeout: 5000 });
      this.log.info('Cookie popup closed');
    } catch {
      this.log.debug('No cookie popup displayed');
    }
  }

  async selectPriceAndFindTickets(optionValue: string) {
    this.log.info(`Selecting price option '${optionValue}' and clicking Find Tickets`);
    await this.priceCategoryDropdown.selectOption(optionValue);
    await this.findTicketsButton.click();
  }
}
