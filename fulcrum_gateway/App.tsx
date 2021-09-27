import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { registerRootComponent } from 'expo';
import { NativeRouter, Route, Link } from 'react-router-native';
import IDValidator from './src/components/IDValidator'


const config: object = {
    strictMode: 'error',
};

function App() {
  return (
      <NativeRouter>
          <NativeBaseProvider config={config}>
              <IDValidator />
          </NativeBaseProvider>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/topics" component={Topics} />
      </NativeRouter>
  );
}

registerRootComponent(App)
export default App
