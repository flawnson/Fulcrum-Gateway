import Constants from 'expo-constants'

export default function () {
    // Instead of using .env, we can get the node env from the app.config.ts
    return Constants.manifest?.extra?.NODE_ENV === 'development' ? "http://localhost:8080/api"
                                                                 : "https://fulcrum-dsvmjsgs2a-pd.a.run.app/api"
}
