import {RouteProp} from "@react-navigation/native"
import {NativeStackScreenProps, NativeStackNavigationProp} from "@react-navigation/native-stack";

export type RootStackParamList = {
    Home: undefined;
    QueuerDashboard: undefined;
    OrganizerDashboard: undefined;
    Landing: undefined;
    SignUp: undefined;
};

export type HomeScreenRouteProps = RouteProp<RootStackParamList, 'Home'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type HomeNavigationProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;
