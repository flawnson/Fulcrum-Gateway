import React from 'react';
import { INativebaseConfig, NativeBaseProvider, Box } from 'native-base';
import IDValidator from './src/components/IDValidator'
import { registerRootComponent } from 'expo';

const config: object = {
    strictMode: 'error',
};

function App() {
  return (
      <NativeBaseProvider config={config}>
          <IDValidator />
      </NativeBaseProvider>
  );
}

registerRootComponent(App)
export default App
