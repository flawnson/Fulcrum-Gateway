import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { registerRootComponent } from 'expo';
import { NativeRouter, Route, Link } from 'react-router-native';
import IDValidator from './src/components/molecules/IDValidator'


const config: object = {
    strictMode: 'error',
};

function App() {
  return (
      <NativeBaseProvider config={config}>
          <NativeRouter>
              <IDValidator />
          </NativeRouter>
      </NativeBaseProvider>
  );
}

registerRootComponent(App)
export default App
