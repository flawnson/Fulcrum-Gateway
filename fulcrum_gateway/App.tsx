import React from 'react';
import { StyleSheet, Text, View, } from "react-native";
import { NativeBaseProvider, extendTheme } from 'native-base';
// @ts-ignore
import { NativeRouter, Route, Link } from 'react-router-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EnQueue from './src/components/organisms/EnQueue'
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
      <NativeBaseProvider config={config} theme={theme}>
          <NavigationContainer>
              <Stack.Navigator initialRouteName="Home">
                  <Stack.Group screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }} >
                      {isInQueue && isQueuer ? (
                      <>
                          <Stack.Screen name="Home" component={EnQueue} />
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
        initialColorMode: 'dark',
    },
});

export default App
