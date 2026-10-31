export interface PurchaseTicketScenario {
  testCaseId: string;
  eventId: string;
  description: string;
  performance: { text: string; occurrence: number };
  priceText: string;
  ticket: { type: string; action: 'increase' | 'decrease'; clicks: number };
  deliveryMethod: string;
  summary: { section: string; ticketType: string; amount: string; totalAmount: string };
  checkout: {
    mobile: string;
    addressLine1: string;
    addressLine2?: string;
    suburb: string;
    postcode: string;
  };
  expectedConfirmation: string;
}
