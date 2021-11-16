import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OrganizerDashboard from "./OrganizerDashboard";
import EnqueuedQueuersPage from "./EnqueuedQueuersPage";
import ServicedQueuersPage from "./ServicedQueuersPage";
import AbandonedQueuersPage from "./AbandonedQueuersPage";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function OrganizerDashboardTabs() {
    return (
        <Tab.Navigator
            initialRouteName="OrganizerDashboard"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'OrganizerDashboard') {
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
            })}
        >
            <Tab.Screen
                name="OrganizerDashboard"
                component={EnqueuedQueuersPage}
                options={{
                    tabBarLabel: 'Dashboard',
                }}
            />
            <Tab.Screen
                name="Enqueued"
                component={OrganizerDashboard}
                options={{
                    tabBarLabel: 'Enqueued',
                }}
            />
            <Tab.Screen
                name="Serviced"
                component={ServicedQueuersPage}
                options={{
                    tabBarLabel: 'Serviced',
                }}
            />
            <Tab.Screen
                name="Abandoned"
                component={AbandonedQueuersPage}
                options={{
                    tabBarLabel: 'Abandoned',
                }}
            />
        </Tab.Navigator>
    );
}
