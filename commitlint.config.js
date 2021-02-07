/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */

module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'subject-case': [2, 'always', 'sentence-case'],
  },
};
