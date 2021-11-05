import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Button, Subheading } from "react-native-paper";
import { Icon } from "react-native-elements";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/core";

const AllAppeal = () => {

  const navigation = useNavigation();
  const [appeals, setAppeals] = useState([]);

  useEffect(() => {
    firestore().collection("users")
      .doc(auth().currentUser.uid)
      .collection("appeals")
      .onSnapshot(docs => {
        let appealss = [];
        docs.forEach(doc => {
          appealss.push(doc.data());
        });
        setAppeals(appealss);
      });

  }, []);

  const getApprovedAppeal = () => {
    firestore().collection("adminAppeals")
      .where("user.id", "==", auth().currentUser.uid)
      .where("isStart", "==", 1)
      .where("result.status", "==", 1)
      .onSnapshot(docs => {
        let appeals = [];
        docs.forEach(doc => {
          appeals.push(doc.data());
        });
        setAppeals(appeals);
      });
  };

  const getIgnoredAppeal = () => {
    firestore().collection("adminAppeals")
      .where("user.id", "==", auth().currentUser.uid)
      .where("isStart", "==", 1)
      .where("result.status", "==", 0)
      .onSnapshot(docs => {
        let appeals = [];
        docs.forEach(doc => {
          appeals.push(doc.data());
        });
        setAppeals(appeals);
      });
  };

  const getAllAppeal = () => {
    firestore().collection("adminAppeals")
      .where("user.id", "==", auth().currentUser.uid)
      .onSnapshot(docs => {
        let appeals = [];
        docs.forEach(doc => {
          appeals.push(doc.data());
        });
        setAppeals(appeals);
      });
  };

  const getWaitingAppeal = () => {
    firestore().collection("adminAppeals")
      .where("user.id", "==", auth().currentUser.uid)
      .where("isStart", "==", 1)
      .where("result.status", "==", 2)
      .onSnapshot(docs => {
        let appeals = [];
        docs.forEach(doc => {
          appeals.push(doc.data());
        });
        setAppeals(appeals);
      });
  };


  return (
    <View style={{ paddingVertical: 6 }}>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Button compact mode="contained" style={{ backgroundColor: "#FFC107" }} onPress={() => getWaitingAppeal()}>
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
        <View style={{ alignItems: "center" }}>
          <Subheading style={{ fontSize: 10 }}> '!' işareti olanlar tamamlanmamış başvurudur.</Subheading>
        </View>
        {appeals.length > 0 && appeals.map((appeal) => (
          <View key={appeal.appealUUID} style={{ flexDirection: "row", alignItems: "center", padding: 6 }}>
            <View>
              {appeal.isStart === 2 ?
                <Icon name="alert" type="ionicon" color="red" size={14} />
                :
                <Icon name="checkmark" type="ionicon" color="#5AA658" size={14} />
              }
            </View>
            <View style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
              padding: 6,
            }}>
              <Text
                style={{ flex: 1 }}>{appeal.appealType === 0 ? "ÇAP Başvurusu" : appeal.appealType === 1 ? "DGS Başvurusu" : appeal.appealType === 2 ? "Yatay Geçiş Başvurusu" : appeal.appealType === 3 ? "Yaz Okulu" : "Ders İntibak Başvurusu"}</Text>
              <Pressable onPress={() => navigation.navigate("StudentAppealDetail", { appealUUID: appeal?.appealUUID })}>
                <Icon name="eye" type="ionicon" color="#5AA658" size={14} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>

  );
};

export default AllAppeal;
