import {RouteProp} from "@react-navigation/native"
import {NativeStackScreenProps, NativeStackNavigationProp} from "@react-navigation/native-stack";

/* React Navigation types used throughout app*/
export type RootStackParamList = {
    HomePage: undefined;
    LandingPage: undefined;
    QueuerDashboard: undefined;
    OrganizerDashboard: undefined;
    CreateQueuePage: undefined;
    AbandonedScreen: undefined;
    ShareScreen: undefined
    SignUp: undefined;
    EndScreen: undefined;
    SummonScreen: undefined;
    EnqueuedQueuersPage: undefined;
    ActiveQueuesPage: undefined;
    QRCodeScanner: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'HomePage'>;
export type HomeNavigationProps = NativeStackNavigationProp<RootStackParamList, 'HomePage'>;
export type HomeScreenRouteProps = RouteProp<RootStackParamList, 'HomePage'>;
