//TC1 Login
describe("Login", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("Pre-condition: User is not logged in", () => {
    cy.get(".btn").contains("Login").should("exist");
  });

  it("Flow: Login", () => {
    cy.get(".btn").contains("Login").click();

    //Login Popup
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
});