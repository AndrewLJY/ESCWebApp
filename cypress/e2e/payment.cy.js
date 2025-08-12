// TC7 Make Payment
describe("Make Payment", () => {
  beforeEach(() => {
    cy.visit(
      "http://localhost:5173/hotel/RcLc?location=Singapore%2C+Singapore&hotel=&checkin=2025-08-20&checkout=2025-08-30&guests=1&roomNum=1"
    );
  });

  it("Pre-condition: User is logged in", () => {
    cy.url().should("include", "/checkout");

  });

});
