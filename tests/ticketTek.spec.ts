import { test, expect } from '../src/UI/Fixtures/pages.fixture';
import { PurchaseTicketScenario } from '../src/UI/Models/purchaseTicketScenario';
import scenarioData from '../testdata/purchaseTicketScenario.json';

const scenarios = scenarioData as PurchaseTicketScenario[];

for (const data of scenarios) {
  test(`${data.testCaseId}: ${data.description}`, async ({
    homePage,
    eventDetailsPage,
    summaryPage,
    checkoutPage,
    confirmationPage,
  }) => {
    await test.step('Open the event page and choose a performance', async () => {
      await homePage.openEvent(data.eventId);
      await homePage.selectPriceByTextAndFindTickets(data.performance.text, data.performance.occurrence);
    });

    await test.step('Configure tickets and delivery', async () => {
      await eventDetailsPage.selectTicketByPrice(data.priceText);
      await eventDetailsPage.adjustTicketQuantity(data.ticket.type, data.ticket.action, data.ticket.clicks);
      await eventDetailsPage.selectDeliveryMethod(data.deliveryMethod);
      await eventDetailsPage.proceedToNext();
    });

    await test.step('Review the order summary and go to checkout', async () => {
        await summaryPage.goToCheckout();
    });

    await test.step('Complete checkout details and pay', async () => {
      await checkoutPage.fillContactAndAddressDetails(data.checkout);
      await checkoutPage.acceptTermsAndConditions();
      await checkoutPage.expandPaymentOptions();
      await checkoutPage.submitPayment();
    });

    await test.step('Verify the order confirmation', async () => {
      await confirmationPage.waitForPageLoaded();
      await expect(
        confirmationPage.confirmationHeading,
        'Order confirmation heading should be displayed after payment'
      ).toContainText(data.expectedConfirmation);
    });
  });
}
