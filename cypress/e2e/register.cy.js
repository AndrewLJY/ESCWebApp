//TC2 Register
describe('Register Account', () => {
  beforeEach(()=>{
    cy.visit('http://localhost:5173/');
  })

  it('Landing Page loads', () => {
    cy.title().should('eq', 'Ascenda');
    cy.contains('Start your dream vacation with us').should('be.visible');
  })

  it('Pre-condition: User is not logged in', ()=>{
    cy.get(".btn").contains("Login").should("exist");
  })

  //Add a check for no Account

  it('Flow: Register', () =>{
    cy.get(".btn").contains("Login").click();
    cy.contains('Don’t have an account?').should('be.visible');
    cy.get(".btn.signup").click();

    //Sign up Popup
    cy.get('h2').contains('Create Account').should('exist');
    cy.get('#signup-email').type('fake123@email.com');
    cy.get('#signup-password').type('1234');
    cy.get('#signup-confirm-password').type('1234');
    cy.get(".btn.submit").click();

    cy.contains("Sign Up Successful!", {timeout: 2000}).should('be.visible');
  })
})