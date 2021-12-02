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
import CreateQueuePage from "./src/pages/CreateQueuePage";
import LandingPage from "./src/screens/LandingPage";
import { RootStackParamList } from "./types";
import { nativebaseTheme, navigationTheme } from "./theme";
import { registerRootComponent } from 'expo';
import ActiveQueuesPage from "./src/pages/ActiveQueuesPage";
import EnqueuedQueuersPage from "./src/pages/EnqueuedQueuersPage";
import OrganizerDashboardTabs from "./src/pages/OrganizerDashboardTabs"
import QRCodeScanner from "./src/components/atoms/QRCodeScanner"
import './i18n';
import { PreferencesContext } from "./src/utilities/useTheme";
import OrganizerDashboard from "./src/pages/OrganizerDashboard";

const config: object = {
    strictMode: 'error',
};

function App() {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const isInQueue = true
    const isQueuer = true
    const isOrganizer = false
    const [isThemeDark, setIsThemeDark] = React.useState(false);

    let theme = isThemeDark ? {nativebase: nativebaseTheme("dark"), navigation: navigationTheme("dark")} :
                              {nativebase: nativebaseTheme("light"), navigation: navigationTheme("light")};

    const toggleTheme = React.useCallback(() => {
        return setIsThemeDark(!isThemeDark);
    }, [isThemeDark]);

    const preferences = React.useMemo(
        () => ({
            toggleTheme,
            isThemeDark,
        }),
        [toggleTheme, isThemeDark]
    );

    return (
        <PreferencesContext.Provider value={preferences}>
          <NativeBaseProvider config={config} theme={theme.nativebase}>
              <NavigationContainer theme={theme.navigation}>
                  <Stack.Navigator initialRouteName="HomePage">
                      <Stack.Group screenOptions={{ headerShown: true, headerBackVisible: true, title: "FieFoe" }} >
                          {isInQueue && isQueuer ? (
                          <>
                              <Stack.Screen name="HomePage" component={ActiveQueuesPage} />
                              <Stack.Screen name="LandingPage" component={LandingPage} />
                              <Stack.Screen name="QueuerDashboard" component={QueuerDashboard} />
                              <Stack.Screen name="OrganizerDashboardTabs" component={OrganizerDashboardTabs} />
                              <Stack.Screen name="AbandonedScreen" component={AbandonedScreen} />
                              <Stack.Screen name="ShareScreen" component={ShareScreen} />
                              <Stack.Screen name="SummonScreen" component={SummonScreen} />
                              <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
                          </>
                          ) : isInQueue && isOrganizer ? (
                              <>
                                  <Stack.Screen name="HomePage" component={OrganizerDashboardTabs} />
                                  <Stack.Screen name="LandingPage" component={LandingPage} />
                                  <Stack.Screen name="CreateQueuePage" component={CreateQueuePage} />
                                  <Stack.Screen name="OrganizerDashboard" component={OrganizerDashboardTabs} />
                                  <Stack.Screen name="EnqueuedQueuersPage" component={EnqueuedQueuersPage} />
                                  <Stack.Screen name="ActiveQueuesPage" component={ActiveQueuesPage} />
                                  <Stack.Screen name="ShareScreen" component={ShareScreen} />
                                  <Stack.Screen name="EndScreen" component={EndScreen} />
                              </>
                          ) : (
                              <>
                                  <Stack.Screen name="HomePage" component={HomePage} />
                                  <Stack.Screen name="LandingPage" component={LandingPage} />
                                  <Stack.Screen name="SignUp" component={AbandonedScreen} />
                              </>
                          )}
                      </Stack.Group>
                  </Stack.Navigator>
              </NavigationContainer>
          </NativeBaseProvider>
        </PreferencesContext.Provider>

    );
}


export default App
registerRootComponent(App)
