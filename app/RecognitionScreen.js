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
    constructor(props) {
        super(props);
        this.state = {
            recognizerStatus: undefined
        };
        this.speechRecognizer = new RNSFSpeechRecognizer({
            onStatusChanged: this.onRecognizerStatusChanged,
            onTranscriptionReceived: null,
            onError: null
        });
    }

    componentDidMount() {
        this.speechRecognizer.getStatus()
        .then(recognizerStatus => this.setState(() => ({recognizerStatus})))
        .then(() => this.speechRecognizer.prepare());
    }

    componentWillUnmount() {
        this.speechRecognizer.destroy(); // important
    }

    onRecognizerStatusChanged = (recognizerStatus, prevRecognizerStatus) => {
        console.log(`Speech Recognizer Status Changed to ${recognizerStatus} from ${prevRecognizerStatus}`);
        this.setState(() => ({recognizerStatus}));
    }

    render() {
        return (
            <View style={styles.screen}>
                <Text>{`Recognizer Status: ${this.state.recognizerStatus}`}</Text>
            </View>
        );
    }
}
