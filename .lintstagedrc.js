export default {
  '*.{js,jsx,ts,tsx}': ['pnpm lint:fix', 'pnpm format:fix'],
  '*.{json,md,scss,css,html,yml}': ['pnpm format:fix'],
}
