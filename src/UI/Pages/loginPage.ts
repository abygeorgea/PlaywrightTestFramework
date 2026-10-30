import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly signInNavButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.menuButton = page.getByRole('link', { name: 'dehaze' });
    this.signInNavButton = page.getByRole('link', { name: ' Sign In / Sign up' });

    this.emailInput = page.getByRole('textbox', { name: 'Email*' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password*' });
    this.signInSubmitButton = page.getByRole('button', { name: 'Sign In' });
  }

  async openSignInModal() {
    await this.menuButton.click();
    await this.signInNavButton.click();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.emailInput.press('Tab');
    await this.passwordInput.fill(password);
    await this.signInSubmitButton.click();
  }
}
