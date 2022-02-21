import Constants from 'expo-constants'

export default function () {
    // Instead of using .env, we can get the node env from the app.config.ts
    return Constants.manifest?.extra?.NODE_ENV === 'development' ? "http://localhost:19006/"
                                                                 : "https://fiefoe.com/"
}
