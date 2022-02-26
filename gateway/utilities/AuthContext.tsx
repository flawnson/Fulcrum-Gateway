import React from "react";

export const AuthContext = React.createContext(
// AuthContext used throughout the app, default values do nothing
// Put in a separate file from App.tsx to prevent "Require cycles" (a import loop)
    {
        // signedInAs: "NONE" as UserTypes,
        signedInAs: "NONE" as any,
        signIn: (data: any) => {},
        signOut: () => {},
        signUp: (data: any) => {}
    }
)

