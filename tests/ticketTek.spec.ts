import { test, expect } from '../src/UI/Fixtures/pages.fixture';

test('Purchase tickets', async ({ homePage, eventDetailsPage, summaryPage, checkoutPage, confirmationPage }) => {
  await homePage.goto();
  await homePage.closeCookiePopup();

  // Step 1: Search from Home/Landing Page
  await homePage.selectPriceByTextAndFindTickets('Mon 30 Apr 2029 12:03PM', 1);

  // Step 2: Configure tickets on Event Details page
  await eventDetailsPage.selectTicketByPrice('$0.00†');
  
  // Update ticket count for "Admit" tickets by clicking '+' once
  await eventDetailsPage.adjustTicketQuantity('Admit', 'increase', 1);
  
  await eventDetailsPage.selectDeliveryMethod('Mobile Ticket No Additional');
  await eventDetailsPage.proceedToNext();

   // Step 3: Order Summary Validation & Checkout
  await summaryPage.validateTicketDetails({
    section: 'General Admission',
    ticketType: 'Admit',
    amount: '$0.00',
    totalAmount: '$0.00'
  });
  
  await summaryPage.goToCheckout();

  // Step 4: Checkout Delivery Form & Terms Submission
  await checkoutPage.fillContactAndAddressDetails({
    mobile: '0410111111',
    addressLine1: '255 george st25',
    addressLine2: '23',
    suburb: 'Sydney',
    postcode: '2001'
  });
  await checkoutPage.acceptTermsAndConditions();
  await checkoutPage.confirmPurchase();


  // 5. Confirmation Verification
  const text = await confirmationPage.getConfirmationMessage();
  expect(text).toContain('Order Confirmed');

  //await confirmationPage.clickCustomerId();
  //wait confirmationPage.closeWelcomeModal();
});