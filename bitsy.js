import { AppRegistry } from 'react-native';
import Bitsy from './src/Bitsy';
import { bitsyAppName } from './app.json';

/**
 * We need to register the root component of the app with the AppRegistry.
 * Just like in the default React Native setup.
 */
AppRegistry.registerComponent(bitsyAppName, () => Bitsy);
