const nextJest = require('next/jest');
const createJestConfig = nextJest({
    dir: '.'
});
const jestConfig = createJestConfig({
    moduleDirectories: ['node_modules', '<rootDir>'],
    testTimeout: 60_000
});

module.exports = jestConfig;