import React from 'react';
import Route from './app/navigation/Route';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Store, persistor} from './app/store';
import {StatusBar} from 'react-native';

const App = () => {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <Route />
      </PersistGate>
    </Provider>
  );
};
export default App;
