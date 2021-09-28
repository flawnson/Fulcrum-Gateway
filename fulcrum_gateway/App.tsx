import React from 'react';
import { StyleSheet, Text, View, AppRegistry } from "react-native";
import { NativeBaseProvider } from 'native-base';
import { registerRootComponent } from 'expo';
import { NativeRouter, Route, Link } from 'react-router-native';
import queueUp from './src/components/organisms/queueUp'


const config: object = {
    strictMode: 'error',
};

function App() {
  return (
      <NativeBaseProvider config={config}>
          <NativeRouter>
              <View style={styles.container}>
                  <Route exact path="/" component={queueUp} />
              </View>
          </NativeRouter>
      </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -50,
        marginLeft: -100,
    },
});

registerRootComponent(App)
export default App
