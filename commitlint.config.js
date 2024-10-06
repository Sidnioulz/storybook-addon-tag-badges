export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [2, 'always', ['sentence-case']],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'refactor', 'style', 'test', 'revert', 'chore'],
    ],
  },
}
