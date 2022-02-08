// Library imports
import React, {useState} from 'react'
import './i18n'
import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import * as Linking from 'expo-linking'
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Text } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage';

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
import {PreferencesContext} from "./utilities/PreferencesContext"
import linkConfig from "./utilities/linkConfig"
import QueueDashboard from "./pages/QueueDashboard"
import SplashScreen from "./screens/SplashScreen"
import {UserTypes} from "./types"
import {AuthContext} from "./utilities/AuthContext";

// Strict mode can be changed to trigger a warning or an error in case of any nativebase issues
const nativebaseConfig: object = {
    strictMode: 'off',
}

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

    const [userType, setUserType] = useState<UserTypes>("NONE")

    // Reducer to change authentication state according to what kind of user is logged in
    const [state, dispatch] = React.useReducer(
        (prevState: any, action: any) => {
            switch (action.type) {
                case 'SIGN_IN': {
                    // This will be added to context to make the user type available to the application globally
                    setUserType(action.who)
                    switch (action.who) {
                        case 'ORGANIZER':
                            return {
                                ...prevState,
                                isOrganizer: true,
                            };
                        case 'ASSISTANT':
                            return {
                                ...prevState,
                                isAssistant: true,
                            };
                        case 'USER':
                            return {
                                ...prevState,
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
            isUser: false,
            isOrganizer: false,
            isAssistant: false,
        }
    );

    // Mirrors AuthContext, the actual implementation of methods
    const authContext = React.useMemo(
        () => ({
            signedInAs: userType,
            signIn: (data: Exclude<UserTypes, "NONE">) => dispatch({ type: 'SIGN_IN', who: data }),
            signUp: (data: Exclude<UserTypes, "USER" | "NONE">) => dispatch({ type: 'SIGN_IN', who: data }),
            signOut: () => dispatch({ type: 'SIGN_OUT' }),
        }),
        [state]  // Keep track of changes to state (specifically to update the signedInAs prop)
    );

    const PERSISTENCE_KEY = 'NAVIGATION_STATE';
    const [isReady, setIsReady] = React.useState(false);
    const [initialState, setInitialState] = React.useState();

    React.useEffect(() => {
        const restoreState = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();

                if (initialUrl == null) {
                    // Only restore state if there's no deep link
                    const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
                    const state = savedStateString ? JSON.parse(savedStateString) : undefined;

                    if (state !== undefined) {
                        setInitialState(state);
                    }
                }
            } finally {
                setIsReady(true);
            }
        };

        if (!isReady) {
            restoreState();
        }
    }, [isReady]);

    if (!isReady) {
        return (
            <NativeBaseProvider config={nativebaseConfig} theme={theme.nativebase}>
                <SplashScreen />
            </NativeBaseProvider>
        )
    }

    return (
        <AuthContext.Provider value={authContext}>
            <PreferencesContext.Provider value={preferences}>
                <NativeBaseProvider config={nativebaseConfig} theme={theme.nativebase}>
                    <NavigationContainer
                        linking={linking}
                        fallback={<Text>Blah blah blah...</Text>}
                        theme={theme.navigation}
                        initialState={initialState}
                        onStateChange={(state) =>
                            AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
                        }
                    >
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
                                        <Stack.Screen name="EndScreen" component={EndScreen} />
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
                                        <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
                                        <Stack.Screen name="QueuesPage" component={QueuesPage} />
                                        <Stack.Screen name="QueueDashboardTabs" component={QueueDashboardTabs} />
                                        <Stack.Screen name="UserDashboard" component={UserDashboard} />
                                        <Stack.Screen name="EndScreen" component={EndScreen} />
                                        <Stack.Screen name="AbandonedScreen" component={AbandonedScreen} />
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
