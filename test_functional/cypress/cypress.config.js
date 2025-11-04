const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    // caminho absoluto a partir da raiz do repo
    supportFile: 'test_functional/cypress/support/e2e.js',
    specPattern: [
      'test_functional/cypress/e2e/**/*.cy.js',
      'test_accessibility/**/*.cy.js'
    ],
    video: true,
    screenshotsFolder: 'artifacts/screenshots',
    videosFolder: 'artifacts/videos'
  }
});