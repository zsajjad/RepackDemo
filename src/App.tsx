import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, useColorScheme } from 'react-native';

import { Colors, Header } from 'react-native/Libraries/NewAppScreen';

import { Button } from './components/Button';

import LocalModule from './modules/LocalModule';
import RemoteModule from './modules/RemoteModule';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [showLocalModule, setShowLocalModule] = React.useState<boolean>(false);
  const [showRemoteModule, setShowRemoteModule] = React.useState<boolean>(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <Header />
        {showLocalModule ? (
          <LocalModule />
        ) : (
          <Button title="Show Local Module" onPress={() => setShowLocalModule(true)} />
        )}
        {showRemoteModule ? (
          <RemoteModule />
        ) : (
          <Button title="Show Remote Module" onPress={() => setShowRemoteModule(true)} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
