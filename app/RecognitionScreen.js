import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Button,
  AlertIOS,
  AppState
} from 'react-native';

import styles from './styles';
import RNSFSpeechRecognizer from 'RNSFSpeechRecognizer';

export default class RecognitionScreen extends Component {
    static propTypes = {

    };

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <View style={styles.screen}>
                <Text>{'Recognition Screen'}</Text>
            </View>
        );
    }
}
