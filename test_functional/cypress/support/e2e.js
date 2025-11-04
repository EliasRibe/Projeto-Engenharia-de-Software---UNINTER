// test_functional/cypress/support/e2e.js
import 'cypress-axe';
const path = require('path');

Cypress.Commands.add('injectAxeSafe', () => {
  const axePath = path.join(
    Cypress.config('projectRoot'),
    'node_modules',
    'axe-core',
    'axe.min.js'
  );
  cy.readFile(axePath, { log: false }).then((source) => {
    cy.window({ log: false }).then((win) => {
      win.eval(source);
    });
  });
});
