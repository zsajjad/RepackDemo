import React from 'react';
import { Text } from '../../components/Text';

const Component = React.lazy(() => import(/* webpackChunkName: "localModule" */ './LocalModule'));

export default () => (
  <React.Suspense fallback={<Text>Loading Local Module...</Text>}>
    <Component />
  </React.Suspense>
);
