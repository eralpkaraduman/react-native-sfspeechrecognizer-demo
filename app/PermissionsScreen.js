import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import {
  View,
  Button,
  AlertIOS,
  AppState
} from 'react-native';

import styles from './styles';
import RNSFSpeechRecognizer from 'RNSFSpeechRecognizer';

export default class PermissionsScreen extends Component {
    static propTypes = {
    };

    constructor(props) {
        super(props);
        this.speechRecognizer = new RNSFSpeechRecognizer();
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
        this.speechRecognizer.destroy(); // important
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange = nextAppState => {
        if (nextAppState === 'active') {
            this._checkPermissions();
        }
    }

    _checkPermissions = () => {
        let microphonePermission;
        let microphonePermissionDenied;

        let speechRecognitionPermission;
        let speechRecognitionPermissionDenied;

        this.speechRecognizer.isMicrophonePermissionGranted()
        .then(granted => {microphonePermission = granted;})
        .then(() => this.speechRecognizer.isMicrophonePermissionDenied())
        .then(denied => {microphonePermissionDenied = denied;})
        .then(() => this.speechRecognizer.isSpeechRecognitionPermissionGranted())
        .then(granted => {speechRecognitionPermission = granted;})
        .then(() => this.speechRecognizer.isSpeechRecognitionPermissionDenied())
        .then(denied => {speechRecognitionPermissionDenied = denied;})
        .then(() => this.setState(() => ({
            microphonePermission,
            microphonePermissionDenied,
            speechRecognitionPermission,
            speechRecognitionPermissionDenied
        })));
    }

    componentDidUpdate(prevProps, prevState) {
        const {microphonePermission, speechRecognitionPermission} = this.state;
        if (microphonePermission && speechRecognitionPermission) {
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({routeName: 'Recognition'})
                ]
            });
            this.props.navigation.dispatch(resetAction);
        }
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

        this.speechRecognizer.requestMicrophonePermission()
        .then(() => this._checkPermissions());
    }

    _requestSpeechRecognitionPermission = () => {
        if (this.state.speechRecognitionPermissionDenied) {
            AlertIOS.alert(
                'Speech Recognition Was Denied',
                'We cant turn it on. You\'ll need to go ' +
                'to "iOS System Settings > This App" to manualy allow access'
            );
            return;
        }

        this.speechRecognizer.requestSpeechRecognitionPermission()
        .then(() => this._checkPermissions());
    }

    render() {
        return (
            <View style={styles.screen}>
                {!this.state.microphonePermission && (
                    <View style={{marginTop:40}}>
                        <Button
                            onPress={this._requestMicrophonePermission}
                            title="Tap To Allow Microphone Access"
                        />
                    </View>
                )}
                {!this.state.speechRecognitionPermission && (
                    <View style={{marginTop:40}}>
                        <Button
                            onPress={this._requestSpeechRecognitionPermission}
                            title="Tap To Allow Speech Recognition"
                        />
                    </View>
                )}
            </View>
        );
    }
}
