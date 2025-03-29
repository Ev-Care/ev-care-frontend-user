module.exports = {
    dependencies: {
      'react-native-vector-icons': {
        platforms: {
          android: null, // This prevents auto-linking for Android
        },
      },
    },
    assets: ["./node_modules/react-native-vector-icons/Fonts"],
  };
  