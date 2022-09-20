import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage } from "@ionic/react";
import { useState } from "react";
import { useAuth } from "../supabase/auth";

const Login: React.FC = () => {
    // some state
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { login } = useAuth();

    const onLogin = () => {
        login!({email: username, password: password})
        .then(value => console.log(value))
        .catch(error => {
            console.log(error);
            setPassword('');
        });
    }
    return (
        <IonPage>
            <IonContent>
                <IonItem>
                    <IonLabel>e-mail</IonLabel>
                    <IonInput type="text" value={username} onIonChange={e => setUsername(e.target.value as string?? '')}/>
                </IonItem>
                <IonItem>
                    <IonLabel>password</IonLabel>
                    <IonInput type="password" value={password} onIonChange={e => setPassword(e.target.value as string?? '')} />
                </IonItem>
                <IonButton disabled={username === '' || password === '' || !login} onClick={onLogin}>LOGIN</IonButton>
                <IonButton disabled onClick={() => login!({provider: 'github'}).then(v => console.log(v)).catch(e => console.log(e))}>Login with Github</IonButton>
            </IonContent>
        </IonPage>
    )
}

export default Login;