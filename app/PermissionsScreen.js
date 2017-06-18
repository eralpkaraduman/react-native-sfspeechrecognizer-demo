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
        let microphonePermission;
        let microphonePermissionDenied;

        RNSFSpeechRecognizer.isMicrophonePermissionGranted()
        .then(granted => {microphonePermission = granted;})
        .then(() => RNSFSpeechRecognizer.isMicrophonePermissionDenied())
        .then(denied => {microphonePermissionDenied = denied;})
        .then(() => this.setState(() => ({
            microphonePermission,
            microphonePermissionDenied
        })));
    }

    componentDidUpdate(prevProps, prevState) {
        const {microphonePermission} = this.state;
        if (microphonePermission) {
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

        RNSFSpeechRecognizer.requestMicrophonePermission(
            () => this._checkPermissions()
        );
    }

    render() {
        return (
            <View style={styles.screen}>
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
