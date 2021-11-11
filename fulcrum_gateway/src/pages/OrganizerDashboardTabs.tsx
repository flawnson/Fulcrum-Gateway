import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OrganizerDashboard from "./OrganizerDashboard";
import EnqueuedQueuersPage from "./EnqueuedQueuersPage";
import AbandonedScreen from "../screens/AbandonedScreen";

const Tab = createBottomTabNavigator();

export default function OrganizerDashboardTabs() {
    return (
        <Tab.Navigator
            initialRouteName="OrganizerDashboard"
            screenOptions={{
                tabBarActiveTintColor: '#8743FF',
            }}
        >
            <Tab.Screen
                name="OrganizerDashboard"
                component={OrganizerDashboard}
                options={{
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen
                name="Enqueued"
                component={EnqueuedQueuersPage}
                options={{
                    tabBarLabel: 'Enqueued',
                }}
            />
            <Tab.Screen
                name="Serviced"
                component={AbandonedScreen}
                options={{
                    tabBarLabel: 'Serviced',
                }}
            />
            <Tab.Screen
                name="Abandoned"
                component={AbandonedScreen}
                options={{
                    tabBarLabel: 'Abandoned',
                }}
            />
        </Tab.Navigator>
    );
}
