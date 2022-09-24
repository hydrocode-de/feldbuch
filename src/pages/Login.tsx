import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonSpinner, IonTitle, IonToolbar } from "@ionic/react";
import { useState } from "react";
import { useAuth } from "../supabase/auth";

const Login: React.FC = () => {
    // some state
    const [email, setEmail] = useState<string>('');
    const [pending, setPending] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const { login } = useAuth();

    const onLogin = () => {
        // set pending
        setPending(true);
        login!({email: email})
        // here we could check the value sent back to see if the user is actually authenticated
        .then(value => setMessage(`A login link was sent to ${email}. Please follow that link to log in.`))
        .catch(error => {
            console.log(error);
            setMessage(error);
        }).finally(() => setPending(false));
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Bitte autentifizieren sie sich</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                { message !== '' ? (
                    <IonItem color="warning">
                        <IonLabel>{ message }</IonLabel>
                    </IonItem>
                ) : null }
                <IonItem>
                    <IonLabel>E Mail Adresse</IonLabel>
                    <IonInput type="text" value={email} onIonChange={e => setEmail(e.target.value as string?? '')}/>
                </IonItem>
                <IonButton disabled={email === '' || !login || pending} expand="full" onClick={onLogin}>
                    { pending ? <IonSpinner name="dots" /> : 'Request Link'}
                </IonButton>
            </IonContent>
        </IonPage>
    )
}

export default Login;