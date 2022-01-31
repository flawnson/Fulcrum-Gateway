/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {expo as expo} from './app.json';
import './i18n';

AppRegistry.registerComponent(expo.name, () => App);
