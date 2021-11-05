import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Button } from "react-native-paper";
import SelectPicker from "react-native-form-select-picker";
import auth from "@react-native-firebase/auth";

const AdminScreen = () => {
  const [admins, setAdmins] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [newUserLoader, setNewUserLoader] = useState(false);
  const [users, setUsers] = useState([]);

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const [newAdmin, setNewAdmin] = useState("");
  const [newAdminLoader, setNewAdminLoader] = useState(false);

  useEffect(() => {
    firestore().collection("users")
      .where("type", "==", 1)
      .onSnapshot(docs => {
        let adminss = [];
        docs.forEach(doc => {
          adminss.push({ adminId: doc.id, admin: doc.data() });
        });
        setAdmins(adminss);
      });
  }, []);

  useEffect(() => {
    firestore().collection("users")
      .where("type", "==", 0)
      .onSnapshot(docs => {
        let userss = [];
        docs.forEach(doc => {
          userss.push({ id: doc.id, user: doc.data() });
        });
        setUsers(userss);
      });
  }, []);

  const updateNewAdmin = async (userId) => {
    setNewAdminLoader(true);
    try {
      await firestore().collection("users")
        .doc(userId)
        .set({
          type: 1,
        }, { merge: true });
      setNewAdminLoader(false);
      setNewAdmin("");
    } catch (e) {
      console.log(e.message);
    }
  };

  const updateNewUser = async (userId) => {
    setNewUserLoader(true);
    if (userId === auth().currentUser.uid) {
      setShowError(true);
      setError("Kendi yetkiniz ile oynayamazsınız");
      setTimeout(() => {
        setShowError(false);
        setNewUserLoader(false);
      }, 2000);
    } else {
      try {
        await firestore().collection("users")
          .doc(userId)
          .set({
            type: 0,
          }, { merge: true });
        setNewUserLoader(false);
        setNewUser("");
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  return (
    <View style={{ padding: 8 }}>
      <Button onPress={() => console.log(admins)}>admins</Button>
      <Button onPress={() => console.log(users)}>users</Button>

      <View key={0} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text>Yeni Admin Seç:</Text>
        <SelectPicker key={8}
                      style={styles.list}
                      onValueChange={(value) => setNewAdmin(value)}
                      selected={newAdmin}
                      placeholder="Kullanıcı Seç"
        >
          {users.map(user => (
            <SelectPicker.Item label={user?.user?.name} value={user?.id} key={user?.id} />
          ))}
        </SelectPicker>
        <Button mode="contained" onPress={async () => await updateNewAdmin(newAdmin)} loading={newAdminLoader}>
          <Text style={{ color: "#fff" }}>Güncelle</Text>
        </Button>
      </View>

      <View key={1} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text>Admin Yetkisi Al:</Text>
        <SelectPicker key={9}
                      style={styles.list}
                      onValueChange={(value) => setNewUser(value)}
                      selected={newUser}
                      placeholder="Admin Seç"
        >
          {admins.map(admin => (
            <SelectPicker.Item label={admin?.admin?.name} value={admin?.adminId} key={admin?.adminId} />
          ))}
        </SelectPicker>
        <Button mode="contained" onPress={async () => await updateNewUser(newUser)} loading={newUserLoader}>
          <Text style={{ color: "#fff" }}>Güncelle</Text>
        </Button>
      </View>
      {
        showError && <View style={{ alignItems: "center", marginTop: 12 }}>
          <Text style={{ color: "red" }}>{error}</Text>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: "rgb(231, 231, 231)",
    borderRadius: 4,
  },
});

export default AdminScreen;
