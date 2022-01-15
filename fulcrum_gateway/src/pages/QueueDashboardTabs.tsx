import React, {useEffect} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import QueueDashboard from "./QueueDashboard";
import EnqueuedPage from "./EnqueuedPage";
import ServicedPage from "./ServicedPage";
import AbandonedPage from "./AbandonedPage";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { HomeScreenProps } from "../../types";
import { StyleSheet, Switch } from "react-native";
import DarkModeToggle from "../components/atoms/DarkModeToggle"
import RightHeaderGroup from "../components/molecules/RightHeaderGroup";

const Tab = createBottomTabNavigator();

export default function QueueDashboardTabs() {
    const navigation = useNavigation<HomeScreenProps["navigation"]>()
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
                    return <MaterialCommunityIcons name={iconName} size={32} color={color} />
                },
                tabBarActiveTintColor: '#8743FF',
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
            />
            <Tab.Screen
                name="Enqueued"
                component={EnqueuedPage}
                options={{
                    tabBarLabel: 'Enqueued',
                }}
            />
            <Tab.Screen
                name="Serviced"
                component={ServicedPage}
                options={{
                    tabBarLabel: 'Serviced',
                }}
            />
            <Tab.Screen
                name="Abandoned"
                component={AbandonedPage}
                options={{
                    tabBarLabel: 'Abandoned',
                }}
            />
        </Tab.Navigator>
    );
}


const styles = StyleSheet.create({
    switch: {
        position: "absolute",
        right: "15px",
    },
    switchName: {
        position: "absolute",
        right: "60px",
    },
});


