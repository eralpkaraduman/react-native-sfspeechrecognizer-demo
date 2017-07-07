import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Button,
  AlertIOS,
  AppState
} from 'react-native';

import styles from './styles';
import SpeechRecognizer from 'react-native-sfspeechrecognizer';

export default class RecognitionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recognizerStatus: undefined
        };
        this.speechRecognizerOptions = {
          locale: 'en-US',
          onStatusChanged: this.onRecognizerStatusChanged,
          onTranscriptionReceived: this.handleOnTranscriptionReceived,
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

    handleOnTranscriptionReceived = (formattedString, isFinal, segments) => {
      this.setState(() => ({
        finalTranscript: isFinal ? formattedString : null,
        partialTranscript: isFinal ? null : formattedString
      }));
    }

    render() {
      const {recognizerStatus, partialTranscript, finalTranscript} = this.state;
      return (
        <View style={styles.screen}>
          <View style={{marginTop: 40}}>
            {this.renderButton()}
          </View>
          <Text>{`recognizerStatus: ${recognizerStatus}`}</Text>
          {partialTranscript && (<Text style={styles.transcriptBox}>
            {`(PARTIAL) ${partialTranscript}`}
          </Text>)}
          {finalTranscript && (<Text style={styles.transcriptBox}>
            {`(FINAL) ${finalTranscript}`}
          </Text>)}
        </View>
      );
    }

    renderButton() {
      switch(this.state.recognizerStatus) {
      case 'recognizing':
        return <Button title="STOP" onPress={this._handleTappedStopButton} />
      case 'unavailable':
        return <Text>Preparing...</Text>
      case 'idle':
      case 'ready':
        return <Button title="START" onPress={this._handleTappedStartButton}/>
      case 'unavailable':
      default:
        return <Text>Speech Recognition Unavailable!</Text>
      }
    }

    _updateSpeechRecognizerStatus = () => SpeechRecognizer.getStatus()
      .then(recognizerStatus => this.setState(() => ({recognizerStatus})));

    _prepareIfNeeded = () => {
      if (this.state.recognizerStatus === 'ready') { return Promise.resolve(); }
      else { return SpeechRecognizer.prepare(this.speechRecognizerOptions); }
    };

    _handleTappedStartButton = () => {
      this._updateSpeechRecognizerStatus()
        // prepare must be called before starting the recognition, calling stop will also require preparation before starting again
        .then(() => this._prepareIfNeeded())
        .then(() => SpeechRecognizer.start())
        .then(() => this.setState(() => ({finalTranscript: null, partialTranscript: null})))
        .catch(error => this._showErrorAlert(error));
    }

    _showErrorAlert = error => AlertIOS.alert('Error',error);

    _handleTappedStopButton = () => SpeechRecognizer.stop();
}
