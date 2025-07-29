describe('Search Page', () => {
  it('visit_landing_page', () => {
    cy.visit('http://localhost:5173/');
    cy.get(".landing__logo").should("contain", "Ascenda");
  })
})