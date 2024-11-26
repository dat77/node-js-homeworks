module.exports = function (config) {
  config.set({
    frameworks: ["jasmine"],
    files: ["tests/**/*.spec.js"],
    preprocessors: {
      "tests/**/*.spec.js": ["webpack"],
    },
    webpack: {
      mode: "development",
    },
    reporters: ["spec"],
    browsers: ["ChromeHeadless"],
    singleRun: true,
  });
};
