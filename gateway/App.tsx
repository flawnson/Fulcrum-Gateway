import 'react-native-gesture-handler';
import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'native-base'
import HomePage from './pages/HomePage'
import SummonScreen from "./screens/SummonScreen";
import EndScreen from "./screens/EndScreen"
import ShareScreen from "./screens/ShareScreen"
import AbandonedScreen from "./screens/AbandonedScreen";
import UserDashboard from "./pages/UserDashboard";
import { RootStackParamList } from "./types";
import { nativebaseTheme, navigationTheme } from "./theme";
import { registerRootComponent } from 'expo';
import QueuesPage from "./pages/QueuesPage";
import EnqueuedPage from "./pages/EnqueuedPage";
import QueueDashboardTabs from "./pages/QueueDashboardTabs"
import QRCodeScanner from "./components/organisms/QRCodeScanner"
import ErrorScreen from "./screens/ErrorScreen";
import ConfirmationScreen from "./screens/ConfirmationScreen";
import './i18n';
import { PreferencesContext } from "./utilities/useTheme";
import * as Linking from 'expo-linking'
import linkConfig from "./utilities/linkConfig";
import QueueDashboard from "./pages/QueueDashboard";
import SplashScreen from "./screens/SpashScreen"

const config: object = {
    strictMode: 'off',
};
const prefix = Linking.createURL('/')

export const AuthContext = React.createContext(
    {
        signedInAs: "",
        signIn: (data: any) => {},
        signOut: () => {},
        signUp: (data: any) => {}
    }
)

function App() {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const linking = {
        prefixes: [prefix],
        config: linkConfig
    }
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
            isUser: false,
            isOrganizer: false,
            isAssistant: false,
            signedInAs: "NONE"
        }
    );

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
                <NativeBaseProvider config={config} theme={theme.nativebase}>
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
                                        <Stack.Screen name="HomePage" component={HomePage} />
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
