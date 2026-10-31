import { Page, Locator } from '@playwright/test';
import { Logger } from '../Utils/logger';

export class LoginPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly signInNavButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInSubmitButton: Locator;
  private readonly log = new Logger('LoginPage');

  constructor(page: Page) {
    this.page = page;

    this.menuButton = page.getByRole('link', { name: 'dehaze' });
    this.signInNavButton = page.getByRole('link', { name: /Sign In \/ Sign up/ });

    this.emailInput = page.getByRole('textbox', { name: 'Email*' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password*' });
    this.signInSubmitButton = page.getByRole('button', { name: 'Sign In' });
  }

  async openSignInModal() {
    this.log.info('Opening sign in modal');
    await this.menuButton.click();
    await this.signInNavButton.click();
  }

  async login(email: string, password: string) {
    this.log.info(`Logging in as '${email}'`);
    await this.emailInput.fill(email);
    await this.emailInput.press('Tab');
    await this.passwordInput.fill(password);
    await this.signInSubmitButton.click();
  }

  async waitForLoginComplete() {
    await this.emailInput.waitFor({ state: 'hidden' });
    await this.page.waitForLoadState('domcontentloaded');
    this.log.info('Login complete');
  }
}
