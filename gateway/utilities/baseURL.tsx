export default function () {
    return process.env.NODE_ENV === 'development' ? "http://localhost:8080/api" : "https://fulcrum-dsvmjsgs2a-pd.a.run.app/api"
}
