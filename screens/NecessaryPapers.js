import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { Icon } from "react-native-elements";

import uuid from 'react-native-uuid';

import { useNavigation, useRoute } from "@react-navigation/core";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const NecessaryPapers = (  ) => {

  /*
  *   DoubleMajor: ÇAP(0)
  *   VerticalTransfer: DGS(1)
  *   HorizontalTransfer: Yatay Geçiş(2)
  *   SummerSchool: Yaz Okulu(3)
  *   ClassAdaptation: Ders İntibak(4)
  *
  * */


  const navigation = useNavigation();
  const type = useRoute().params.type;

  const clickNextButton = async () => {
    const appealUUID = uuid.v4();
    const [declareAppealType, setDeclareAppealType] = useState(0)
    if(type == 'VerticalTransfer') setDeclareAppealType(1)
    else if(type == 'HorizontalTransfer') setDeclareAppealType(2)
    else if(type == 'SummerSchool') setDeclareAppealType(3)
    else if(type == 'ClassAdaptation') setDeclareAppealType(4)
    console.log('type:' + type)

    const appealType = declareAppealType;
    console.log('DappealType:' + declareAppealType)
    console.log('appealType:' + appealType)

     await firestore().collection('users')
       .doc(auth().currentUser.uid)
       .collection('appeals')
       .doc(appealUUID).
       set({
         appealUUID,
         appealType,
         isStart:2,
       }, {merge: true})

      /* await firestore().collection('appeals').doc(auth().currentUser.uid).collection(appealUUID).doc(appealUUID).set({
          appealUUID,
          appealType: 0,
          isStart: 1,
      }
    , {merge:true})*/

  }

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
        </View >
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
          <Icon name="long-arrow-alt-right" type="font-awesome-5" color="rgba(0,0,0, .3)" size={18}/>
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
  wrapper: { flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  texts: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft:8,
    marginTop: 5,
    marginBottom: 5,
  },
});

export default NecessaryPapers;
