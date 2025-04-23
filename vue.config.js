module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "/giornata-sostenitore/" : "/",
  devServer: {
    proxy: "https://192.168.10.208",
  },
};
