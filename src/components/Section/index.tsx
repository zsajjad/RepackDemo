import React, { useMemo, type PropsWithChildren } from 'react';
import { Text, useColorScheme, View } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import styles from './styles';

interface SectionProps
  extends PropsWithChildren<{
    title: string;
  }> {}

export function Section({ children, title }: SectionProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const color = useMemo(() => (isDarkMode ? Colors.white : Colors.black), [isDarkMode]);
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      <Text style={[styles.sectionDescription, { color }]}>{children}</Text>
    </View>
  );
}
