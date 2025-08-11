//TC2 Register
// describe('Register Account', () => {
//   beforeEach(()=>{
//     cy.visit('http://localhost:5173/');
//   })

//   it('Landing Page loads', () => {
//     cy.title().should('eq', 'Ascenda');
//     cy.contains('Start your dream vacation with us').should('be.visible');
//   })

//   it('Pre-condition: User is not logged in', ()=>{
//     cy.get(".btn").contains("Login").should("exist");
//   })

//   //Add a check for no Account

//   it('Flow: Register', () =>{
//     cy.get(".btn").contains("Login").click();
//     cy.contains('Don’t have an account?').should('be.visible');
//     cy.get(".btn.signup").click();

//     //Sign up Popup
//     cy.get('h2').contains('Create Account').should('exist');
//     cy.get('#signup-email').type('fake123@email.com');
//     cy.get('#signup-password').type('1234');
//     cy.get('#signup-confirm-password').type('1234');
//     cy.get(".btn.submit").click();

//     cy.contains("Sign Up Successful!", {timeout: 2000}).should('be.visible');
//   })
// })

//TC1 Login
describe('Login', () => {
  beforeEach(()=>{
    cy.visit('http://localhost:5173/');
  })

  it('Pre-condition: User is not logged in', ()=>{
    cy.get(".btn").contains("Login").should("exist");
  })

  it('Flow: Login', ()=>{
    cy.get(".btn").contains("Login").click();

    //Login Popup
    cy.get('h2').contains('Sign In').should('exist');
    cy.get('#login-email').type('fake@email.com');
    cy.get('#login-password').type('1234');
    cy.get(".btn.submit").click();

    cy.contains("Login Successful!", {timeout: 2000}).should('be.visible');
    cy.getAllLocalStorage().then((localStorage)=>{
      expect(localStorage['http://localhost:5173']).to.have.property('user');
      const userData = JSON.parse(localStorage['http://localhost:5173'].user);
      expect(userData.email).to.equal('fake@email.com')
    })
  })
})

//TC3 Search Destination
describe('Search Destination', ()=>{
  beforeEach(()=>{
    cy.visit('http://localhost:5173/');
  })

  it(('Flow: Fill Desired Destination'), ()=>{
    cy.get(".filter-btn").find('span').contains('Location').click();
    cy.get('input').type('Sing');
    cy.get(".filter-btn").find('span',{timeout:2000}).contains('Sing').click();

    cy.contains("Singapore, Singapore", {timeout: 3000}).should('be.visible');
    cy.contains('Singapore, Singapore').click();
    cy.get('input').should('have.value', 'Singapore, Singapore')

    cy.get(".filter-btn").find('span').contains('Checkin').click();
    cy.get('input[type="date"]').type('2025-08-20');
    cy.get(".filter-btn").find('span').contains('2025-08-21').click();
    cy.get('input[type="date"]').type('2025-08-30');
    cy.get(".filter-btn").find('span').contains('Guests').click();
    cy.get('input').type('1');
    cy.get(".filter-btn").find('span').contains('Rooms').click();
    cy.get('input').type('1');

    cy.get('.filter-search-btn').click();
    cy.url().should('include', '/search?');
  })
})

// TC4 Search hotel
describe('Search Hotel', ()=>{
  beforeEach(()=>{
    cy.visit('http://localhost:5173/search?location=Singapore%2C+Singapore&hotel=&checkin=2025-08-20&checkout=2025-08-30&guests=1&roomNum=1');
  })

  it('Pre-condition: User is on search hotel page', ()=>{
    cy.url().should('include', '/search?');
  })

  it('Flow: Search Hotel', ()=>{
    cy.get('input[placeholder="Hotel Name"]').type('Marriot')
    cy.get('p').should('include', 'Marriot');
  })
})

// TC5 Filter Search
describe('Filter Search', ()=>{
  
})

// TC6 Book a Room

// TC7 Make Payment

// TC8 Bookmark a room