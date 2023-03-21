import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import { defineCustomElements } from '@ionic/pwa-elements/loader'

import { AuthProvider } from './supabase/auth';
import { FeldbuchProvider } from './supabase/feldbuch';
import { FilterProvider } from './features/filter';
import { SettingsProvider } from './contexts/settings';

defineCustomElements(window)

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <FeldbuchProvider>
          <FilterProvider>
            <App />
          </FilterProvider>
        </FeldbuchProvider>
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// try something
window.addEventListener('beforeinstallprompt', (e: any) => e.prompt ? e.prompt() : null)