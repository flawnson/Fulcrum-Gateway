import React from 'react';
import { INativebaseConfig, NativeBaseProvider, Box } from 'native-base';
import IDValidator from './src/components/IDValidator'

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

export default App
