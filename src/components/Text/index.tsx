import React, { type PropsWithChildren } from 'react';
import { Text as RNText, StyleProp, TextStyle, useColorScheme } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

type TextProps = PropsWithChildren<{
  colorLight?: string;
  colorDark?: string;
  style?: StyleProp<TextStyle>;
}>;

export function Text({ colorLight, colorDark, children, style }: TextProps) {
  const isDarkMode = useColorScheme() === 'dark';

  const colorInDarkMode = colorLight ?? Colors.lighter;
  const colorInLightMode = colorDark ?? Colors.darker;

  const color = isDarkMode ? colorInDarkMode : colorInLightMode;

  return <RNText style={[{ color }, style]}>{children}</RNText>;
}
