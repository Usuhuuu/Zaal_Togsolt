module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          reactCompiler: {
            sources: (filename) => {
              return filename.includes('./app/_layout.tsx');
            },
          },
        },
      ],
    ],
    plugins: ['react-native-reanimated/plugin'],
  };
};