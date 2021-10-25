/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from "react";
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

import NecessaryPapers from "./screens/NecessaryPapers";

import { useSelector } from "react-redux";

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
    <Tabs.Navigator options={{ headerShown: false }} screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        return <Icon name={route.name === "Başvurular" ? "albums" : "person"} type="ionicon" color={color}
                     size={size} />;
      },
    })}>
      <Tabs.Screen name="Başvurular" component={ApplicationStackScreen}
                   options={{ title: "BAŞVURULAR", headerTitleAlign: "center" }} />
      <Tabs.Screen name="Profil" component={ProfileStackScreen} />
    </Tabs.Navigator>
  );
};

const ApplicationStack = createNativeStackNavigator();
const ApplicationStackScreen = () => {
  return (
    <ApplicationStack.Navigator>
      <ProfileStack.Screen name="Applications" component={Applications}
                           options={{ title: "BAŞVURULAR", headerTitleAlign: "center" }} />
      <ProfileStack.Screen name="NecessaryPapers" component={NecessaryPapers} options={{title:'Gerekli Evraklar', headerTitleAlign:'center'}}/>
    </ApplicationStack.Navigator>
  );
};

const ProfileStack = createNativeStackNavigator();
const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={Profile}
                           options={{ title: "PROFİL", headerTitleAlign: "center" }} />
    </ProfileStack.Navigator>
  );
};

const App = () => {
  const isSignedIn = useSelector((state) => state.isUserSignedIn);
  console.log(isSignedIn);
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        {!isSignedIn ?
          <Stack.Navigator screenOptions={{ headerShown: true }}>
            <Stack.Screen name="SignIn" component={SignIn}
                          options={{ presentation: "fullScreenModal", headerShown: false, headerBackVisible: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{
              presentation: "fullScreenModal",
              headerBackVisible: true,
              title: "KAYIT OL",
              headerTitleAlign: "center",
            }} />
          </Stack.Navigator>
          :

          <Tabs.Navigator options={{ headerShown: false }} screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              return <Icon name={route.name === "Başvurular" ? "albums" : "person"} type="ionicon" color={color}
                           size={size} />;
            },
            headerShown: false,
          })}>
            <Tabs.Screen name="Başvurular" component={ApplicationStackScreen} />
            <Tabs.Screen name="Profil" component={ProfileStackScreen} />
          </Tabs.Navigator>
        }
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
