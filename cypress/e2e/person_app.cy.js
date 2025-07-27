describe('Persons app', function () {
  beforeEach(function() {
    cy.visit('')
  })

  it('front page can be opened', function () {
    cy.contains('Phonebook')
    cy.contains('Filter shown with')
    cy.contains('Add a new')
    cy.contains('Numbers')
  })

  it('person gets added successfully', function () {
    cy.get('input#person-name').type('test cypress person')
    cy.get('input#person-number').type('213-12321412412')
    cy.get('button#submit-person').click()

    cy.contains('test cypress person / 213-12321412412')
  })

  it('person gets filtered properly', function() {
    cy.get('input#filter-field').type('test cypress person')
    cy.get('.person-wrapper')
      .should('have.length', 1)
      .first().should('contain', 'test cypress person')
  })

  it('adding person fails when inputs are empty', function() {    
    cy.get('button#submit-person').click()

    cy.get('.error')
      .should('contain', 'Error while adding new person')
      .should('have.css', 'color', 'rgb(255, 0, 0)')
      .should('have.css', 'background-color', 'rgb(211, 211, 211)')
  })

  it('adding person fails when number length is less than 8', function() {    
    cy.get('input#person-name').type('another person')
    cy.get('input#person-number').type('213')
    cy.get('button#submit-person').click()

    cy.get('.error')
      .should('contain', 'Error while adding new person')
      .should('have.css', 'color', 'rgb(255, 0, 0)')
      .should('have.css', 'background-color', 'rgb(211, 211, 211)')
  })

  it('person can be deleted', async function() {
    const container = cy.contains('test cypress person / 213-12321412412').parent()
    container.contains('Delete').click();
    cy.contains('test cypress person / 213-12321412412').should('not.exist')
    cy.get('div.success').contains('Deleted test cypress person')
      .should('have.css', 'color', 'rgb(0, 128, 0)')
      .should('have.css', 'background-color', 'rgb(211, 211, 211)')
  })
})