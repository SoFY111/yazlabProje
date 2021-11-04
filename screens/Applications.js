import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Button as MUIButton, Text } from "react-native-paper";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { useNavigation } from "@react-navigation/core";

import { useDispatch, useSelector } from "react-redux";

const Application = () => {
  const [allUserId, setAllUserId] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [adminAppeals, setAdminAppeals] = useState([]);
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const [isUserAdmin, setIsUserAdmin] = useState(false);

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
    firestore().collection("users")
      .doc(auth().currentUser.uid)
      .collection("appeals")
      .where("isStart", "==", 2)
      .onSnapshot(docs => {
        let appealss = [];
        docs.forEach(doc => {
          appealss.push(doc.data());
        });
        setAppeals(appealss);
      });

    if (isUserAdmin) getAllAppeal()
  }, []);

  useEffect(() => {
    firestore().collection("users")
      .doc(auth()?.currentUser?.uid)
      .onSnapshot(doc => {
        doc.data()?.type === 1 ? setIsUserAdmin(true) : setIsUserAdmin(false);
      });

  }, [isSignedIn]);

  const getAllAppeal = () => {
    firestore().collection("users")
      .onSnapshot(docs => {
        let allUsers = [];
        docs.forEach(doc => {
          allUsers.push({id: doc.id});
        });
        setAllUserId(allUsers);
      });
    let allAppeal = []
    allUserId.forEach(userId => {
      let user = []
      firestore().collection('users')
        .doc(userId?.id)
        .onSnapshot(docs => {
          user.push(docs.data())
        })

      firestore().collection("users")
        .doc(userId?.id)
        .collection("appeals")
        .onSnapshot(docs => {
          docs.forEach(doc => {
            allAppeal.push({appealUUID: doc.data()?.appealUUID, user});
          });
          setAdminAppeals(allAppeal)
        });
    });
  };

  const getUserData = (userId) => {
    return firestore().collection('users')
      .doc(userId)
      .get()
  }
  return (
    <View style={{ flex: 1, padding: 16 }}>
      {
        isUserAdmin ?
          <>
            <Button onPress={() => getAllAppeal()}>getAllAppeal</Button>
            {adminAppeals.map((appeal) => (
              <Text key={appeal.appealUUID}>{appeal.user?.[0]?.name}-----{appeal.appealUUID}</Text>
            ))}
            <Text>Admin User</Text>
          </>
          :
          <>
            <View style={{ paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,.2)" }}>
              <Text style={{ fontSize: 16 }}>{"Devam Eden Başvurular".toLocaleUpperCase()}</Text>
              <View style={{ marginTop: 6 }}>
                {appeals.length > 0 ? appeals.map(appeal => (
                  <View key={appeal.appealUUID} style={{ flexDirection: "column", marginLeft: 6, marginTop: 2 }}>
                    <Text>{appeal.appealType === 0 ? "ÇAP Başvuru" : appeal.appealType === 1 ? "DGS Başvuru" : appeal.appealType === 2 ? "Yatay Geçiş Başvuru" : appeal.appealType === 3 ? "Yaz Okulu Başvuru" : "Ders İntibak Başvuru"}</Text>
                    {appeal.percent === 0 ? <Text style={{ fontSize: 10 }}>%{appeal.percent}</Text> :
                      appeal.percent === 100 ?
                        <View style={{
                          width: `${appeal.percent}%`,
                          backgroundColor: "#5AA658",
                          alignItems: "center",
                          borderRadius: 4,
                        }}>
                          <Text style={{ fontSize: 10, paddingRight: 6, color: "#fff" }}>Başvuruyu Tamamla</Text>
                        </View> :
                        <View style={{
                          width: `${appeal.percent}%`,
                          backgroundColor: "#5AA658",
                          alignItems: "flex-end",
                          borderRadius: 4,
                        }}>
                          <Text style={{ fontSize: 10, paddingRight: 6, color: "#fff" }}>%{appeal.percent}</Text>
                        </View>
                    }
                  </View>
                )) : <Text style={{ marginLeft: 6, marginTop: 2, fontSize: 14, color: "red" }}>Yarım kalan başvurunuz
                  bulunmamaktadır.</Text>}
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
          </>
      }
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
