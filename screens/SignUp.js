import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button, Subheading, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/core";

import { useTheme } from 'react-native-paper';

import auth from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore'

const SignUp = () => {
  const { colors } = useTheme();
  const [studentNumber, setStudentNumber] = useState("")
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const createAccount = async () => {
    setIsLoading(true)
    try {
      const response = await auth().createUserWithEmailAndPassword(email, password);
      await response.user.updateProfile({
        displayName: name,
      });
      await firestore().collection('users').doc(response.user.uid).set({
        studentNumber
      })
      setIsLoading(false)
      navigation.navigate('main')
    }
    catch (e) {
      setIsLoading(false)
      console.warn(e.message)
      setError(e.message)
    }
  };

  return (
    <View style={{ margin: 16 }}>
      {!!error && (
        <Subheading style={{ color: "red", textAlign: "center", marginBottom: 16 }}>{error}</Subheading>
      )}
      <TextInput
        label="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        label="Öğrenci Numarası"
        style={{ marginTop: 12 }}
        value={studentNumber}
        onChangeText={(text) => setStudentNumber(text)}
      />
      <TextInput
        label="Email"
        style={{ marginTop: 12 }}
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        style={{ marginTop: 12 }}
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
      }}>
        <Button
          compact
          onPress={() => navigation.navigate("SignIn")}>
          SIGN IN
        </Button>
        <Button
          theme={{ roundness: 3 }}
          mode="contained"
          disabled={name === "" || email === "" || password === ""} onPress={() => createAccount()}
          loading={isLoading}
        >
          <Text style={{color:'white'}}>SIGN UP</Text>
        </Button>
      </View>
    </View>
  );
};

export default SignUp;
