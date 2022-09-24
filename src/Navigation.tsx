import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Login from './pages/Login';
import PlotList from './pages/PlotList';
import ViewPlot from './pages/ViewPlot';
import AddUpdates from './pages/AddUpdates';

const Navigation: React.FC = () => {
    return (
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/" exact={true}>
              <Redirect to="/list" />
            </Route>
            <Route path="/list" exact>
              <PlotList />
            </Route>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/list/:id" exact>
              <ViewPlot />
            </Route>
            <Route path="/list/:id/add" exact>
              <AddUpdates />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
    );
}

export default Navigation;