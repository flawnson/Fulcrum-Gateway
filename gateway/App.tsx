// Library imports
import React from 'react'
import './i18n'
import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import * as Linking from 'expo-linking'
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Text } from 'native-base'

// Component imports
import HomePage from './pages/HomePage'
import SummonScreen from "./screens/SummonScreen"
import EndScreen from "./screens/EndScreen"
import ShareScreen from "./screens/ShareScreen"
import AbandonedScreen from "./screens/AbandonedScreen"
import UserDashboard from "./pages/UserDashboard"
import { RootStackParamList } from "./types"
import { nativebaseTheme, navigationTheme } from "./theme"
import QueuesPage from "./pages/QueuesPage"
import EnqueuedPage from "./pages/EnqueuedPage";
import QueueDashboardTabs from "./pages/QueueDashboardTabs"
import QRCodeScanner from "./components/organisms/QRCodeScanner"
import ErrorScreen from "./screens/ErrorScreen"
import ConfirmationScreen from "./screens/ConfirmationScreen"
import { PreferencesContext } from "./utilities/useTheme"
import linkConfig from "./utilities/linkConfig"
import QueueDashboard from "./pages/QueueDashboard"
import SplashScreen from "./screens/SpashScreen"

// Strict mode can be changed to trigger a warning or an error in case of any nativebase issues
const nativebaseConfig: object = {
    strictMode: 'off',
}

// AuthContext used throughout the app, default values do nothing
export const AuthContext = React.createContext(
    {
        signedInAs: "",
        signIn: (data: any) => {},
        signOut: () => {},
        signUp: (data: any) => {}
    }
)

function App() {

    // Stack navigator to navigate between pages and screens in the app
    const Stack = createNativeStackNavigator<RootStackParamList>()

    // The prefix and config to use
    const prefix = Linking.createURL('/')
    const linking = {
        prefixes: [prefix],
        config: linkConfig
    }

    // Theme related config
    const [isThemeDark, setIsThemeDark] = React.useState(false)
    const theme = isThemeDark ? {nativebase: nativebaseTheme("dark"), navigation: navigationTheme("dark")} :
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

    // Reducer to change authentication state according to what kind of user is logged in
    const [state, dispatch] = React.useReducer(
        (prevState: any, action: any) => {
            switch (action.type) {
                case 'SIGN_IN': {
                    switch (action.who) {
                        case 'ORGANIZER':
                            return {
                                ...prevState,
                                signedInAs: "ORGANIZER",
                                isOrganizer: true,
                            };
                        case 'ASSISTANT':
                            return {
                                ...prevState,
                                signedInAs: "ASSISTANT",
                                isAssistant: true,
                            };
                        case 'USER':
                            return {
                                ...prevState,
                                signedInAs: "USER",
                                isUser: true,
                            };
                    }
                };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isUser: false,
                        isOrganizer: false,
                        isAssistant: false,
                    };
            }
        },
        {
            signedInAs: "NONE",
            isUser: false,
            isOrganizer: false,
            isAssistant: false,
        }
    );

    // Mirrors AuthContext, the actual implementation of methods
    const authContext = React.useMemo(
        () => ({
            signedInAs: state.signedInAs,
            signIn: (data: "ORGANIZER" | "ASSISTANT" | "USER") => dispatch({ type: 'SIGN_IN', who: data }),
            signUp: (data: "ORGANIZER" | "ASSISTANT") => dispatch({ type: 'SIGN_IN', who: data }),
            signOut: () => dispatch({ type: 'SIGN_OUT' }),
        }),
        []
    );


    return (
        <AuthContext.Provider value={authContext}>
            <PreferencesContext.Provider value={preferences}>
                <NativeBaseProvider config={nativebaseConfig} theme={theme.nativebase}>
                    <NavigationContainer linking={linking} fallback={<Text>Blah blah blah...</Text>} theme={theme.navigation}>
                        <Stack.Navigator initialRouteName={"HomePage"}>
                            <Stack.Group screenOptions={{ headerShown: true, headerBackVisible: true, title: "FieFoe"}} >
                                {state.isUser ? (
                                    <>
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
                                        <Stack.Screen name="UserDashboard" component={UserDashboard} />
                                        <Stack.Screen name="ShareScreen" component={ShareScreen} />
                                    </>
                                ) : state.isAssistant ? (
                                    <>
                                        <Stack.Screen name="QueueDashboardTabs" component={QueueDashboardTabs} />
                                        <Stack.Screen name="QueueDashboard" component={QueueDashboard} />
                                        <Stack.Screen name="UserDashboard" component={UserDashboard} />
                                        <Stack.Screen name="ShareScreen" component={ShareScreen} />
                                    </>
                                ) : (
                                    <>
                                        <Stack.Screen name="HomePage" component={QueuesPage} />
                                        <Stack.Screen name="QueuesPage" component={QueuesPage} />
                                        <Stack.Screen name="QueueDashboardTabs" component={QueueDashboardTabs} />
                                        <Stack.Screen name="UserDashboard" component={UserDashboard} />
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
