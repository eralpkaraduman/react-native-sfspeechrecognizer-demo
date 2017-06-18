import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  AlertIOS,
  AppState
} from 'react-native';

import styles from './styles';

import RNSFSpeechRecognizer from 'RNSFSpeechRecognizer';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            microphonePermission: false,
            microphonePermissionDenied: false,

            speechRecognitionPermission: false,
            speechRecognitionPermissionDenied: false
        };
    }

    componentDidMount() {
        this._checkPermissions();
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = nextAppState => {
        if (nextAppState === 'active') {
            this._checkPermissions();
        }
    }

    _checkPermissions = () => {
        RNSFSpeechRecognizer.isMicrophonePermissionGranted(
            microphonePermission => this.setState(() => ({microphonePermission}))
        );
        RNSFSpeechRecognizer.isMicrophonePermissionDenied(
            microphonePermissionDenied => this.setState(() => ({microphonePermissionDenied}))
        );
    }

    _requestMicrophonePermission = () => {
        if (this.state.microphonePermissionDenied) {
            AlertIOS.alert(
                'Microphone Access Was Denied',
                'We cant turn it on. You\'ll need to go ' +
                'to "iOS System Settings > This App" to manualy allow access'
            );
            return;
        }

        RNSFSpeechRecognizer.requestMicrophonePermission(
            () => this._checkPermissions()
        );
    }

    render() {
        return (
            <View>
                {!this.state.microphonePermission && (
                    <Button
                        onPress={this._requestMicrophonePermission}
                        title="Allow Microphone Access"
                    />
                )}
                {!this.state.speechRecognitionPermission && (
                    <Button
                        onPress={() => AlertIOS.alert('Not implemented yet.')}
                        title="Allow Speech Recognition"
                    />
                )}
            </View>
        );
    }
}
