// // babel.config.cjs
// module.exports = {
//   presets: ["@babel/preset-env", "@babel/preset-react"],
// };

module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: [
    // allows parsing of `import.meta`
    ["babel-plugin-transform-import-meta"],
    // replaces import.meta.env.VITE_* with string values at test time
    [
      "babel-plugin-transform-vite-meta-env",
      {
        env: {
          VITE_GOOGLE_MAPS_API_KEY: "test-key",
        },
      },
    ],
  ],
};
