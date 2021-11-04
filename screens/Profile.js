import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, Dialog, Portal, Subheading, TextInput, Title } from "react-native-paper";
import auth from "@react-native-firebase/auth";
import { useDispatch } from "react-redux";
import { userAuthChange } from "../redux/actions/isUserSignedInAction";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { Icon } from "react-native-elements";
import PhoneInput from "react-native-phone-input/dist";


const Settings = () => {

  const dispatch = useDispatch();

  const userSignOut = () => {
    auth().signOut();
    dispatch(userAuthChange());
  };
  const [userUID, setUserUID] = useState();
  const [userData, setUserData] = useState([]);
  const [email, setEmail] = useState("");
  const [userProfilePhotoURL, setUserProfilePhotoURL] = useState("");
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isEdit, setIsEdit] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [newName, setNewName] = useState("");
  const [newStudentNumber, setNewStudentNumber] = useState("");
  const [newCountryIdentifier, setNewCountryIdentifier] = useState("");
  const [newAdres, setNewAdres] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      setUserUID(user?.uid ?? 0);
      setEmail(user?.email ?? 0);
    });
  }, []);

  useEffect(() => {
    firestore().collection("users")
      .doc(userUID)
      .get()
      .then(querySnapshot => {
        setUserData(querySnapshot.data());
      });
  }, [userUID]);

  useEffect(() => {
    if (userData?.profilePhoto !== null) {
      storage().ref("/images/userProfilePicture/" + userData?.profilePhoto).getDownloadURL().then(url => {
        setUserProfilePhotoURL(url);
      });
    }
  }, [userData]);

  const onPhoneInputChange = (value, iso2) => {
    const newState = {
      phoneInputValue: value,
    };

    if (iso2) {
      newState.countryCode = iso2?.toUpperCase();
    }

    setNewPhoneNumber(newState);
  };


  const updateData = async () => {
    if (isEdit === "name") console.log(newName);
    if (isEdit === "studentNumber") console.log(newStudentNumber);
    if (isEdit === "countryIdentifier") console.log(newCountryIdentifier);
    if (isEdit === "adres") console.log(newAdres);
    if (isEdit === "phoneNumber") console.log(newPhoneNumber);
  };

  return (
    <View style={{ alignItems: "center", marginTop: 16 }}>
      <ScrollView>
        {userData?.profilePhoto === null ?
          <View style={{ alignItems: "center" }}>
            <Avatar.Text label={userData?.name.split(" ").reduce((prev, current) => prev + current[0], "")} />
          </View> :
          <View style={{ alignItems: "center" }}>
            <Avatar.Image size={88} source={{ uri: userProfilePhotoURL }} />
          </View>
        }
        <View style={styles.container}>
          <Button compact onPress={() => console.log("x")} disabled={userData?.profilePhoto === null}>
            <Text>Fotoğrafı Kaldır</Text>
          </Button>
          <Button compact style={{ marginLeft: 4 }} onPress={() => console.log("+")}>
            <Text>Yeni Fotoğrafı Seç</Text>
          </Button>
        </View>

        <View style={styles.container}>
          <Title>{userData?.name}</Title>
          <Pressable onPress={() => {
            setIsDialogVisible(true);
            setIsEdit("name");
          }}>
            <Icon name="create" type="ionicon" color="#0275d8" size={24} style={{ marginLeft: 8 }} />
          </Pressable>
        </View>

        <View style={{ alignItems: "center" }}>
          <Subheading style={{ marginVertical: 4, alignItems: "center" }}>{email}</Subheading>
        </View>

        <View style={styles.container}>
          <Text>{userData?.studentNumber}</Text>
          <Pressable onPress={() => {
            setIsDialogVisible(true);
            setIsEdit("studentNumber");
          }}>
            <Icon name="create" type="ionicon" color="#0275d8" size={24} style={{ marginLeft: 8 }} />
          </Pressable>
        </View>

        <View style={styles.container}>
          <Text>{userData?.countryIdentifier}</Text>
          <Pressable onPress={() => {
            setIsDialogVisible(true);
            setIsEdit("countryIdentifier");
          }}>
            <Icon name="create" type="ionicon" color="#0275d8" size={24} style={{ marginLeft: 8 }} />
          </Pressable>
        </View>

        <View style={styles.container}>
          <Text>{userData?.adres}</Text>
          <Pressable onPress={() => {
            setIsDialogVisible(true);
            setIsEdit("adres");
          }}>
            <Icon name="create" type="ionicon" color="#0275d8" size={24} style={{ marginLeft: 8 }} />
          </Pressable>
        </View>

        <View style={styles.container}>
          <Text>{'userData?.phoneNumber.phoneInputValue'}</Text>
          <Pressable onPress={() => {
            setIsDialogVisible(true);
            setIsEdit("phoneNumber");
          }}>
            <Icon name="create" type="ionicon" color="#0275d8" size={24} style={{ marginLeft: 8 }} />
          </Pressable>
        </View>

        <Button onPress={() => userSignOut()}>Sign Out</Button>
      </ScrollView>

      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
          <Dialog.Title>{
            isEdit === "name" ? "Ismi"
              :
              isEdit === "studentNumber" ?
                "Öğrenci Numarası"
                :
                isEdit === "countryIdentifier" ?
                  "Kimlik No"
                  :
                  isEdit === "adres" ?
                    "Adres"
                    :
                  isEdit === "phoneNumber" ?
                    "Telefon Numarası"
                    :
                    ""
          } Güncelle</Dialog.Title>
          <Dialog.Content>
            {isEdit === "name" ?
              <TextInput label={userData?.name} value={newName} onChangeText={(text) => setNewName(text)} />
              :
              isEdit === "studentNumber" ?
                <TextInput label={userData?.studentNumber} value={newStudentNumber}
                           onChangeText={(text) => setNewStudentNumber(text)} />
                :
                isEdit === "countryIdentifier" ?
                  <TextInput label={userData?.countryIdentifier} value={newCountryIdentifier}
                             onChangeText={(text) => setNewCountryIdentifier(text)} />
                  :
                  isEdit === "adres" ?
                    <TextInput label={userData?.adres} value={newAdres}
                               onChangeText={(text) => setNewAdres(text)} />
                    :
                  isEdit === "phoneNumber" ?
                    <TextInput key={5}
                               style={{ marginTop: 18 }}
                               label=""
                               render={props =>
                                 <PhoneInput
                                   style={{ marginTop: 24, marginLeft: 12 }}
                                   initialCountry={"tr"}
                                   onChangePhoneNumber={onPhoneInputChange}
                                   textProps={{
                                     placeholder: 'userData?.phoneNumber.phoneInputValue',
                                   }}
                                 />
                               }
                    />
                    :
                    <Text>Başka</Text>
            }
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Vazgeç</Button>
            <Button onPress={async () => await updateData()} loading={isLoading}>Onayla</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
  },
});

export default Settings;
