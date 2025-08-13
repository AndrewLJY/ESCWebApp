// TC7 Make Payment
describe("Make Payment", () => {
  beforeEach(() => {
    cy.visit(
      "http://localhost:5173/search?location=Singapore%2C+Singapore&hotel=Marriot&checkin=2025-08-21&checkout=2025-08-30&guests=1&roomNum=1"
    );
    cy.get(".hotel-card", {timeout: 30000}).eq(0).find(".book-small").click();
    cy.get(".btn", {timeout: 5000}).contains("Login").click();
    cy.get("h2").contains("Sign In").should("exist");
    cy.get("#login-email").type("fake@email.com");
    cy.get("#login-password").type("1234");
    cy.get(".btn.submit").click();

    cy.contains("Login Successful!", { timeout: 2000 }).should("be.visible");
    cy.get(".room-card", {timeout:20000}).eq(0).find('.book-room').click()
  });

  it("Pre-condition: User is logged in", () => {
    cy.getAllLocalStorage().then((localStorage) => {
      expect(localStorage["http://localhost:5173"]).to.have.property("user");
      const userData = JSON.parse(localStorage["http://localhost:5173"].user);
      expect(userData.email).to.equal("fake@email.com");
    });
  });

  it("Flow: Go Through Payment", ()=>{
    cy.wait(5000);
    cy.getByTestId('card-accordion-item').should('be.visible').click()
    cy.getStripeElement('email').type('fake@email.com');
    cy.getStripeElement('phoneNumber').type('99999999');
    cy.getStripeElement('cstm_fld_').type('Balcony Room on the Third Floor')
    cy.getStripeElement('cardNumber').type('4242424242424242')
    cy.getStripeElement('cardExpiry').type('03-26')
    cy.getStripeElement('cardCvc').type('456')
    cy.getStripeElement('billingName').type('meep')
    cy.getStripeElement('billingAddressLine1').type('Singapore{enter}')
    cy.getStripeElement('billingPostalCode').type('542768{enter}')

    cy.get("button", {timeout: 15000}).contains('Back to Home Page').click()
    //Goes back to Ascenda Page
    cy.title().should('eq', 'Ascenda');
    cy.contains('Start your dream vacation with us').should('be.visible');
  })

});
