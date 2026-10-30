import { Page, Locator } from '@playwright/test';
import { Logger } from '../Utils/logger';

export class CheckoutPage {
  readonly page: Page;
  readonly mobilePhoneInput: Locator;
  readonly addressLine1Input: Locator;
  readonly addressLine2Input: Locator;
  readonly suburbInput: Locator;
  readonly postcodeInput: Locator;
  readonly venueTermsCheckbox: Locator;
  readonly eventTermsCheckbox: Locator;
  readonly paymentMethodSection: Locator;
  readonly submitButton: Locator;
  private readonly log = new Logger('CheckoutPage');

  constructor(page: Page) {
    this.page = page;

    this.mobilePhoneInput = page.getByRole('textbox', { name: 'Mobile phone*' });
    this.addressLine1Input = page.getByRole('textbox', { name: 'Address line 1*' });
    this.addressLine2Input = page.getByRole('textbox', { name: 'Address line 2' });
    this.suburbInput = page.getByRole('textbox', { name: 'Suburb*' });
    this.postcodeInput = page.getByRole('textbox', { name: 'Postcode*' });

    this.venueTermsCheckbox = page.getByRole('checkbox', { name: 'I have read and agree to the terms and conditions for Enmore Theatre' });
    this.eventTermsCheckbox = page.getByRole('checkbox', { name: 'I have read and agree to the terms and conditions for ESPLOAD' });

    this.paymentMethodSection = page.getByText('Select Payment Method Use Gift Vouchers Voucher ID Redeem Apple Logo Credit');

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
    await this.venueTermsCheckbox.check();
    await this.eventTermsCheckbox.check();
  }

  async expandPaymentOptions() {
    this.log.info('Expanding payment options');
    await this.paymentMethodSection.click();
  }

  async submitPayment() {
    this.log.info('Submitting payment');
    await this.submitButton.click();
  }
}
