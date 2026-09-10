module.exports = {
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
    ],
  },
};
