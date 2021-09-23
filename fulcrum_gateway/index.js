/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {expo as expo} from './app.json';

console.log(expo.name)
AppRegistry.registerComponent(expo.name, () => App);
