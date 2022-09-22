import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage } from "@ionic/react";
import { useState } from "react";
import { useAuth } from "../supabase/auth";

const Login: React.FC = () => {
    // some state
    const [username, setUsername] = useState<string>('');

    const { login } = useAuth();

    const onLogin = () => {
        login!({email: username})
        .then(value => console.log(value))
        .catch(error => {
            console.log(error);
        });
    }
    return (
        <IonPage>
            <IonContent>
                <IonItem>
                    <IonLabel>e-mail</IonLabel>
                    <IonInput type="text" value={username} onIonChange={e => setUsername(e.target.value as string?? '')}/>
                </IonItem>
                <IonButton disabled={username === '' || !login} expand="full" onClick={onLogin}>Request Link</IonButton>
                <IonButton disabled onClick={() => login!({provider: 'github'}).then(v => console.log(v)).catch(e => console.log(e))}>Login with Github</IonButton>
            </IonContent>
        </IonPage>
    )
}

export default Login;