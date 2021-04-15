module.exports = {
  plugins: [
    [
      "module-resolver",
      {
        "alias": {
          "~": "./src"
        }
      }
    ]
  ],
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ]
  ]
}
