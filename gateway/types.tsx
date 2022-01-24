import {RouteProp} from "@react-navigation/native"
import {NativeStackScreenProps, NativeStackNavigationProp} from "@react-navigation/native-stack";

/* React Navigation types used throughout app*/
export type RootStackParamList = {
    HomePage: undefined;
    LandingPage: undefined;
    UserDashboard: undefined;
    QueueDashboard: undefined;
    QueueDashboardTabs: undefined | {queueId: string};
    CreateQueuePage: undefined;
    AbandonedScreen: undefined;
    ShareScreen: undefined
    EndScreen: undefined;
    SummonScreen: undefined;
    EnqueuedPage: undefined;
    QueuesPage: undefined;
    QRCodeScanner: undefined;
    ConfirmationScreen: undefined;
    SplashScreen: undefined;
    NotFound: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'HomePage'>;
export type HomeNavigationProps = NativeStackNavigationProp<RootStackParamList, 'HomePage'>;
export type HomeScreenRouteProps = RouteProp<RootStackParamList, 'HomePage'>;


/*** ENQUEUED CATALOG PAGE TYPES ***/

export type EnqueuedStats = {
    userId: string
    name: string,
    online: boolean,
    index: number,
    waited: string,
    joinTime: string,
    lastOnline: string,
    status: UserStatus
}


/*** SERVICED CATALOG PAGE TYPES ***/

export type ServicedStats = {
    userId: string,
    name: string,
    reneged: number,
    joinTime: string,
    renegedTime: string,
    servicedTime: string,
    status: UserStatus
}


/*** ABANDONED CATALOG PAGE TYPES ***/

export type AbandonedStats = {
    userId: string,
    name: string,
    waited: number,
    status: UserStatus
}


/*** QUEUES CATALOG PAGE TYPES ***/

export type QueueInfo = {
    queueId: string,
    name: string,
    create_time: string,
    state: string,
}


/*** USER DASHBOARD TYPES ***/

export type DashboardStat = {
    "prefix": string,
    "stat": number,
    "suffix": string,
    "tooltip": string,
}

export type UserInfo = {
    "name": string,
    "phone_number": string,
    "join_time": string,
    "stats": DashboardStat[]
}

export type UserStatus = "ENQUEUED" | "KICKED" | "SERVICED" | "ABANDONED" | "DEFERRED" | "NOSHOW"

export type QueueState = "ACTIVE" | "PAUSED"

export type PossibleInputTypes = 'keyboard' | 'picker'
export type InputTypeMap = {
    [inputType in PossibleInputTypes]: PossibleInputTypes
}
export const inputTypes: InputTypeMap = {
    keyboard: 'keyboard',
    picker: 'picker',
}
export type PossibleClockTypes = 'hours' | 'minutes'
export type ClockTypeMap = {
    [clockType in PossibleClockTypes]: PossibleClockTypes
}


// /*** QUEUE DASHBOARD TYPES ***/
//
// export type QueueStats = {
//     'enqueued': number,
//     'serviced': number,
//     'deferrals': number,
//     'avg': number,
//     'abandoned': number,
//     'noshow': number,
// }
