# Ticketek E2E Checkout Tests (Playwright + TypeScript)

End-to-end tests for the Ticketek preview event. Each scenario picks a event , adds a zero-valued ticket, chooses a delivery option, signs in, completes checkout and asserts that the order confirmation is displayed.

Built with the Page Object Model (POM). Authentication runs once in a setup project and the session is reused by every test.

## Prerequisites

- Node.js 24.2 or later
- A pre-created Ticketek test account. Create one at https://premier.ticketek.com.au/Membership/JoinNow_Default.aspx

## Setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Install the Playwright browsers:

   ```bash
   npx playwright install chromium
   ```

3. Create your environment file and fill in the details below:

   ```bash
   cp .env.example .env
   ```
   
   
   If using windows
   ```bash
   copy .env.example .env
   ```




   | Variable       | Description                                             |
   | -------------- | ------------------------------------------------------- |
   | `url`          | Show page URL, e.g. `https://premier.ticketek.com.au/shows/show.aspx` |
   | `emailAddress` | Email of the test account                               |
   | `password`     | Password of the test account                            |

   `.env` is gitignored. A missing variable stops the run with a message that names it.

## Running the tests

| Mode                          | Command                                 |
| ----------------------------- | --------------------------------------- |
| Headless (default)            | `npm test`                              |
| Headed (visible browser)      | `npm run test:headed`                   |
| Playwright UI mode            | `npm run test:ui`                       |
| Run one scenario              | `npx playwright test -g TC001`          |
| Open the last HTML report     | `npm run report`                        |

The `setup` project runs first. It signs in and writes the session to `playwright/.auth/user.json` (gitignored).

## Test data

[testdata/purchaseTicketScenario.json](testdata/purchaseTicketScenario.json) contains test data as a JSON array. Each entry has a `testCaseId`, a `description` and every value the flow needs.

I noticed that datetime drop down of this contain two entries for `Mon 30 Apr 2029 12:03PM`. Hence added
`performance.occurrence` to pick between options that share the same text. The date `Mon 30 Apr 2029 12:03PM` is listed twice, so `0` is the first and `1` is the second.

## Project layout

```
src/UI/
  Fixtures/pages.fixture.ts   Page objects exposed as Playwright fixtures
  Models/                     Types for test data
  Pages/                      Page objects (all extend BasePage)
  Utils/                      config (env), logger, shared paths
testdata/                     JSON test data
tests/
  auth.setup.ts               Signs in once and saves the session
  ticketTek.spec.ts           Data-driven purchase flow
```

## Architecture

### Page Objects and Tests

- Every page extends `BasePage`, which holds the shared `page`, a class-named logger and `goto(url)`. You can also have composition based pageobjects instead of inheritance based. Decided to go with inheritance because assessment criteria ask for that.
- Page objects own locators and actions. Tests(*.spec.ts) own the flow and the assertions.
- Page objects are provided through fixtures, so all POMs needed for tests like `summaryPage` or `checkoutPage` are injected rather than constructing them. Having them injected helps with lifecycle management in future
- The spec is split into `test.step` blocks (open event, configure tickets, review summary, pay, verify), so the HTML report shows where a run stopped.

### Authentication and state

Signing in through the UI for every test is slow and repeats work that is not under test. A `setup` project signs in once and saves the browser state with `storageState`. The `chromium` project depends on `setup` and loads that file, so every test starts already signed in.

This sample test contain two scenarios . Hence it logs in first as part of setup project and then run the two test as authenticated user.

### Locator strategy

- Prefer user-facing locators: `getByRole`, then `getByText`, `getByTitle`, `getByLabel`. These follow what users see and survive markup changes.
- Waits use Playwright's auto-waiting plus explicit `waitFor` on the element that proves the page is ready. There is no `waitForTimeout`. 

### Configuration and logging

- `src/UI/Utils/config.ts` is the only place that reads environment variables. It validates them on use and throws a clear error.
- A small `Logger` writes timestamped, level-tagged lines (`INFO`, `WARN`, `ERROR`, and `DEBUG` when `LOG_LEVEL=debug`). 
