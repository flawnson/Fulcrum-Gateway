import 'react-native-gesture-handler';
import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'native-base'
import HomePage from './src/pages/HomePage'
import SummonScreen from "./src/screens/SummonScreen";
import EndScreen from "./src/screens/EndScreen"
import ShareScreen from "./src/screens/ShareScreen"
import AbandonedScreen from "./src/screens/AbandonedScreen";
import UserDashboard from "./src/pages/UserDashboard";
import LandingPage from "./src/screens/LandingPage";
import { RootStackParamList } from "./types";
import { nativebaseTheme, navigationTheme } from "./theme";
import { registerRootComponent } from 'expo';
import QueuesPage from "./src/pages/QueuesPage";
import EnqueuedPage from "./src/pages/EnqueuedPage";
import QueueDashboardTabs from "./src/pages/QueueDashboardTabs"
import QRCodeScanner from "./src/components/organisms/QRCodeScanner"
import ErrorScreen from "./src/screens/ErrorScreen";
import ConfirmationScreen from "./src/screens/ConfirmationScreen";
import './i18n';
import { PreferencesContext } from "./src/utilities/useTheme";
import * as Linking from 'expo-linking'
import linkConfig from "./src/utilities/linkConfig";
import QueueDashboard from "./src/pages/QueueDashboard";
import DarkModeToggle from "./src/components/atoms/DarkModeToggle";

const config: object = {
    strictMode: 'off',
};
const prefix = Linking.createURL('/')

function App() {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const linking = {
        prefixes: [prefix],
        config: linkConfig
    }
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
                <NavigationContainer linking={linking} fallback={<Text>Blah blah blah...</Text>} theme={theme.navigation}>
                    <Stack.Navigator initialRouteName="HomePage">
                        <Stack.Group screenOptions={{ headerShown: true, headerBackVisible: true, title: "FieFoe"}} >
                            {isInQueue && isQueuer ? (
                            <>
                                <Stack.Screen name="HomePage" component={HomePage} />
                                <Stack.Screen name="LandingPage" component={LandingPage} />
                                <Stack.Screen name="UserDashboard" component={UserDashboard} />
                                <Stack.Screen name="QueueDashboardTabs" component={QueueDashboardTabs} />
                                <Stack.Screen name="AbandonedScreen" component={AbandonedScreen} />
                                <Stack.Screen name="ShareScreen" component={ShareScreen} />
                                <Stack.Screen name="SummonScreen" component={SummonScreen} />
                                <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
                                <Stack.Screen name="QueuesPage" component={QueuesPage} />
                                <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
                                <Stack.Screen name="NotFound" component={ErrorScreen} />
                            </>
                            ) : isInQueue && isOrganizer ? (
                                <>
                                    <Stack.Screen name="HomePage" component={QueueDashboardTabs} />
                                    <Stack.Screen name="LandingPage" component={LandingPage} />
                                    <Stack.Screen name="QueueDashboard" component={QueueDashboardTabs} />
                                    <Stack.Screen name="EnqueuedPage" component={EnqueuedPage} />
                                    <Stack.Screen name="QueuesPage" component={QueuesPage} />
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
