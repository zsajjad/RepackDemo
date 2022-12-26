/**
 * path: src/modules/RemoteModule/RemoteModule.tsx
 * description:
 *   This is a remote module that is loaded asynchronously.
 *   This file is the actual module that is loaded asynchronously.
 */

import React from 'react';
import { useColorScheme, View } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import { Section } from '../../components/Section';
import { Text } from '../../components/Text';

function RemoteModule() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
      }}
    >
      <Section title="Remote Module">
        <Text>
          This module is loading dynamically for execution and is not shipped with the app. It is a remote module.
        </Text>
      </Section>

      <Section title="Details">
        <Text>
          This will not be part of app's initial bundle size. This will be loaded in app after consuming network
          bandwidth.
        </Text>
      </Section>
    </View>
  );
}

export default RemoteModule;
