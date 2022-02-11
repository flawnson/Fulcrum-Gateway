export default {
    screens: {
        initialRouteName: 'HomePage',
        HomePage: {
            path: '',
        },
        QueueDashboard: {
            path: 'queuedashboard'
        },
        UserDashboard: {
            path: 'userdashboard'
        },
        QueueDashboardTabs: {
            path: 'queuedashboardtabs',
            screens: {
                EnqueuedPage: {
                    path: 'enqueuedpage'
                },
                ServicedPage: {
                    path: 'servicedpage'
                },
                AbandonedPage: {
                    path: 'abandonedpage'
                }
            }
        },
        CreateQueuePage: {
            path: 'createqueuepage'
        },
        AbandonedScreen: {
            path: 'abandonedscreen'
        },
        ShareScreen: {
            path: 'sharescreen'
        },
        SignUp: {
            path: 'signup'
        },
        EndScreen: {
            path: 'endscreen'
        },
        SummonScreen: {
            path: 'summonscreen'
        },
        EnqueuedPage: {
            path: 'enqueuedpage'
        },
        QueuesPage: {
            path: 'queuespage'
        },
        QRCodeScanner: {
            path: 'qrcodescanner'
        },
        ConfirmationScreen: {
            path: 'confirmationscreen'
        },
        SplashScreen: {
            path: 'splashscreen'
        },
        NotFound: '*',
    },
}
