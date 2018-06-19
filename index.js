const path = require("path")

module.exports = function nuxtApicase(_moduleOptions) {
  // Combine options
  const moduleOptions = Object.assign({}, this.options.apicase, _moduleOptions)

  // Register plugin
  this.addPlugin({
    src: path.resolve(__dirname, "plugin.template.js"),
    fileName: "apicase.js",
    options: {
      src: moduleOptions.src,
      mode: moduleOptions.mode || "tree"
    }
  })
}
