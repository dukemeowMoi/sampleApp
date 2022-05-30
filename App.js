import React from 'react';
import App from './index';
import { Provider } from 'react-redux';
import { RootSiblingParent } from 'react-native-root-siblings';

import store from './Store/configureStore';

export default RNRedux = () => (
  <Provider store = { store }>
    <RootSiblingParent>
      <App />
    </RootSiblingParent>
  </Provider>
)