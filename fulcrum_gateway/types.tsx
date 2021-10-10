import {NativeStackScreenProps} from "@react-navigation/native-stack";

export type RootStackParamList = {
    Home: undefined;
    QueuerDashboard: undefined;
    OrganizerDashboard: undefined;
    Landing: undefined;
    SignUp: undefined;
};

export type homeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
