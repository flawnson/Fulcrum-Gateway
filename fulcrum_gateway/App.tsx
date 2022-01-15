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
import SplashScreen from "./src/screens/SpashScreen"

const config: object = {
    strictMode: 'off',
};
const prefix = Linking.createURL('/')

export const AuthContext = React.createContext(
    {
        signIn: (data: any) => {},
        signOut: () => {},
        signUp: () => {}
    }
)

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

    const [state, dispatch] = React.useReducer(
        (prevState: any, action: any) => {
            switch (action.type) {
                case 'SIGN_IN': {
                    switch (action.who) {
                        case 'ORGANIZER':
                            console.log("ORGANIZER")
                            return {
                                ...prevState,
                                isOrganizer: true,
                                isLoading: false,
                                isSignout: false,
                            };
                        case 'ASSISTANT':
                            return {
                                ...prevState,
                                isAssistant: true,
                                isSignout: false,
                                isLoading: false,
                            };
                        case 'USER':
                            return {
                                ...prevState,
                                isUser: true,
                                isSignout: false,
                                isLoading: false,
                            };
                    }
                };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isUser: false,
                        isOrganizer: false,
                        isAssistant: false,
                        isSignout: true,
                        isLoading: false,
                    };
            }
        },
        {
            isUser: false,
            isOrganizer: false,
            isAssistant: false,
            isLoading: false,
            isSignout: false,
        }
    );

    const authContext = React.useMemo(
        () => ({
            signIn: (data: any) => {
                // In a production app, we need to send some data (usually username, password) to server and get a token
                // We will also need to handle errors if sign in failed
                // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
                // In the example, we'll use a dummy token

                dispatch({ type: 'SIGN_IN', who: data });
            },
            signOut: () => dispatch({ type: 'SIGN_OUT' }),
            signUp: () => {
                // In a production app, we need to send user data to server and get a token
                // We will also need to handle errors if sign up failed
                // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
                // In the example, we'll use a dummy token

                dispatch({ type: 'SIGN_IN' });
            },
        }),
        []
    );


    return (
        <AuthContext.Provider value={authContext}>
            <PreferencesContext.Provider value={preferences}>
                <NativeBaseProvider config={config} theme={theme.nativebase}>
                    <NavigationContainer linking={linking} fallback={<Text>Blah blah blah...</Text>} theme={theme.navigation}>
                        <Stack.Navigator>
                            <Stack.Group screenOptions={{ headerShown: true, headerBackVisible: true, title: "FieFoe"}} >
                                {state.isLoading ? (
                                    <>
                                        <Stack.Screen name="SplashScreen" component={SplashScreen} />
                                    </>
                                ) : state.isUser ? (
                                    <>
                                        <Stack.Screen name="HomePage" component={HomePage} />
                                        <Stack.Screen name="LandingPage" component={LandingPage} />
                                        <Stack.Screen name="UserDashboard" component={UserDashboard} />
                                        <Stack.Screen name="AbandonedScreen" component={AbandonedScreen} />
                                        <Stack.Screen name="ShareScreen" component={ShareScreen} />
                                        <Stack.Screen name="SummonScreen" component={SummonScreen} />
                                        <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
                                        <Stack.Screen name="QueuesPage" component={QueuesPage} />
                                        <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
                                        <Stack.Screen name="NotFound" component={ErrorScreen} />
                                    </>
                                ) : state.isOrganizer ? (
                                    <>
                                        <Stack.Screen name="QueuesPage" component={QueuesPage} />
                                        <Stack.Screen name="QueueDashboardTabs" component={QueueDashboardTabs} />
                                        <Stack.Screen name="QueueDashboard" component={QueueDashboard} />
                                    </>
                                ) : state.isAssistant ? (
                                    <>
                                        <Stack.Screen name="QueueDashboardTabs" component={QueueDashboardTabs} />
                                        <Stack.Screen name="QueueDashboard" component={QueueDashboard} />
                                    </>
                                ) : (
                                    <>
                                        <Stack.Screen name="EndScreen" component={EndScreen} />
                                    </>
                                )}
                            </Stack.Group>
                        </Stack.Navigator>
                    </NavigationContainer>
                </NativeBaseProvider>
            </PreferencesContext.Provider>
        </AuthContext.Provider>
    );
}


export default App
registerRootComponent(App)
