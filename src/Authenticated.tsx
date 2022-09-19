import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home';
import ViewMessage from './pages/ViewMessage';

const Authenticated: React.FC = () => {
    return (
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/" exact={true}>
              <Redirect to="/home" />
            </Route>
            <Route path="/home" exact={true}>
              <Home />
            </Route>
            <Route path="/message/:id">
               <ViewMessage />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
    );
}

export default Authenticated;