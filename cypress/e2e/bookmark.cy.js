// TC8 Bookmark Hotel
describe("Bookmark Hotel", () => {
  beforeEach(() => {
    cy.visit(
      "http://localhost:5173/search?location=Singapore%2C+Singapore&hotel=Marriot&checkin=2025-08-21&checkout=2025-08-30&guests=1&roomNum=1"
    );
    cy.get(".hotel-card").eq(0).find('.book-small').click();
        cy.get(".btn").contains("Login").click();
    cy.get("h2").contains("Sign In").should("exist");
    cy.get("#login-email").type("fake@email.com");
    cy.get("#login-password").type("1234");
    cy.get(".btn.submit").click();

    cy.contains("Login Successful!", { timeout: 2000 }).should("be.visible");
    cy.getAllLocalStorage().then((localStorage) => {
      expect(localStorage["http://localhost:5173"]).to.have.property("user");
      const userData = JSON.parse(localStorage["http://localhost:5173"].user);
      expect(userData.email).to.equal("fake@email.com");
    });
  });

  it("Pre-condition: User is logged in", () => {
    cy.contains('Logout').should('exist');
  });

  it("Flow: Bookmark Hotel", ()=>{
    cy.get('.btn.bookmark').click();
    cy.contains("Hotel Bookmarked!", { timeout: 2000 }).should("be.visible");
    cy.get('.btn.book').click();
    
    cy.contains('Courtyard by Marriott Singapore Novena').should('exist');
  })
});
