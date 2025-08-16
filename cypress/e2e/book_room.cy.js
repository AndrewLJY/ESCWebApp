// TC6 Book a Room
describe("Book a Room", () => {
  beforeEach(() => {
    cy.visit(
      "http://localhost:5173/search?location=Singapore%2C+Singapore&hotel=Marriot&checkin=2025-08-21&checkout=2025-08-30&guests=1&roomNum=1"
    );
    cy.get(".hotel-card", { timeout: 10000 }).eq(0).find(".book-small").click();
  });

  it("Pre-condition: User is viewing Room Search results", () => {
    cy.url().should("include", "/hotel");
    cy.get("h1", { timeout: 30000 }).should(
      "contain",
      "Courtyard by Marriott Singapore Novena"
    );
    cy.get(".room-card", { timeout: 10000 }).should("exist");
  });

  it("Flow: Choose a room", () => {
    cy.get(".room-card", { timeout: 20000 }).eq(0).find(".book-room").click();
    cy.contains("Please login to book a room...", { timeout: 2000 }).should(
      "be.visible"
    );

    cy.get(".btn").contains("Login").click();

    //Login Popup
    cy.get("h2").contains("Sign In").should("exist");
    cy.get("#login-email").type("fake@email.com");
    cy.get("#login-password").type("1234");
    cy.get(".btn.submit").click();

    cy.get(".room-card", { timeout: 20000 }).eq(0).find(".book-room").click();
    cy.url().should("include", "/checkout");
  });
});
