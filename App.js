/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from "react";
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
      if (!user) {
        navigation.navigate("SignIn");
      setIsSignedIn(false)
      }
      else setIsSignedIn(true)
    });
  }, []);
  return (
    <Tabs.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        return <Icon name={route.name === "Başvurular" ? "albums" : "person"} type="ionicon" color={color}
                     size={size} />;
      },
    })}>
      <Tabs.Screen name="Başvurular" component={Applications} />
      <Tabs.Screen name="Profil" component={Profile} />
    </Tabs.Navigator>
  );
};

const App = () => {

  const [isSignedIn, setIsSignedIn] = useState(false)
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isSignedIn ? (
            <Stack.Screen name="Main" component={TabsNavigator} options={{ headerShown: false }} />
          ): (
            <>
              <Stack.Screen name="SignIn" component={SignIn}  options={{ presentation: "fullScreenModal", headerBackVisible: false }} />
              <Stack.Screen name="SignUp" component={SignUp} options={{ presentation: "fullScreenModal", headerBackVisible: false }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
