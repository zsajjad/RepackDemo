import React from 'react';
import { Text } from '../../components/Text';

const Component = React.lazy(() => import(/* webpackChunkName: "remoteModule" */ './RemoteModule'));

export default () => (
  <React.Suspense fallback={<Text>Loading Remote Module...</Text>}>
    <Component />
  </React.Suspense>
);
