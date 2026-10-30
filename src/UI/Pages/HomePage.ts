import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly priceCategoryDropdown: Locator;
  readonly findTicketsButton: Locator;
  readonly cookieCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookieCloseButton = page.getByRole('button', { name: 'Close' });
    this.priceCategoryDropdown = page.locator('#p');
    this.findTicketsButton = page.getByRole('button', { name: 'Find Tickets' });
  }

  async goto() {
    await this.page.goto('https://premier.ticketek.com.au/shows/show.aspx?sh=ESPLOAD');
  }

  async closeCookiePopup() {
    try {
      await this.cookieCloseButton.click({ timeout: 5000 });
    } catch {
    }
  }

  async selectPriceAndFindTickets(optionValue: string) {
    await this.priceCategoryDropdown.selectOption(optionValue);
    await this.findTicketsButton.click();
  }
}
