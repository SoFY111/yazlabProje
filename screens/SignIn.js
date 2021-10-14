import React, { useState } from "react";
import { Image, View } from "react-native";
import { Avatar, Button, Subheading, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/core";

import auth from "@react-native-firebase/auth";

import kouLogo from '../src/pictures/kou-logo.png'

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const signIn = async () => {
    setIsLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('Main');
    } catch (e) {
      setIsLoading(false);
      console.warn(e.message);
      setError(e.message);
    }
  };
  return (
    <View style={{ flex:1,justifyContent:"center" }}>
      <View style={{marginLeft: 36, marginRight:36, marginBottom: 100}}>
        <View style={{alignItems:"center"}}>
          <Avatar.Image source={kouLogo} size={180} style={{marginBottom:62}}/>
        </View>
        {!!error && (
          <Subheading style={{ color: "red", textAlign: "center", marginBottom: 16 }}>{error}</Subheading>
        )}
        <TextInput
          label="E-Mail"
          style={{ marginTop: 12}}
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
        <TextInput
          label="ŞİFRE"
          style={{ marginTop: 12 }}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <Text style={{marginTop:4, fontSize:12}}>{'şifremi unuttum'.toUpperCase()}</Text>
        <View>
          <Button
            mode="contained"
            disabled={email === "" || password === ""}
            onPress={() => signIn()}
            loading={isLoading}
            style={{marginTop:42, padding:4, height:48, width: '100%'}}>
            <Text style={{color:'#fff'}}>Giriş Yap</Text>
          </Button>
        </View>
      </View>
      <View style={{position:'absolute', width:'100%', height: 50, bottom:0, left:0, paddingTop:6, borderTopWidth:1, borderTopColor: 'rgba(0, 0, 0, 0.23)'}}>
        <Button onPress={() => navigation.navigate("SignUp")}>Hesabın yok mu? {'hemen aç'.toUpperCase() }</Button>
      </View>
    </View>
  );
};

export default SignIn;
