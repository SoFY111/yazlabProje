/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";

import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Profile from "./screens/Profile";
import Applications from "./screens/Applications";

import {useSelector, useDispatch, Provider } from "react-redux";
import store from "./redux/store";

import auth from "@react-native-firebase/auth";

const theme = {
  ...DefaultTheme,
  myOwnProperty: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#5AA658",
    white: "#fff",
  },
};

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const TabsNavigator = () => {
  const navigation = useNavigation();
  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (!user) navigation.navigate("SignIn");
    });
  }, []);
  return (
    <Tabs.Navigator options={{headerShown: false}} screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        return <Icon name={route.name === "Başvurular" ? "albums" : "person"} type="ionicon" color={color}
                     size={size} />;
      },
    })}>
      <Tabs.Screen name="Başvurular" component={Applications}/>
      <Tabs.Screen name="Profil" component={Profile} />
    </Tabs.Navigator>
  );
};

const App = () => {

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: true }} initialRouteName="SignIn">
            <Stack.Screen name="SignIn" component={SignIn}  options={{ presentation: "fullScreenModal", headerShown: false, headerBackVisible: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ presentation: "fullScreenModal", headerBackVisible: true, title: 'KAYIT OL', headerTitleAlign:'center' }} />
            <Stack.Screen name="Main" component={TabsNavigator} options={{ presentation: "fullScreenModal", headerShown: false}} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;
