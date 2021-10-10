import React from 'react';
import { StyleSheet, Text, View, } from "react-native";
import { NativeBaseProvider } from 'native-base';
// @ts-ignore
import { NativeRouter, Route, Link } from 'react-router-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import queueUp from './src/components/organisms/queueUp'
import abandonedScreen from "./src/screens/abandonedScreen";
import {RootStackParamList} from "./types";


const config: object = {
    strictMode: 'error',
};

function App() {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const isInQueue = true
    const isQueuer = true
    const isOrganizer = false

    return (
      <NativeBaseProvider config={config}>
          <NavigationContainer>
              <Stack.Navigator initialRouteName="Home">
                  <Stack.Group screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }} >
                      {isInQueue && isQueuer ? (
                      <>
                          <Stack.Screen name="Home" component={queueUp} />
                          <Stack.Screen name="QueuerDashboard" component={abandonedScreen} />
                      </>
                      ) : isInQueue && isOrganizer ? (
                          <>
                              <Stack.Screen name="Home" component={abandonedScreen} />
                              <Stack.Screen name="OrganizerDashboard" component={abandonedScreen} />
                          </>
                      ) : (
                          <>
                              <Stack.Screen name="Landing" component={abandonedScreen} />
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
