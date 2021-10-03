import React from 'react';
import { StyleSheet, Text, View, } from "react-native";
import { NativeBaseProvider } from 'native-base';
// @ts-ignore
import { NativeRouter, Route, Link } from 'react-router-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import queueUp from './src/components/organisms/queueUp'
import abandonedScreen from "./src/screens/abandonedScreen";


const config: object = {
    strictMode: 'error',
};

function App() {
    const Stack = createNativeStackNavigator();
    const isQueuedUp = true

    return (
      <NativeBaseProvider config={config}>
          <NavigationContainer>
              <Stack.Navigator initialRouteName="Home">
                  <Stack.Group screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }} >
                      {isQueuedUp ? (
                      <>
                          <Stack.Screen name="Home" component={queueUp} />
                          <Stack.Screen name="Profile" component={abandonedScreen} />
                          <Stack.Screen name="Settings" component={abandonedScreen} />
                      </>
                      ) : (
                      <>
                          <Stack.Screen name="QueuerDashboard" component={abandonedScreen} />
                          <Stack.Screen name="SignUp" component={abandonedScreen} />
                      </>
                      )}
                  </Stack.Group>
              </Stack.Navigator>
          </NavigationContainer>
      </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
});

export default App
