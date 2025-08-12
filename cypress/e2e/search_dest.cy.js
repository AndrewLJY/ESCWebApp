//TC3 Search Destination
describe("Search Destination", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("Flow: Fill Desired Destination", () => {
    cy.get(".filter-btn").find("span").contains("Location").click();
    cy.get("input").type("Sing");
    // cy.get(".filter-btn")
    //   .find("span", { timeout: 2000 })
    //   .contains("Sing")
    //   .click();

    cy.contains("Singapore, Singapore", { timeout: 3000 }).should("be.visible");
    cy.contains("Singapore, Singapore").click();
    cy.get("input").should("have.value", "Singapore, Singapore");

    cy.get(".filter-btn").find("span").contains("Checkin").click();
    cy.get('input[type="date"]').type("2025-08-20");
    cy.get(".filter-btn").find("span").contains("8/21/2025").click();
    cy.get('input[type="date"]').type("2025-08-30");
    cy.get(".filter-btn").find("span").contains("Guests").click();
    cy.get("input").type("1");
    cy.get(".filter-btn").find("span").contains("Rooms").click();
    cy.get("input").type("1");

    cy.get(".filter-search-btn").click();
    cy.url().should("include", "/search?");
  });
});
