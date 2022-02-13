import {RouteProp} from "@react-navigation/native"
import {NativeStackScreenProps, NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Image} from "native-base";
import React from "react";

/* React Navigation types used throughout app*/
export type RootStackParamList = {
    HomePage: undefined | {joinCode: string};
    UserDashboard: undefined;
    QueueDashboard: undefined;
    QueueDashboardTabs: undefined | {queueId: QueueInfo["queueId"]};
    CreateQueuePage: undefined;
    AbandonedScreen: undefined;
    ShareScreen: {shareData: ShareData};
    EndScreen: undefined;
    SummonScreen: undefined | {queueId: QueueInfo["queueId"], userId: UserStats["userId"]};
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


export type UserTypes = "USER" | "ASSISTANT" | "ORGANIZER" | "NONE"

export type UserStats = {
    userId: string,
    name: string,
    index?: undefined,  // Needed for UserCatalogCard
    joinTime: string,
    finishTime?: string,
    lastOnline?: string,
    waited: number,
    online?: boolean,  // Needed for UserCatalogCard
    status: UserStatus
    showConfirmDeleteAlert: boolean
    setShowConfirmDeleteAlert: React.Dispatch<React.SetStateAction<boolean>>
}


/*** QUEUES CATALOG PAGE TYPES ***/

export type QueueInfo = {
    queueId: string,
    name: string,
    create_time: string,
    state: QueueState,
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


/*** SHARE PAGE TYPES ***/
export type ShareData = {
    currentQueueName: string,
    currentQueueQR: string | typeof Image,
    currentQueueJoinCode: string,
}

export type UserStatus = "ENQUEUED" | "KICKED" | "SERVICED" | "ABANDONED" | "DEFERRED" | "NOSHOW"

export type QueueState = "ACTIVE" | "PAUSED" | "DELETED"

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
