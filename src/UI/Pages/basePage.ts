import { Page } from '@playwright/test';
import { Logger } from '../Utils/logger';

export abstract class BasePage {
  readonly page: Page;
  protected readonly log: Logger;

  protected constructor(page: Page) {
    this.page = page;
    this.log = new Logger(this.constructor.name);
  }

  async goto(url: string) {
    this.log.info(`Navigating to ${url}`);
    await this.page.goto(url);
  }
}
