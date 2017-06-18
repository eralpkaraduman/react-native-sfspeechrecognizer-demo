import {StackNavigator} from 'react-navigation';

import PermissionsScreen from './PermissionsScreen';
import RecognitionScreen from './RecognitionScreen';

const RNSpeechRecognizerDemo = StackNavigator({
  Permissions: {screen: PermissionsScreen },
  Recognition: {screen: RecognitionScreen}
},{
  mode: 'card',
  headerMode: 'none'
});

export default RNSpeechRecognizerDemo;
