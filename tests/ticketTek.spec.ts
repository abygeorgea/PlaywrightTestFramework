import { test, expect } from '@playwright/test';
import { HomePage } from '../src/UI/Pages/HomePage.ts';
import { EventDetailsPage } from '../src/UI/Pages/eventDetailsPage.ts';
import { SummaryPage } from '../src/UI/Pages/summaryPage.ts';
import { CheckoutPage } from '../src/UI/Pages/checkoutPage.ts';
import { ConfirmationPage } from '../src/UI/Pages/confirmationPage.ts';
import { LoginPage } from '../src/UI/Pages/loginPage.ts';

test('Login and purchase tickets', async ({ page }) => {
  const homePage = new HomePage(page);
  const eventDetailsPage = new EventDetailsPage(page);
  const summaryPage = new SummaryPage(page);
  const checkoutPage = new CheckoutPage(page);
  const confirmationPage = new ConfirmationPage(page);
  const loginPage = new LoginPage(page);
      

   // 0. Authentication

  // Retrieve credentials securely from process.env
  const email = process.env.emailAddress!;
  const password = process.env.password!;
  await homePage.goto();
  await homePage.closeCookiePopup();
  await loginPage.openSignInModal();
  await loginPage.login(email, password);

  // Step 1: Search from Home/Landing Page
  await homePage.goto();
  await homePage.selectPriceAndFindTickets('EMIS2029726AG');

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
  await checkoutPage.expandPaymentOptions();


  // 5. Confirmation Verification
  const text = await confirmationPage.getConfirmationMessage();
  expect(text).toContain('Order Confirmed');

  //await confirmationPage.clickCustomerId();
  //wait confirmationPage.closeWelcomeModal();
});