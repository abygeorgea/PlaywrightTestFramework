import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CheckoutPage extends BasePage {
  readonly mobilePhoneInput: Locator;
  readonly addressLine1Input: Locator;
  readonly addressLine2Input: Locator;
  readonly suburbInput: Locator;
  readonly postcodeInput: Locator;
  readonly termsCheckboxes: Locator;
  readonly paymentMethodSection: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);

    this.mobilePhoneInput = page.getByRole('textbox', { name: 'Mobile phone*' });
    this.addressLine1Input = page.getByRole('textbox', { name: 'Address line 1*' });
    this.addressLine2Input = page.getByRole('textbox', { name: 'Address line 2' });
    this.suburbInput = page.getByRole('textbox', { name: 'Suburb*' });
    this.postcodeInput = page.getByRole('textbox', { name: 'Postcode*' });

    this.termsCheckboxes = page.getByRole('checkbox', { name: /terms and conditions/i });

    this.paymentMethodSection = page.getByRole('heading', { name: 'Select Payment Method' });

    this.submitButton = page.getByRole('button', { name: 'Submit payment' });
  }

  async fillContactAndAddressDetails(details: {
    mobile: string;
    addressLine1: string;
    addressLine2?: string;
    suburb: string;
    postcode: string;
  }) {
    this.log.info('Filling contact and address details');
    await this.mobilePhoneInput.fill(details.mobile);
    await this.addressLine1Input.fill(details.addressLine1);

    if (details.addressLine2) {
      await this.addressLine2Input.fill(details.addressLine2);
    }

    await this.suburbInput.fill(details.suburb);
    await this.suburbInput.press('Tab');
    await this.postcodeInput.fill(details.postcode);
  }

  async acceptTermsAndConditions() {
    this.log.info('Accepting terms and conditions');
    await this.termsCheckboxes.first().waitFor({ state: 'visible' });
    for (const checkbox of await this.termsCheckboxes.all()) {
      await checkbox.check();
    }
  }

  async expandPaymentOptions() {
    await this.submitButton.waitFor({ state: 'visible' });
    if (await this.paymentMethodSection.isVisible()) {
      this.log.info('Expanding payment options');
      await this.paymentMethodSection.click();
    } else {
      this.log.info('No payment method selection shown; skipping');
    }
  }

  async submitPayment() {
    this.log.info('Submitting payment');
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
