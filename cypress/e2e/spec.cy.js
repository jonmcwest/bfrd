describe('Star Wars Top Trumps', () => {
  beforeEach(() => {
    cy.viewport(744, 1133);
    cy.visit('http://localhost:5174/');
  });

  it('displays the main game layout', () => {
    // Check title section
    cy.get('.logo').should('be.visible');
    cy.get('.title').should('contain.text', 'TOP TRUMPS');

    // Check game areas
    cy.get('.opponent-container').should('exist');
    cy.get('.player-container').should('exist');
    cy.get('.player-message').should('contain.text', 'SELECT A CARD TO PLAY');
  });

  it('displays the opponent card', () => {
    cy.get('.opponent-card').should('exist');
    cy.get('.question-mark').should('be.visible');
    cy.get('.message').should('contain.text', 'Opponent has selected a card');
  });

  it('displays player cards with correct structure', () => {
    // Wait for cards to be visible
    cy.get('.card.player-card').should('be.visible');

    // Check card structure
    cy.get('.card__select-indicator').should('contain.text', 'SELECT');
    cy.get('.card__title').should('exist');
    cy.get('.card__stats').should('exist');

    // Check stats structure
    cy.get('.card__stat').should('have.length.at.least', 5);
    cy.get('.card__stat').first().within(() => {
      cy.get('.card__stat__label').should('exist');
      cy.get('.card__stat__value').should('exist');
    });

    // Check image
    cy.get('.card__image').should('be.visible')
      .and('have.attr', 'alt');
  });

  it('can use right arrow key to navigate the listing', () => {
    cy.get('.card.player-card').should('be.visible');
    cy.get('body').type('{rightArrow}');
  });
});
