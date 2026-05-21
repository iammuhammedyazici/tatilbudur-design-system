module.exports = {
  native: true,
  typescript: true,
  svgo: true,
  svgoConfig: {
    plugins: [
      "preset-default",
      {
        name: "inlineStyles",
        params: {
          onlyMatchedOnce: false,
        },
      },
      "removeXlink",
      "convertStyleToAttrs",
      {
        name: "removeAttrs",
        params: {
          attrs: [
            "xmlns",
            "xmlns:xlink",
            "xmlnsXlink",
            "data-name",
            "shape-rendering",
            "style",
            "filter",
            "class",
            "className",
          ],
        },
      },
    ],
  },
};