import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';

import styles from './styles';

import RNSFSpeechRecognizer from 'RNSFSpeechRecognizer';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            echoResponse: 'Not Received'
        };
    }

    componentDidMount() {
        RNSFSpeechRecognizer.echo("ECHO FROM NATIVE COMPONENT",
            echoResponse => this.setState(
                () => ({echoResponse})
            )
        );
    }

    render() {
        return (
            <View>
                <Text>Home Screen</Text>
                <Text>{`Echo: ${this.state.echoResponse}`}</Text>
            </View>
        );
    }
}
