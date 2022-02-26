import React from "react";
import {Dispatch, SetStateAction} from "react";


type contextType = {
    dashboardContext: string,
    setDashboardContext: Dispatch<SetStateAction<string>>
}

export const DashboardContext = React.createContext<contextType>(
    {
        dashboardContext: "ENQUEUED" as any,
        setDashboardContext: () => {}
    }
)

