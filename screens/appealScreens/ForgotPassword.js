import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/core";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [countryIdentifier, setCountryIdentifier] = useState("");
  const [userData, setUserData] = useState();
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const forgotPassword = async () => {
    try {
      firestore().collection("users")
        .where("email", "==", email)
        .where("countryIdentifier", "==", countryIdentifier)
        .onSnapshot(docs => {
          docs.forEach(doc => setUserData(doc.data()));

        });

      try {
        if (!userData) await auth().sendPasswordResetEmail(email).then(() => navigation.navigate('SignIn'));
      } catch (e) {
        setError('Böyle bir kullanıcı yok. İletişime geçin. Error: 452.');
        console.log(e.message);
      }
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      {!error && (<Text style={{ color: "red" }}>{error}</Text>)}
      <TextInput
        label="E-posta"
        style={{ marginTop: 12 }}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        label="TC Kimlik No"
        style={{ marginTop: 12 }}
        value={countryIdentifier}
        onChangeText={(text) => setCountryIdentifier(text)}
        keyboardType="numeric"
      />
      <Button mode="contained" style={{ marginTop: 12 }} disabled={!email || !countryIdentifier} onPress={async () => await forgotPassword()}>
        <Text style={{ color: "#fff" }}>Sıfırla</Text>
      </Button>
    </View>
  );
};

export default ForgotPassword;
