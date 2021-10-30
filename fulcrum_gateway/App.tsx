import React from 'react';
import { StyleSheet, Text, View, } from "react-native";
import { NativeBaseProvider } from 'native-base';
// @ts-ignore
import { NativeRouter, Route, Link } from 'react-router-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './src/pages/HomePage'
import AbandonedScreen from "./src/screens/AbandonedScreen";
import QueuerDashboard from "./src/pages/QueuerDashboard";
import OrganizerDashboard from "./src/pages/QueuerDashboard";
import CreateQueuePage from "./src/pages/CreateQueuePage";
import LandingPage from "./src/screens/LandingPage";
import {RootStackParamList} from "./types";
import {nativebaseTheme, navigationTheme} from "./theme";
import { registerRootComponent } from 'expo';

const config: object = {
    strictMode: 'error',
};

function App() {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const isInQueue = true
    const isQueuer = true
    const isOrganizer = false

    return (
      <NativeBaseProvider config={config} theme={nativebaseTheme()}>
          <NavigationContainer theme={navigationTheme()}>
              <Stack.Navigator initialRouteName="Home">
                  <Stack.Group screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }} >
                      {isInQueue && isQueuer ? (
                      <>
                          <Stack.Screen name="Home" component={HomePage} />
                          <Stack.Screen name="LandingPage" component={LandingPage} />
                          <Stack.Screen name="QueuerDashboard" component={QueuerDashboard} />
                          <Stack.Screen name="AbandonedScreen" component={AbandonedScreen} />
                      </>
                      ) : isInQueue && isOrganizer ? (
                          <>
                              <Stack.Screen name="Home" component={HomePage} />
                              <Stack.Screen name="LandingPage" component={LandingPage} />
                              <Stack.Screen name="CreateQueuePage" component={CreateQueuePage} />
                              <Stack.Screen name="OrganizerDashboard" component={OrganizerDashboard} />
                          </>
                      ) : (
                          <>
                              <Stack.Screen name="Home" component={HomePage} />
                              <Stack.Screen name="Landing" component={LandingPage} />
                              <Stack.Screen name="SignUp" component={AbandonedScreen} />
                          </>
                      )}
                  </Stack.Group>
              </Stack.Navigator>
          </NavigationContainer>
      </NativeBaseProvider>
  );
}


export default App
registerRootComponent(App)
