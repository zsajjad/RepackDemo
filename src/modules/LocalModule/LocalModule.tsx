import React from 'react';
import { useColorScheme, View } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import { Section } from '../../components/Section';
import { Text } from '../../components/Text';

function LocalModule() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
      }}
    >
      <Section title="Local Module">
        <Text>
          This module though is loading dynamically for execution but is shipped with the app. It is not a remote
          module.
        </Text>
      </Section>

      <Section title="Details">
        <Text>
          This will be part of app's initial bundle size. This will be loaded in app without consuming any network
          bandwidth.
        </Text>
      </Section>
    </View>
  );
}

export default LocalModule;
