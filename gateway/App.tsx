// Library imports
import React, {useState, useEffect} from 'react'
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
import EnqueuedPage from "./components/molecules/EnqueuedCatalog";
import QueueDashboardTabs from "./pages/QueueDashboardTabs"
import QRCodeScanner from "./components/organisms/QRCodeScanner"
import ErrorScreen from "./screens/ErrorScreen"
import ConfirmationScreen from "./screens/ConfirmationScreen"
import ChangePasswordScreen from "./screens/ChangePasswordScreen"
import {PreferencesContext} from "./utilities/PreferencesContext"
import linkConfig from "./utilities/linkConfig"
import QueueDashboard from "./pages/QueueDashboard"
import SplashScreen from "./screens/SplashScreen"
import {UserTypes} from "./types"
import {AuthContext} from "./utilities/AuthContext";
import LogoAndName from "./components/atoms/LogoAndName";

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
        [state, userType]  // Keep track of changes to state (specifically to update the signedInAs prop)
    );

    const PERSISTENCE_KEY = 'NAVIGATION_STATE';
    const AUTH_KEY = 'AUTH_STATE';
    const [isReady, setIsReady] = React.useState(false);
    const [initialState, setInitialState] = React.useState();

    const getAuthState = async () => {
        try {
            const authDataString = await AsyncStorage.getItem(AUTH_KEY);
            const authData = authDataString ? JSON.parse(authDataString) : "NONE";

            if (state !== undefined) {
                setUserType(authData);
            }
        } catch (err) {
            setUserType("NONE");
        }
    };

    useEffect(() => {
        getAuthState().then()
    }, []);

    useEffect(() => {
        const restoreState = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();

                if (initialUrl == null) {
                    // Only restore state if there's no deep link
                    // Without this condition, refreshes and attempts to access the app via a deep link send you to the ErrorScreen
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
                        onStateChange={(navState) => {
                                AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(navState))
                                AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userType))
                            }
                        }
                    >
                        <Stack.Navigator initialRouteName={"HomePage"}>
                            <Stack.Group screenOptions={{ headerShown: true,
                                                          headerBackVisible: true,
                                                          title: "FieFoe",
                                                          headerTitle: (props) => <LogoAndName />}} >
                                {userType === "USER" ? (
                                    <>
                                        <Stack.Screen name="UserDashboard" component={UserDashboard} />
                                        <Stack.Screen name="AbandonedScreen" component={AbandonedScreen} />
                                        <Stack.Screen name="ShareScreen" component={ShareScreen} />
                                        <Stack.Screen name="SummonScreen" component={SummonScreen} />
                                        <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
                                        <Stack.Screen name="QueuesPage" component={QueuesPage} />
                                        <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
                                        <Stack.Screen name="NotFound" component={ErrorScreen} />
                                        <Stack.Screen name="HomePage" component={HomePage} />
                                        <Stack.Screen name="SplashScreen" component={SplashScreen} />
                                    </>
                                ) : userType === "ORGANIZER" ? (
                                    <>
                                        <Stack.Screen name="QueuesPage" component={QueuesPage} />
                                        <Stack.Screen name="QueueDashboardTabs" component={QueueDashboardTabs} />
                                        <Stack.Screen name="QueueDashboard" component={QueueDashboard} />
                                        <Stack.Screen name="UserDashboard" component={UserDashboard} />
                                        <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
                                        <Stack.Screen name="ShareScreen" component={ShareScreen} />
                                        <Stack.Screen name="EndScreen" component={EndScreen} />
                                        <Stack.Screen name="NotFound" component={ErrorScreen} />
                                        <Stack.Screen name="HomePage" component={HomePage} />
                                        <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
                                        <Stack.Screen name="SplashScreen" component={SplashScreen} />
                                    </>
                                ) : userType === "ASSISTANT" ? (
                                    <>
                                        <Stack.Screen name="QueueDashboardTabs" component={QueueDashboardTabs} />
                                        <Stack.Screen name="QueueDashboard" component={QueueDashboard} />
                                        <Stack.Screen name="UserDashboard" component={UserDashboard} />
                                        <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
                                        <Stack.Screen name="ShareScreen" component={ShareScreen} />
                                        <Stack.Screen name="NotFound" component={ErrorScreen} />
                                        <Stack.Screen name="HomePage" component={HomePage} />
                                        <Stack.Screen name="SplashScreen" component={SplashScreen} />
                                    </>
                                ) : (
                                    <>
                                        <Stack.Screen name="HomePage" component={HomePage} />
                                        <Stack.Screen name="SplashScreen" component={SplashScreen} />
                                        <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
                                        <Stack.Screen name="EndScreen" component={EndScreen} />
                                        <Stack.Screen name="AbandonedScreen" component={AbandonedScreen} />
                                        <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
                                        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
                                        <Stack.Screen name="NotFound" component={ErrorScreen} />
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
