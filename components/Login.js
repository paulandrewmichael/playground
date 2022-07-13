import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import mainContext from '../context/Context'; //Context

const Login = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const { userProfile, loggingIn, doLogin, error } = useContext(mainContext); //Objects and function from App.js passed via context
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {error && (
          <View style={styles.error}>
            <Text style={styles.errortext}>{error}</Text>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Username"
            onChangeText={(username) => setUsername(username)}
            value={username}
            label="Username"
            keyboardType={'default'}
            mode="outlined"
            disabled={loggingIn}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            onChangeText={(password) => setPassword(password)}
            value={password}
            secureTextEntry={true}
            label="Password"
            mode="outlined"
            disabled={loggingIn}
          />
        </View>
        <Button
          title="Login to Site"
          onPress={() => doLogin(username, password)}
          disabled={loggingIn}
        >
          Login to Wordpress
        </Button>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  error: {
    backgroundColor: '#f8d7da',
    padding: 10,
    width: '80%',
    borderRadius: 5,
    borderColor: '#f5c6cb',
    marginBottom: 20,
  },
  errortext: {
    color: '#721c24',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    top: 20,
  },
});

export default Login;