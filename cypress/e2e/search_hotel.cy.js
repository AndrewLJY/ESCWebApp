
// TC4 Search hotel
describe("Search Hotel", () => {
  beforeEach(() => {
    cy.visit(
      "http://localhost:5173/search?location=Singapore%2C+Singapore&hotel=&checkin=2025-08-20&checkout=2025-08-30&guests=1&roomNum=1"
    );
  });

  it("Pre-condition: User is on search hotel page", () => {
    cy.url().should("include", "/search?");
  });

  it("Flow: Search Hotel", () => {
    cy.get('input[placeholder="Hotel Name"]').type("Marriot");
    cy.get("button").contains("Search").click();
    cy.get("p", { timeout: 20000 }).should("contain", "Marriot");
    cy.get(".hotel-results").should("exist");
  });
});
