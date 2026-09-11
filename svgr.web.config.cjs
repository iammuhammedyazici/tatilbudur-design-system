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
      // Tüm kaynak SVG'ler aynı id="a" gibi clipPath id'lerini kullanıyor.
      // Galeri gibi birden fazla icon'un aynı DOM'da render edildiği yerlerde
      // bu id'ler çakışıyor ve tarayıcı yanlış clipPath'i uygulayarak
      // icon'ların kırpılmış/bozuk görünmesine sebep oluyordu.
      {
        name: "prefixIds",
        params: {
          prefixIds: true,
          prefixClassNames: false,
        },
      },
    ],
  },
};
