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
import AllAppeal from "./screens/AllAppeal"
import StudentAppealDetail from "./screens/StudentAppealDetail";
import AdminScreen from "./screens/AdminScreen";

import AppealDetail from "./screens/AppealDetail";
import DoubleMajorAppealScreen from "./screens/appealScreens/DoubleMajorAppeal/DoubleMajorAppealScreen";
import VerticalAppealScreen from "./screens/appealScreens/VerticalAppeal/VerticalAppealScreen";
import HorizontalAppealScreen from "./screens/appealScreens/HorizontalAppeal/HorizontalAppealScreen";
import SummerSchoolAppealScreen from "./screens/appealScreens/SummerSchoolAppeal/SummerSchoolAppealScreen";
import ClassAdaptationAppealScreen from "./screens/appealScreens/ClassAdaptation/ClassAdaptationAppealScreen";

import NecessaryPapers from "./screens/NecessaryPapers";

import { useSelector } from "react-redux";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import ForgotPassword from "./screens/appealScreens/ForgotPassword";

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

const ApplicationStack = createNativeStackNavigator();
const ApplicationStackScreen = () => {
  return (
    <ApplicationStack.Navigator>
      <ApplicationStack.Screen name="Applications" component={Applications}
                           options={{ title: "BAŞVURU YAP", headerTitleAlign: "center" }} />
      <ApplicationStack.Screen name="AppealDetail" component={AppealDetail} options={{title:'Başvuru Detayları', headerTitleAlign:'center'}}/>
      <ApplicationStack.Screen name="NecessaryPapers" component={NecessaryPapers} options={{title:'Gerekli Evraklar', headerTitleAlign:'center'}}/>
      <ApplicationStack.Screen name="DoubleMajorAppealScreen" component={DoubleMajorAppealScreen} options={{title:'Çap Başvuru', headerTitleAlign:'center'}}/>
      <ApplicationStack.Screen name="VerticalAppealScreen" component={VerticalAppealScreen} options={{title:'Dikey Geçiş Başvuru', headerTitleAlign:'center'}}/>
      <ApplicationStack.Screen name="HorizontalAppealScreen" component={HorizontalAppealScreen} options={{title:'Yatay Geçiş Başvuru', headerTitleAlign:'center'}}/>
      <ApplicationStack.Screen name="SummerSchoolAppealScreen" component={SummerSchoolAppealScreen} options={{title:'Yaz Okulu Başvuru', headerTitleAlign:'center'}}/>
      <ApplicationStack.Screen name="ClassAdaptationAppealScreen" component={ClassAdaptationAppealScreen} options={{title:'Ders İntibak Başvuru', headerTitleAlign:'center'}}/>
    </ApplicationStack.Navigator>
  );
};

const ProfileStack = createNativeStackNavigator();
const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={Profile}
                           options={{ title: "PROFIL", headerTitleAlign: "center" }} />
    </ProfileStack.Navigator>
  );
};

const AllAppealsStack = createNativeStackNavigator();
const AllAppealsStackScreen = () => {
  return (
    <AllAppealsStack.Navigator>
      <AllAppealsStack.Screen name="AllAppealScreen" component={AllAppeal}
                           options={{ title: "BAŞVURULAR", headerTitleAlign: "center" }} />
      <ApplicationStack.Screen name="StudentAppealDetail" component={StudentAppealDetail} options={{title:'Başvuru Detayları', headerTitleAlign:'center'}}/>
    </AllAppealsStack.Navigator>
  );
};

const AdminStack = createNativeStackNavigator();
const AdminStackScreen = () => {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen name="AllAppealScreen" component={AdminScreen}
                           options={{ title: "BAŞVURULAR", headerTitleAlign: "center" }} />
    </AdminStack.Navigator>
  );
};

const App = () => {
  const isSignedIn = useSelector((state) => state.isUserSignedIn);
  const [isUserAdmin, setIsUserAdmin] = useState(false)

  useEffect(() => {
    firestore().collection('users')
      .doc(auth()?.currentUser?.uid)
      .onSnapshot(doc => {
        doc.data()?.type === 1 ? setIsUserAdmin(true) : setIsUserAdmin(false)
      })
      console.log('isAdmin:' + isUserAdmin)
  }, [isSignedIn])

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
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{
              presentation: "fullScreenModal",
              headerBackVisible: true,
              title: "Şifremi Unuttum",
              headerTitleAlign: "center",
            }} />
          </Stack.Navigator>
          :
          <Tabs.Navigator options={{ headerShown: false }} screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              return <Icon name={route.name === "Başvurular" ? "albums" : route.name === 'Başvuru Yap' ? 'add' : route.name === 'Admin' ? 'settings' : "person"} type="ionicon" color={color}
                           size={size} />;
            },
            headerShown: false,
          })}>
            {!isUserAdmin && <Tabs.Screen name="Başvurular" component={AllAppealsStackScreen} />}
            <Tabs.Screen name={isUserAdmin ? 'Başvurular' : 'Başvuru Yap'} component={ApplicationStackScreen} />
            <Tabs.Screen name="Profil" component={ProfileStackScreen} />
            {isUserAdmin && <Tabs.Screen name="Admin" component={AdminStackScreen} /> }
          </Tabs.Navigator>
        }
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
