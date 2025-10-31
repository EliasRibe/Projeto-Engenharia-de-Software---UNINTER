const { defineConfig } = require('cypress');
module.exports = defineConfig({
e2e: {
supportFile: false,
video: true,
defaultCommandTimeout: 8000
}
});