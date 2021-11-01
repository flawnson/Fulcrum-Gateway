import {RouteProp} from "@react-navigation/native"
import {NativeStackScreenProps, NativeStackNavigationProp} from "@react-navigation/native-stack";

/* React Navigation types used throughout app*/
export type RootStackParamList = {
    Home: undefined;
    LandingPage: undefined;
    QueuerDashboard: undefined;
    OrganizerDashboard: undefined;
    CreateQueuePage: undefined;
    AbandonedScreen: undefined;
    ShareScreen: undefined
    Landing: undefined;
    SignUp: undefined;
    EndScreen: undefined;
    SummonScreen: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type HomeNavigationProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type HomeScreenRouteProps = RouteProp<RootStackParamList, 'Home'>;
