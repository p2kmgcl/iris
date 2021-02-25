const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

module.exports = function getEnv() {
  const path = join(__dirname, '..', '.env.json');

  if (existsSync(path)) {
    const devEnv = JSON.parse(readFileSync(path, 'utf-8'));

    return {
      ...process.env,
      ...devEnv,
    };
  }

  return process.env;
};
