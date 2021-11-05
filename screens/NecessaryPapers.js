import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { Icon } from "react-native-elements";

import uuid from "react-native-uuid";

import { useNavigation, useRoute } from "@react-navigation/core";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const NecessaryPapers = () => {

  /*
  *   DoubleMajor: ÇAP(0)
  *   VerticalTransfer: DGS(1)
  *   HorizontalTransfer: Yatay Geçiş(2)
  *   SummerSchool: Yaz Okulu(3)
  *   ClassAdaptation: Ders İntibak(4)
  *
  * */


  /*
  *  https://reactnavigation.org/docs/params/
  * sayfadan sayfaya parametre olarak veri aktarmak için
  * */
  const navigation = useNavigation();
  const declareAppealType = useRoute().params.type; //Başvuru tipini tanımla (0, 1, 2, 3, 4 durumu .app.config.txt dosyasında belirtildi)


  //Eğer yarım kalan bi başvuru varsa oraya yönlendir.
  useEffect(() => {
    console.log("appealType: " + declareAppealType);
    firestore().collection("users")
      .doc(auth().currentUser.uid)
      .collection("appeals")
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.map(doc => {
          //console.log(doc.data())
          if (doc.data()?.appealType === declareAppealType && doc.data()?.isStart === 2) {
            if (declareAppealType === 0) navigation.navigate("DoubleMajorAppealScreen", { appealUUID: doc.data()?.appealUUID });
            else if (declareAppealType === 1) navigation.navigate("VerticalAppealScreen", { appealUUID: doc.data()?.appealUUID });
            else if (declareAppealType === 2) navigation.navigate("HorizontalAppealScreen", { appealUUID: doc.data()?.appealUUID });
            else if (declareAppealType === 3) navigation.navigate("SummerSchoolAppealScreen", { appealUUID: doc.data()?.appealUUID });
            else if (declareAppealType === 4) navigation.navigate("ClassAdaptationAppealScreen", { appealUUID: doc.data()?.appealUUID });
          }
        });
      });
  }, []);

  const clickNextButton = async () => {
    let startedAppealUUID;
    const appealUUID = uuid.v4();
    const appealType = declareAppealType;
    try {

      await firestore().collection("users")
        .doc(auth().currentUser.uid)
        .collection("appeals")
        .get()
        .then(querySnapshot => {
          querySnapshot.docs.map(doc => {
            if (doc.data()?.appealType === appealType && doc.data()?.isStart === 2) {
              startedAppealUUID = doc.data()?.appealUUID;
            }
          });
        })
        .then(() => {
          firestore().collection("users")
            .doc(auth().currentUser.uid)
            .collection("appeals")
            .doc(startedAppealUUID)
            .delete();
        });

      await firestore().collection("adminAppeals")
        .doc(startedAppealUUID)
        .delete();

      await firestore().collection("users")
        .doc(auth().currentUser.uid)
        .collection("appeals")
        .doc(appealUUID).set({
          appealUUID,
          appealType,
          isStart: 2,
          percent: 0,
          files: {},
          result: {
            status: 2,
            description: null,
          },
          createdAt: Date.now(),
        }, { merge: true });

      await firestore().collection("adminAppeals")
        .doc(appealUUID)
        .set({
          appealUUID,
          user: {
            id: auth().currentUser.uid,
            name: auth().currentUser.displayName,
          },
          appealType,
          isStart: 2,
          result: {
            status: 2,
            description: null,
          },
        }, { merge: true });

      if (appealType === 0) navigation.navigate("DoubleMajorAppealScreen", { appealUUID: appealUUID });
      else if (appealType === 1) navigation.navigate("VerticalAppealScreen", { appealUUID: appealUUID });
      else if (appealType === 2) navigation.navigate("HorizontalAppealScreen", { appealUUID: appealUUID });
      else if (appealType === 3) navigation.navigate("SummerSchoolAppealScreen", { appealUUID: appealUUID });
      else if (appealType === 4) navigation.navigate("ClassAdaptationAppealScreen", { appealUUID: appealUUID });
    } catch (e) {
      console.log(e.message);
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.wrapper}>
          <Icon name="long-arrow-alt-right" type="font-awesome-5" color="rgba(0,0,0, .3)" size={18} />
          <Text style={styles.texts}>Başvuru dilekçesi</Text>
        </View>
        <View style={styles.wrapper}>
          <Icon name="long-arrow-alt-right" type="font-awesome-5" color="rgba(0,0,0, .3)" size={18} />
          <Text style={styles.texts}>Transkript</Text>
        </View>
        <View style={styles.wrapper}>
          <Icon name="long-arrow-alt-right" type="font-awesome-5" color="rgba(0,0,0, .3)" size={18} />
          <Text style={styles.texts}>Anadal diploma programının ilgili sınıfındaki başarı sıralaması</Text>
        </View>
        <View style={styles.wrapper}>
          <Icon name="long-arrow-alt-right" type="font-awesome-5" color="rgba(0,0,0, .3)" size={18} />
          <Text style={styles.texts}>Kayıt yaptırdığı yıla ait ÖSYM Belgesi (Kontenjanın aşılması during göz önünde
            bulundurulacaktır.)</Text>
        </View>
        <View style={styles.wrapper}>
          <Icon name="long-arrow-alt-right" type="font-awesome-5" color="rgba(0,0,0, .3)" size={18} />
          <Text style={styles.texts}>Yabancı dil belgesi (Yabancı dil ile eğitim yapılan bölümler/programlar için
            gereklidir.)</Text>
        </View>

      </View>
      <View>
        <Button mode="contained" onPress={() => clickNextButton()}>
          <Text style={{ color: "#fff" }}>{"devam et".toLocaleUpperCase()}</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  texts: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    marginTop: 5,
    marginBottom: 5,
  },
});

export default NecessaryPapers;
