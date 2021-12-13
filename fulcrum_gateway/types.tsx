import {RouteProp} from "@react-navigation/native"
import {NativeStackScreenProps, NativeStackNavigationProp} from "@react-navigation/native-stack";

/* React Navigation types used throughout app*/
export type RootStackParamList = {
    HomePage: undefined;
    LandingPage: undefined;
    UserDashboard: undefined;
    QueueDashboard: undefined;
    QueueDashboardTabs: undefined;
    CreateQueuePage: undefined;
    AbandonedScreen: undefined;
    ShareScreen: undefined
    SignUp: undefined;
    EndScreen: undefined;
    SummonScreen: undefined;
    EnqueuedPage: undefined;
    QueuesPage: undefined;
    QRCodeScanner: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'HomePage'>;
export type HomeNavigationProps = NativeStackNavigationProp<RootStackParamList, 'HomePage'>;
export type HomeScreenRouteProps = RouteProp<RootStackParamList, 'HomePage'>;


/*** ENQUEUED CATALOG PAGE TYPES ***/

export type EnqueuedStats = {
    userId: string,
    name: string,
    online: boolean,
    index: number,
    waited: number,
    state: string
}


/*** SERVICED CATALOG PAGE TYPES ***/

export type ServicedStats = {
    userId: string,
    name: string,
    reneged: number,
    state: string
}


/*** ABANDONED CATALOG PAGE TYPES ***/

export type AbandonedStats = {
    userId: string,
    name: string,
    waited: number,
    state: string
}


/*** QUEUES CATALOG PAGE TYPES ***/

export type QueueInfo = {
    queueId: string,
    name: string,
    lifespan: number,
    state: string,
}


/*** USER DASHBOARD TYPES ***/

export type UserStat = {
    "prefix": string,
    "stat": number,
    "suffix": string,
}


/*** QUEUE DASHBOARD TYPES ***/

export type QueueStats = {
    'enqueued': number,
    'serviced': number,
    'deferrals': number,
    'avg': number,
    'abandoned': number,
    'noshow': number,
}
