import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import styles from './styles';
import HomeScreen from './HomeScreen'

export default class RNSpeechRecognizerDemo extends Component {
  render() {
    return (
      <View style={styles.rootContainer}>
        <HomeScreen/>
      </View>
    );
  }
}
