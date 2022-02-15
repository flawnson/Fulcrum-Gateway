import React, {useEffect} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import QueueDashboard from "./QueueDashboard";
import EnqueuedPage from "./EnqueuedPage";
import ServicedPage from "./ServicedPage";
import AbandonedPage from "./AbandonedPage";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {useNavigation, useRoute} from "@react-navigation/native";
import { HomeScreenProps } from "../types";
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";
import {scale} from "../utilities/scales"
import {useTheme} from "native-base";
import {PreferencesContext} from "../utilities/PreferencesContext";

const Tab = createBottomTabNavigator();

export default function QueueDashboardTabs() {
    const {colors} = useTheme()
    const { isThemeDark } = React.useContext(PreferencesContext);
    const route = useRoute<HomeScreenProps["route"]>()
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
    // Setting right header group (language and dark mode) for nested bottom tab navigator
    useEffect(() => navigation.setOptions({headerRight: RightHeaderGroup()}), [])

    return (
        <Tab.Navigator
            initialRouteName="QueueDashboard"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'QueueDashboard') {
                        iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
                    } else if (route.name === 'Enqueued') {
                        iconName = focused ? 'account-clock' : 'account-clock-outline';
                    } else if (route.name === 'Serviced') {
                        iconName = focused ? 'account-check' : 'account-check-outline';
                    } else if (route.name === 'Abandoned') {
                        iconName = focused ? 'undo-variant' : 'undo-variant';
                    }

                    // @ts-ignore for some reason the name has trouble with the type of iconName
                    return <MaterialCommunityIcons name={iconName} size={scale(20)} color={color} />
                },
                tabBarActiveTintColor: isThemeDark ? colors.primary[200] : colors.primary[700],
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                headerBackVisible: true,
                // headerRight: RightHeaderGroup()
            })}
        >
            <Tab.Screen
                name="QueueDashboard"
                component={QueueDashboard}
                options={{
                    tabBarLabel: 'Dashboard',
                }}
                // @ts-ignore
                initialParams={{queueId: route.params?.queueId}}
            />
            <Tab.Screen
                name="Enqueued"
                component={EnqueuedPage}
                options={{
                    tabBarLabel: 'Enqueued',
                }}
                // @ts-ignore
                initialParams={{queueId: route.params?.queueId}}
            />
            <Tab.Screen
                name="Serviced"
                component={ServicedPage}
                options={{
                    tabBarLabel: 'Serviced',
                }}
                // @ts-ignore
                initialParams={{queueId: route.params?.queueId}}
            />
            <Tab.Screen
                name="Abandoned"
                component={AbandonedPage}
                options={{
                    tabBarLabel: 'Abandoned',
                }}
                // @ts-ignore
                initialParams={{queueId: route.params?.queueId}}
            />
        </Tab.Navigator>
    );
}


