module.exports = {
  native: true,
  typescript: true,
  svgo: true,
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          // viewBox'ı asla silme: width/height, viewBox ile aynı olan
          // logo/kart ikonları (amex, visa vb.) viewBox silinince küçük
          // boyutlarda ölçeklenemeyip sadece sol üst köşesi görünüyordu.
          overrides: {
            removeViewBox: false,
          },
        },
      },
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