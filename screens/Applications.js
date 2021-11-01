import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Button as MUIButton, Text } from "react-native-paper";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { useNavigation } from "@react-navigation/core";

import { useDispatch, useSelector } from "react-redux";

const Application = () => {

  const [appeals, setAppeals] = useState();
  var appealsArr = [];
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const isSignedIn = useSelector((state) => state.isUserSignedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isSignedIn) navigation.navigate("SignIn");
  }, []);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      setEmail(user?.email ?? "");
    });
  }, []);

  useEffect(() => {
    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("appeals")
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          appealsArr.push({
            appealUUID: doc.data().appealUUID,
            appealType: doc.data().appealType,
            isStart: doc.data().isStart,
          });
        });
      });
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,.2)" }}>
        <Text>Devam Eden Başvurular</Text>
        <Button onPress={() => console.log(appealsArr)}>asd</Button>
        <View>

          <>
            {!appealsArr && appealsArr.map((appeal) => (
              <Text key={appeal.appealUUID}>{appeal.appealUUID}asd</Text>
            ))}
          </>
          <Text>Başvuru 2</Text>
          <Text>Başvuru 3</Text>
          <Text>Başvuru 4</Text>
          <Text>Başvuru 5</Text>
        </View>
      </View>

      <ScrollView style={{ width: "100%", marginTop: 14 }}>
        <MUIButton style={styles.boxes} mode="contained" theme={{ roundness: 3 }}
                   onPress={() => navigation.navigate("NecessaryPapers", { type: 0 })}>
          <Text style={styles.texts}>{"çap başvuru".toLocaleUpperCase()}</Text>
        </MUIButton>
        <MUIButton style={styles.boxes} mode="contained" theme={{ roundness: 3 }}
                   onPress={() => navigation.navigate("NecessaryPapers", { type: 1 })}>
          <Text style={styles.texts}>{"dgs başvuru".toLocaleUpperCase()}</Text>
        </MUIButton>
        <MUIButton style={styles.boxes} mode="contained" theme={{ roundness: 3 }}
                   onPress={() => navigation.navigate("NecessaryPapers", { type: 2 })}>
          <Text style={styles.texts}>{"yatay geçiş başvuru".toLocaleUpperCase()}</Text>
        </MUIButton>
        <MUIButton style={styles.boxes} mode="contained" theme={{ roundness: 3 }}
                   onPress={() => navigation.navigate("NecessaryPapers", { type: 3 })}>
          <Text style={styles.texts}>{"yaz okulu başvuru".toLocaleUpperCase()}</Text>
        </MUIButton>
        <MUIButton style={styles.boxes} mode="contained" theme={{ roundness: 3 }}
                   onPress={() => navigation.navigate("NecessaryPapers", { type: 4 })}>
          <Text style={styles.texts}>{"ders intibak başvuru".toLocaleUpperCase()}</Text>
        </MUIButton>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  boxes: {
    width: "100%",
    marginTop: 8,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 6,
  },
  texts: {
    color: "#fff",
  },
});

export default Application;
