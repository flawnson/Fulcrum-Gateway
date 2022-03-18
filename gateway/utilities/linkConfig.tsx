export default {
    screens: {
        initialRouteName: 'HomePage',
        HomePage: {
            path: '/:joinCode?',
        },
        QueueDashboard: {
            path: 'queuedashboard'
        },
        UserDashboard: {
            path: 'userdashboard'
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
        ChangePasswordScreen: {
            path: 'changepasswordscreen'
        },
        ConfirmationScreen: {
            path: 'organizer/confirm/:organizer-confirmation',
        },
        SplashScreen: {
            path: 'splashscreen'
        },
        NotFound: '*',
    },
}
