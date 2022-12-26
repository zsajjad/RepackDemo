/**
 * path: src/modules/RemoteModule/index.tsx
 * description:
 *    This is a remote module that is loaded asynchronously.
 *    This file encapsulate React.lazy and React.Suspense over the remote module.
 */
import React from 'react';
import { Text } from '../../components/Text';

const Component = React.lazy(() => import(/* webpackChunkName: "remoteModule" */ './RemoteModule'));

export default () => (
  <React.Suspense fallback={<Text>Loading Remote Module...</Text>}>
    <Component />
  </React.Suspense>
);
