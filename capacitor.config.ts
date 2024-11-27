import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.restaurant.app',
  appName: 'Restaurant App',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    // Enable for development
    url: 'http://10.0.2.2:3000',
    cleartext: true
  },
  android: {
    // These go in android/app/build.gradle instead of here
    // buildOptions: {
    //   minSdkVersion: 21,
    //   targetSdkVersion: 33,
    // }
  },
  plugins: {
    // Add any plugin configurations here
  }
};

export default config;