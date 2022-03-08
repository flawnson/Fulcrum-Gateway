import {RouteProp} from "@react-navigation/native"
import {NativeStackScreenProps, NativeStackNavigationProp} from "@react-navigation/native-stack";
import React from "react";

/* React Navigation types used throughout app*/
export type RootStackParamList = {
    HomePage: undefined | any | {joinCode: string}; // Confirmation screen and QueueDashboardMenu complains about types if I don't any
    UserDashboard: undefined | {name: string, phoneNumber: string};
    QueueDashboard: {queueId: QueueInfo["queueId"]};
    QueueDashboardTabs: undefined | {queueId: QueueInfo["queueId"]};  // MAY NOT NEED ANYMORE IF WE GET RID OF TABS
    CreateQueuePage: undefined;
    AbandonedScreen: undefined;
    ShareScreen: {shareData: ShareData};
    EndScreen: undefined;
    SummonScreen: undefined | {queueId: QueueInfo["queueId"], userId: UserStats["userId"]};
    EnqueuedPage: undefined;
    QueuesPage: undefined;
    QRCodeScanner: undefined;
    ConfirmationScreen: undefined;
    ChangePasswordScreen: undefined;
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
    summoned: boolean,  // Needed for UserCatalogCard
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
    "tooltip": string | null,
}

export type UserInfo = {
    "user_name": string,
    "queue_name": string,
    "phone_number": string,
    "join_time": string,
    "status": UserStatus,
    "stats": DashboardStat[]
}


/*** SHARE PAGE TYPES ***/
export type ShareData = {
    currentQueueName: string,
    currentQueueId: string,
    currentQueueQR: string,
    currentQueueJoinCode: string,
}

export type UserStatus = "ENQUEUED" | "KICKED" | "SERVICED" | "ABANDONED" | "DEFERRED" | "NOSHOW" | "UNVERIFIED"

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
