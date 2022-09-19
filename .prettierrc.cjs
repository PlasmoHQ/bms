/**
 * @type {import('prettier').Options}
 */
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: false,
  trailingComma: "none",
  bracketSpacing: true,
  bracketSameLine: true,
  importOrder: ["^~(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  plugins: [require.resolve("@plasmohq/prettier-plugin-sort-imports")]
}
