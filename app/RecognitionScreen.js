import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Button,
  AlertIOS,
  AppState
} from 'react-native';

import styles from './styles';
import SpeechRecognizer from 'RNSFSpeechRecognizer';

export default class RecognitionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recognizerStatus: undefined
        };
        this.speechRecognizerOptions = {
          onStatusChanged: this.onRecognizerStatusChanged,
          onTranscriptionReceived: null,
          onError: null
        };
    }

    componentDidMount() {
      this._updateSpeechRecognizerStatus();

      // prepare must be called before starting the recognition, calling stop will also require preparation before starting again
      SpeechRecognizer.prepare(this.speechRecognizerOptions);
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

    _updateSpeechRecognizerStatus = () => SpeechRecognizer.getStatus()
      .then(recognizerStatus => this.setState(() => ({recognizerStatus})));
}
