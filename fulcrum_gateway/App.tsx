import React from 'react';
import { StyleSheet, Text, View, } from "react-native";
import { NativeBaseProvider, extendTheme } from 'native-base';
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

const config: object = {
    strictMode: 'error',
};

function App() {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const isInQueue = true
    const isQueuer = true
    const isOrganizer = false

    return (
      <NativeBaseProvider config={config} theme={theme}>
          <NavigationContainer>
              <Stack.Navigator initialRouteName="Home">
                  <Stack.Group screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }} >
                      {isInQueue && isQueuer ? (
                      <>
                          <Stack.Screen name="Home" component={HomePage} />
                          <Stack.Screen name="LandingPage" component={LandingPage} />
                          <Stack.Screen name="QueuerDashboard" component={QueuerDashboard} />
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
                              <Stack.Screen name="Landing" component={AbandonedScreen} />
                              <Stack.Screen name="SignUp" component={AbandonedScreen} />
                          </>
                      )}
                  </Stack.Group>
              </Stack.Navigator>
          </NavigationContainer>
      </NativeBaseProvider>
  );
}


const theme = extendTheme({
    colors: {
        // Add new color
        primary: {
            50: '#E3F2F9',
            100: '#C5E4F3',
            200: '#A2D4EC',
            300: '#7AC1E4',
            400: '#47A9DA',
            500: '#0088CC',
            600: '#007AB8',
            700: '#006BA1',
            800: '#005885',
            900: '#003F5E',
        },
        // Redefinig only one shade, rest of the color will remain same.
        amber: {
            400: '#d97706',
        },
    },
    config: {
        // Changing initialColorMode to 'dark'
        initialColorMode: 'light',
    },
    components: {
        Button: {
            baseStyle: {},
            defaultProps: {
                colorScheme: 'red',
            },
            variants: {},
            sizes: {},
        },
    },
});

export default App
