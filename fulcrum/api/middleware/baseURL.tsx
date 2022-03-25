export default function () {
    // Instead of using .env, we can get the node env from the app.config.ts
    return process.env.NODE_ENV === 'development' ? "http://localhost:8080/api"
                                                  : "https://api.fiefoe.com/api"
}
