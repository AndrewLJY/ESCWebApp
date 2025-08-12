// TC6 Book a Room
describe("Book a Room", () => {
  beforeEach(() => {
    cy.visit(
      "http://localhost:5173/search?location=Singapore%2C+Singapore&hotel=Marriot&checkin=2025-08-21&checkout=2025-08-30&guests=1&roomNum=1"
    );
    cy.get(".hotel-card").eq(0).find('.book-small').click();
  });

  it("Pre-condition: User is viewing Room Search results", () => {
    cy.url().should("include", "/hotel");
    cy.get("h1", { timeout: 30000 }).should(
      "contain",
      "Courtyard by Marriott Singapore Novena"
    );
    cy.get(".room-card", { timeout: 10000 }).should("exist");
  });

  it("Flow: Choose a room", ()=>{
    cy.get(".room-card", {timeout:20000}).eq(0).find('.book-room').click()
    cy.url().should("include", "/checkout");
  })
});
