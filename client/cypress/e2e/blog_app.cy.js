describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, { username: 'root', password: 'password', name: 'root' });
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, { username: 'testuser', password: 'password', name: 'testuser' });
    cy.visit('');
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application');
    cy.get('#username');
    cy.get('#password');
    cy.get('#login-button');
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('root');
      cy.get('#password').type('password');
      cy.get('#login-button').click();
      cy.contains('Logged in as root');
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('root');
      cy.get('#password').type('pass');
      cy.get('#login-button').click();
      cy.get('.error')
        .contains('Wrong credentials')
        .should('have.css', 'border-style', 'solid')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: 'root', password: 'password' });
        cy.createBlog({ title: 'beforeEach title test', author: 'beforeEach author test', url: 'beforeEach url test', likes: 7 });
        cy.createBlog({ title: 'beforeEach title test2', author: 'beforeEach author test2', url: 'beforeEach url test2', likes: 10 });
        cy.createBlog({ title: 'beforeEach title test3', author: 'beforeEach author test3', url: 'beforeEach url test3', likes: 2 });
      })

      it('A blog can be created', function() {
        cy.contains('Add new blog').click();
        cy.get('#blog-title').type('new test blog');
        cy.get('#blog-author').type('test author');
        cy.get('#blog-url').type('test url');
        cy.get('#blog-submit-btn').click();

        cy.contains('new test blog test author');
      })

      it('user can like a blog', function() {
        let container = cy.contains('beforeEach title test').parent();
        container.contains('View').click();
        container = cy.contains('beforeEach title test').parent();
        container.contains('like').click();
        container.contains('like').prev().contains('1');
      })

      it('user who created blog can delete it', function() {
        let container = cy.contains('beforeEach title test').parent();
        container.contains('Delete').click();
        cy.contains('beforeEach title test beforeEach author test').should('not.exist');
      })

      it('another user cannot delete another\'s blog', function() {
        cy.login({ username: 'testuser', password: 'password' });
        let container = cy.contains('beforeEach title test').parent();
        container.contains('Delete').should('not.exist');
      })

      it.only('blogs are sorted by likes in descending order', function() {
        cy.get('.blog').eq(0).contains('View').click();
        cy.get('.blog').eq(0).contains('10');
        cy.get('.blog').eq(1).contains('View').click();
        cy.get('.blog').eq(1).contains('7');
        cy.get('.blog').eq(2).contains('View').click();
        cy.get('.blog').eq(2).contains('2');
      })
    })
  })
})