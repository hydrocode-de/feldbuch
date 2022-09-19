import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage } from "@ionic/react";

const Login: React.FC = () => {
    return (
        <IonPage>
            <IonContent>
                <IonItem>
                    <IonLabel>e-mail</IonLabel>
                    <IonInput type="text" />
                </IonItem>
                <IonItem>
                    <IonLabel>password</IonLabel>
                    <IonInput type="password" />
                </IonItem>
                <IonButton>LOGIN</IonButton>
            </IonContent>
        </IonPage>
    )
}

export default Login;