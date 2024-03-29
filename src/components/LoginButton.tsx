import { IonButton, IonIcon } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { logInOutline, logOutOutline } from 'ionicons/icons';

import { useHistory } from "react-router";
import { useAuth } from "../supabase/auth"
import SyncButton from "./SyncButton";
import { useSettings } from "../contexts/settings";

// get the IonButton props without the onClick handler
type IonButtonProps = Exclude<React.ComponentProps<typeof IonButton>, 'onClick'>

const LoginButton: React.FC<IonButtonProps> = props => {
    // use the login context
    const { logout, user } = useAuth();
    const { user_id } = useSettings()

    // use navigation history
    const history = useHistory();

    // component state to track changes
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // sync the login state with the user 
    useEffect(() => {
        console.log(`Is logged in: ${!!user}`, user)
        setIsLoggedIn(!!user)
    }, [user]
    )

    return <>
        { isLoggedIn ? ( 
            <>
                <IonButton onClick={() => logout!().then(v => console.log(v))} {...props} >
                    {/* <IonIcon slot="icon-only" icon={logOutOutline} /> */}
                    LOGOUT
                </IonButton>
            </>
        ) : (
            <IonButton onClick={() => {history.push('/login')}} {...props} >
                {/* <IonIcon slot="icon-only" icon={logInOutline} /> */}
                LOGIN
            </IonButton>
        )}
    </>
}

export default LoginButton