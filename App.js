import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { loginUrl } from './const/const';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './components/Login'; //Login component
import Home from './components/Home'; //Logged in component 
import mainContext, { doSome } from './context/Context'; //Our context

export default function App() {

  const [isLoading, setIsLoading] = useState(true); //true when the app is loading
  const [isLogged, setIsLogged] = useState(false); //True if the user is logged in
  const [userToken, setUserToken] = useState(null); //User token, maybe a useless state
  const [userProfile, setUserProfile] = useState(null); //userProfile object, it contains token too
  const [loggingIn, setloggingIn] = useState(false); //True when user is waiting for auth
  const [error, setError] = useState(null); //Error texts from the app or serve

  const AppStack = createStackNavigator(); //Stack navigatro setup

  useEffect(() => {
    AsyncStorage.getItem('userProfile').then((value) => {
      if (value) {
        setUserProfile(JSON.parse(value)),
          setIsLoading(false),
          setIsLogged(true);
      } else {
        setIsLoading(false), setIsLogged(false);
      }
    });
  }, []); //Run once

  const doLogout = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      setloggingIn(true);
      setUserProfile(null);
      setloggingIn(false);
      setIsLogged(false);
      return true;
    } catch (exception) {
      setError('Error deleting data');
      return false;
    }
  };

  const doLogin = async (username, password) => {
    //console.log(username + '...' + password);
    setloggingIn(true);
    setError(null);
    let formData = new FormData();
    formData.append('type', 'login');
    formData.append('username', username);
    formData.append('password', password);
    try {
      let response = await fetch(loginUrl, {
        method: 'POST',
        body: formData,
      });
      let json = await response.json();
      //console.log(json);
      if (json.status != false) {
        setError(null);
        try {
          await AsyncStorage.setItem(
            'userProfile',
            JSON.stringify({
              isLoggedIn: json.status,
              authToken: json.token,
              id: json.data.id,
              name: json.data.user_login,
              avatar: json.avatar,
            })
          );
        } catch {
          setError('Error storing data on device');
        }
        setUserProfile({
          isLoggedIn: json.status,
          authToken: json.token,
          id: json.data.id,
          name: json.data.user_login,
          avatar: json.avatar,
        });
        setUserProfile(json);
        setUserToken(json.token);
        setIsLogged(true);
        console.log(json);
      } else {
        setIsLogged(false);
        setError('Login Failed');
      }
      setloggingIn(false);
    } catch (error) {
      //console.error(error);
      setError('Error connecting to server');
      setloggingIn(false);
    }
  };

  const wContext = {
    userProfile: userProfile,
    loggingIn: loggingIn,
    error: error,
    doSome: () => {
      doSome();
    },
    doLogin: (username, password) => {
      doLogin(username, password);
    },
    doLogout: () => {
      doLogout();
    },
  };

  if (isLoading) {
    // SHOWING SPINNING WHEEL DURING LOAD AND USEEFFECT PROCESSING
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <mainContext.Provider value={wContext}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <AppStack.Navigator initialRouteName="Login">
          {isLogged == false ? (
            <>
              <AppStack.Screen name="Login to Wordpress" component={Login} /> 
            </>
          ) : (
            <>
              <AppStack.Screen name="Home" component={Home} />
            </>
          )}
        </AppStack.Navigator>
      </NavigationContainer>
    </mainContext.Provider>
  );
}