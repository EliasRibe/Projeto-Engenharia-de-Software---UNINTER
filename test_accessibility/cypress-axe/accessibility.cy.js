// test_accessibility/cypress-axe/accessibility.cy.js
// CT-A11Y-01 — Acessibilidade WCAG 2.1 AA

import 'cypress-axe';

describe('Acessibilidade - SGHSS', () => {
  beforeEach(() => {
    // baseUrl vem do cypress.config.js (http://localhost:3000)
    cy.visit('/');
    // usa o helper robusto que injeta o axe via caminho absoluto
    cy.injectAxeSafe();
    // configurar axe pra focar em impactos critical/serious
    cy.configureAxe?.({
      resultTypes: ['violations'],
      includedImpacts: ['critical', 'serious'],
    });
  });

  it('Tela de Login - sem violações critical/serious', () => {
    cy.contains('h1', 'Login').should('be.visible'); // sanity check
    cy.checkA11y('body', {
      includedImpacts: ['critical', 'serious'],
    });
  });

  it('Tela de Agendamento - sem violações critical/serious', () => {
    cy.visit('/appointments');
    cy.injectAxeSafe();
    cy.contains('h1', 'Agendamento').should('be.visible');
    cy.checkA11y('body', {
      includedImpacts: ['critical', 'serious'],
    });
  });

  it('Tela de Prontuário - sem violações critical/serious', () => {
    cy.visit('/records');
    cy.injectAxeSafe();
    cy.contains('h1', 'Prontuário').should('be.visible');
    cy.checkA11y('body', {
      includedImpacts: ['critical', 'serious'],
    });
  });
});
