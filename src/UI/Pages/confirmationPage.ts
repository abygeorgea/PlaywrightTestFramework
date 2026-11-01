import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class ConfirmationPage extends BasePage {
  readonly confirmationHeading: Locator;

  readonly orderSummaryHeading: Locator;
  readonly customerId: Locator;
  readonly transactionNumber: Locator;

  readonly eventHeading: Locator;
  readonly accessingTicketsText: Locator;
  readonly viewTicketsLink: Locator;
  readonly deliveryMethodText: Locator;

  readonly orderTable: Locator;
  readonly totalRow: Locator;

  constructor(page: Page) {
    super(page);

    this.confirmationHeading = page.getByRole('heading', { name: 'Order Confirmed' });
    this.orderSummaryHeading = page.getByRole('heading', { name: 'Order Summary' });
    this.customerId = page.getByText(/Customer ID:/);
    this.transactionNumber = page.getByText(/Transaction Number:/);

    this.eventHeading = page.getByRole('heading', { level: 4 }).filter({ hasNotText: 'Order Summary' });
    this.accessingTicketsText = page.getByText('ACCESSING YOUR TICKETS');
    this.viewTicketsLink = page.getByRole('link', { name: 'View your tickets' });
    this.deliveryMethodText = page.getByText('Delivery method');

    this.orderTable = page.getByRole('table');
    this.totalRow = page.getByRole('row', { name: /TOTAL/ });
  }

  async waitForPageLoaded() {
    await this.page.waitForLoadState('load');
    await this.confirmationHeading.waitFor({ state: 'visible' });
    await this.orderSummaryHeading.waitFor({ state: 'visible' });
    await this.customerId.waitFor({ state: 'visible' });
    await this.transactionNumber.waitFor({ state: 'visible' });
    await this.eventHeading.first().waitFor({ state: 'visible' });
    await this.accessingTicketsText.waitFor({ state: 'visible' });
    await this.viewTicketsLink.waitFor({ state: 'visible' });
    await this.deliveryMethodText.waitFor({ state: 'visible' });
    await this.orderTable.waitFor({ state: 'visible' });
    await this.totalRow.waitFor({ state: 'visible' });
    this.log.info('Confirmation page fully loaded');
  }
}
