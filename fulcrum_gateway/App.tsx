import 'react-native-gesture-handler';
import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './src/pages/HomePage'
import SummonScreen from "./src/screens/SummonScreen";
import EndScreen from "./src/screens/EndScreen"
import ShareScreen from "./src/screens/ShareScreen"
import AbandonedScreen from "./src/screens/AbandonedScreen";
import QueuerDashboard from "./src/pages/QueuerDashboard";
import OrganizerDashboard from "./src/pages/OrganizerDashboard";
import CreateQueuePage from "./src/pages/CreateQueuePage";
import LandingPage from "./src/screens/LandingPage";
import {RootStackParamList} from "./types";
import {nativebaseTheme, navigationTheme} from "./theme";
import { registerRootComponent } from 'expo';
import ActiveQueuesPage from "./src/pages/ActiveQueuesPage";
import EnqueuedQueuersPage from "./src/pages/EnqueuedQueuersPage";
import './i18n';

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
                  <Stack.Group screenOptions={{ headerShown: false }} >
                      {isInQueue && isQueuer ? (
                      <>
                          <Stack.Screen name="Home" component={SummonScreen} />
                          <Stack.Screen name="LandingPage" component={LandingPage} />
                          <Stack.Screen name="QueuerDashboard" component={QueuerDashboard} />
                          <Stack.Screen name="AbandonedScreen" component={AbandonedScreen} />
                          <Stack.Screen name="ShareScreen" component={ShareScreen} />
                          <Stack.Screen name="SummonScreen" component={SummonScreen} />
                      </>
                      ) : isInQueue && isOrganizer ? (
                          <>
                              <Stack.Screen name="Home" component={HomePage} />
                              <Stack.Screen name="LandingPage" component={LandingPage} />
                              <Stack.Screen name="CreateQueuePage" component={CreateQueuePage} />
                              <Stack.Screen name="OrganizerDashboard" component={OrganizerDashboard} />
                              <Stack.Screen name="EnqueuedQueuersPage" component={EnqueuedQueuersPage} />
                              <Stack.Screen name="ActiveQueuesPage" component={ActiveQueuesPage} />
                              <Stack.Screen name="ShareScreen" component={ShareScreen} />
                              <Stack.Screen name="EndScreen" component={EndScreen} />
                          </>
                      ) : (
                          <>
                              <Stack.Screen name="Home" component={HomePage} />
                              <Stack.Screen name="LandingPage" component={LandingPage} />
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
