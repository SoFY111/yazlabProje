import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Button, Button as MUIButton, Text } from "react-native-paper";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { useNavigation } from "@react-navigation/core";

import { useDispatch, useSelector } from "react-redux";
import { Icon } from "react-native-elements";

const Application = () => {
  const [appeals, setAppeals] = useState([]);
  const [adminAppeals, setAdminAppeals] = useState([]);
  const navigation = useNavigation();
  const [isUserAdmin, setIsUserAdmin] = useState(false);


  /*
  *   https://mesqueeb.github.io/vuex-easy-firestore/add-and-manage-data.html#collection-mode
  *   https://redux.js.org/tutorials/fundamentals/part-5-ui-react#dispatching-actions-with-usedispatch
  *   redux yapısı ile bütün uygulamada okunup değiştirilebilen değişkinler oluşturmak için
  * */
  const isSignedIn = useSelector((state) => state.isUserSignedIn);
  const dispatch = useDispatch();

  /* https://tr.reactjs.org/docs/hooks-effect.html -> useEffect kullanımı*/
  useEffect(() => {
    if (!isSignedIn) navigation.navigate("SignIn");
  }, []);

  /*
  * https://firebase.google.com/docs/firestore/query-data/listen
  * firestore'dan veri çekmek için
  * */
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

    if (isUserAdmin) getAllAppeal();
  }, [isUserAdmin]);

  useEffect(() => {
    firestore().collection("users")
      .doc(auth()?.currentUser?.uid)
      .onSnapshot(doc => {
        doc.data()?.type === 1 ? setIsUserAdmin(true) : setIsUserAdmin(false);
      });
  }, [isSignedIn]);

  const getApprovedAppeal = () => {
    if (isUserAdmin) {
      firestore().collection("adminAppeals")
        .where("isStart", "==", 1)
        .where("result.status", "==", 1)
        .onSnapshot(docs => {
          let appeals = [];
          docs.forEach(doc => {
            appeals.push(doc.data());
          });
          setAdminAppeals(appeals);
        });
    }
  };

  const getIgnoredAppeal = () => {
    if (isUserAdmin) {
      firestore().collection("adminAppeals")
        .where("isStart", "==", 1)
        .where("result.status", "==", 0)
        .onSnapshot(docs => {
          let appeals = [];
          docs.forEach(doc => {
            appeals.push(doc.data());
          });
          setAdminAppeals(appeals);
        });
    }
  };

  const getAllAppeal = () => {
    if (isUserAdmin) {
      firestore().collection("adminAppeals")
        .where("isStart", "==", 1)
        .onSnapshot(docs => {
          let appeals = [];
          docs.forEach(doc => {
            appeals.push(doc.data());
          });
          setAdminAppeals(appeals);
        });
    }
  };

  const getWaitingAppeal = () => {
    if (isUserAdmin) {
      firestore().collection("adminAppeals")
        .where("isStart", "==", 1)
        .where("result.status", "==", 2)
        .onSnapshot(docs => {
          let appeals = [];
          docs.forEach(doc => {
            appeals.push(doc.data());
          });
          setAdminAppeals(appeals);
        });
    }
  };

  return (
    <View style={{ flex: 1, paddingVertical: 16 }}>
      {
        isUserAdmin ?
          <>
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Button compact mode="contained" style={{ backgroundColor: "#FFC107" }}
                        onPress={() => getWaitingAppeal()}>
                  <Text style={{ color: "#fff" }}>Bekleyen Başvurular</Text>
                </Button>
                <Button compact mode="contained" style={{ marginLeft: 16 }} onPress={() => getAllAppeal()}>
                  <Text style={{ color: "#fff" }}>Bütün Başvurular</Text>
                </Button>
                <Button compact mode="contained" style={{ marginLeft: 16, backgroundColor: "#0275d8" }}
                        onPress={() => getApprovedAppeal()}>
                  <Text style={{ color: "#fff" }}>Onaylanan Başvurular</Text>
                </Button>
                <Button compact mode="contained" style={{ marginLeft: 16, backgroundColor: "#cf3830" }}
                        onPress={() => getIgnoredAppeal()}>
                  <Text style={{ color: "#fff" }}>Onaylanmayan Başvurular</Text>
                </Button>
              </ScrollView>
            </View>
            <ScrollView>
              {adminAppeals.length > 0 && adminAppeals.map((appeal) => (
                <View key={appeal.appealUUID} style={{ flexDirection: "row", alignItems: "center", padding: 6 }}>
                  <View>
                    <Icon name="checkmark" type="ionicon" color="#5AA658" size={14} />
                  </View>
                  <View style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 6,
                  }}>
                    <Text>{appeal.user?.name}</Text>
                    <Text>{appeal.appealType === 0 ? "ÇAP Başvurusu" : appeal.appealType === 1 ? "DGS Başvurusu" : appeal.appealType === 2 ? "Yatay Geçiş Başvurusu" : appeal.appealType === 3 ? "Yaz Okulu" : "Ders İntibak Başvurusu"}</Text>
                    <Pressable onPress={() => navigation.navigate("AppealDetail", {
                      appealUUID: appeal?.appealUUID,
                      userId: appeal?.user?.id,
                    })}>
                      <Icon name="eye" type="ionicon" color="#5AA658" size={14} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>
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
