import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Button, Dialog, Portal, Subheading, TextInput, Title } from "react-native-paper";
import { Icon } from "react-native-elements";

import PhoneInput from "react-native-phone-input/dist";
import getPath from "@flyerhq/react-native-android-uri-path";
import DocumentPicker from "react-native-document-picker";

import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";

import { userAuthChange } from "../redux/actions/isUserSignedInAction";
import { useDispatch } from "react-redux";

const Settings = () => {

  const dispatch = useDispatch();

  const userSignOut = () => {
    auth().signOut();
    dispatch(userAuthChange());
  };

  const [fileX, setFileX] = useState([{ name: null, uri: null }]);
  const [fileUploadedLoader, setFileUploadedLoader] = useState(false);
  const [userUID, setUserUID] = useState();
  const [userData, setUserData] = useState([]);
  const [email, setEmail] = useState("");
  const [userProfilePhotoURL, setUserProfilePhotoURL] = useState("");
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isEdit, setIsEdit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userFaculty, setUserFaculty] = useState("");
  const [userDepartmant, setUserDepartmant] = useState("");

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
    setIsLoading(true);
    if (isEdit === "name") {
      try {
        await firestore().collection("users")
          .doc(auth().currentUser.uid)
          .set({
            name: newName,
          }, { merge: true });
      } catch (e) {
        console.log(e.message);
      }
    } else if (isEdit === "studentNumber") {
      try {
        await firestore().collection("users")
          .doc(auth().currentUser.uid)
          .set({
            studentNumber: newStudentNumber,
          }, { merge: true });
      } catch (e) {
        console.log(e.message);
      }

    } else if (isEdit === "countryIdentifier") {
      try {
        await firestore().collection("users")
          .doc(auth().currentUser.uid)
          .set({
            countryIdentifier: newCountryIdentifier,
          }, { merge: true });
      } catch (e) {
        console.log(e.message);
      }

    } else if (isEdit === "adres") {
      try {
        await firestore().collection("users")
          .doc(auth().currentUser.uid)
          .set({
            adres: newAdres,
          }, { merge: true });
      } catch (e) {
        console.log(e.message);
      }

    } else if (isEdit === "phoneNumber") {
      try {
        await firestore().collection("users")
          .doc(auth().currentUser.uid)
          .set({
            phoneNumber: newPhoneNumber,
          }, { merge: true });

      } catch (e) {
        console.log(e.message);
      }

    }
    setIsDialogVisible(false);
    setIsLoading(false);
  };

  const deleteProfilePhoto = async () => {
    try {
      await firestore().collection("users")
        .doc(auth().currentUser.uid)
        .set({
          profilePhoto: null,
        }, { merge: true });
      await storage().ref("/images/userProfilePicture/" + userData?.profilePhoto).delete();
    } catch (e) {
      //console.log(e.message)
    }
  };
  /*
  * https://github.com/rnmods/react-native-document-picker
  * dosya seçmek için
  * */
  const docPicker = async () => {
    setFileX([{}]);

    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        /*by using allFiles type, you will able to pick any type of media from user device,
        There can me more options as well
        DocumentPicker.types.images: All image types
        DocumentPicker.types.plainText: Plain text files
        DocumentPicker.types.audio: All audio types
        DocumentPicker.types.pdf: PDF documents
        DocumentPicker.types.zip: Zip files
        DocumentPicker.types.csv: Csv files
        DocumentPicker.types.doc: doc files
        DocumentPicker.types.docx: docx files
        DocumentPicker.types.ppt: ppt files
        DocumentPicker.types.pptx: pptx files
        DocumentPicker.types.xls: xls files
        DocumentPicker.types.xlsx: xlsx files
        For selecting more more than one options use the
        type: [DocumentPicker.types.csv,DocumentPicker.types.xls]*/
        type: [DocumentPicker.types.images],
      });

      setFileX([{ name: res[0].name, uri: res[0].uri }]);

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("error -----", err);
      } else {
        throw err;
      }
    }
  };


  const uploadFile = async (type) => {
    let file;

    if (type === "x") file = fileX[0];

    let fileName = file.name;
    const fileUri = getPath(file.uri);
    const extension = fileName.split(".").pop();
    const name = fileName.split(".").slice(0, -1).join(".");

    fileName = userData.studentNumber + "_"
      + auth().currentUser.displayName.replace(" ", "-") + "_"
      + auth().currentUser.uid + "_"
      + Date.now() + "."
      + extension;

    let task = storage().ref("images/userProfilePicture/" + fileName).putFile(fileUri);

    try {
      await task;
      if (type === "x") await firestore().collection("users")
        .doc(auth().currentUser.uid)
        .set({
          profilePhoto: fileName,
        }, { merge: true }).then(() => {
          setFileX([{ name: fileName, uri: null }]);
          setFileUploadedLoader(true);
          setTimeout(() => {
            setFileUploadedLoader(false);
          }, 2000);
        });
    } catch (e) {
      console.log(e.message);
    }
  };


  const deleteFile = async (type, fileName) => {
    setFileX({ name: null, uri: null });
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
          <Button compact onPress={() => deleteProfilePhoto()} disabled={userData?.profilePhoto === null}>
            <Text>Fotoğrafı Kaldır</Text>
          </Button>
          <TouchableOpacity
            onPress={() => docPicker("x")}
          >
            {fileX[0]?.name ? fileX.map(({ name, uri }) => {
                return (
                  <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
                    <Text>{name.length > 25 ? name.substring(0, 22) + "..." : name}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <TouchableOpacity style={{ marginLeft: 18 }}
                                        onPress={() => deleteFile("x", name)}>
                        <Icon name="close" type="ionicon" />
                      </TouchableOpacity>
                      <Button style={{ marginLeft: 4 }} mode="contained"
                              onPress={async () => await uploadFile("x")}><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  </View>
                );
              }) :
              <Text style={{ textAlign: "center" }}>{"Yeni Fotoğraf Seç".toLocaleUpperCase()}</Text>}
          </TouchableOpacity>
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
          <Text>{userData?.phoneNumber?.phoneInputValue}</Text>
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
                                       placeholder: userData?.phoneNumber?.phoneInputValue.substr(3, userData?.phoneNumber?.phoneInputValue.length),
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
