import fs from 'fs';
import path from 'path';
import { test, expect } from '../src/UI/Fixtures/pages.fixture';
import { PurchaseTicketScenario } from '../src/UI/Models/purchaseTicketScenario';

const scenarios: PurchaseTicketScenario[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../testdata/purchaseTicketScenario.json'), 'utf-8')
);

//const testData = scenarios.filter((scenario) => scenario.testCaseId === 'TC002');

for (const data of scenarios) {
  test(`${data.testCaseId}: ${data.description}`, async ({
    homePage,
    eventDetailsPage,
    summaryPage,
    checkoutPage,
    confirmationPage,
  }) => {
    await homePage.goto(data.eventId);
    await homePage.closeCookiePopup();

    // Step 1: Search from Home/Landing Page
    await homePage.selectPriceByTextAndFindTickets(data.performance.text, data.performance.occurrence);

    // Step 2: Configure tickets on Event Details page
    await eventDetailsPage.selectTicketByPrice(data.priceText);
    await eventDetailsPage.adjustTicketQuantity(data.ticket.type, data.ticket.action, data.ticket.clicks);
    await eventDetailsPage.selectDeliveryMethod(data.deliveryMethod);
    await eventDetailsPage.proceedToNext();

    // Step 3: Order Summary Validation & Checkout
    await summaryPage.validateTicketDetails(data.summary);
    await summaryPage.goToCheckout();

    // Step 4: Checkout Delivery Form & Terms Submission
    await checkoutPage.fillContactAndAddressDetails(data.checkout);
    await checkoutPage.acceptTermsAndConditions();
    await checkoutPage.confirmPurchase();

    // 5. Confirmation Verification
    const text = await confirmationPage.getConfirmationMessage();
    expect(text).toContain(data.expectedConfirmation);
  });
}
