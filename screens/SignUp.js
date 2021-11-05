import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Subheading, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/core";

import PhoneInput from "react-native-phone-input/dist";
import SelectPicker from "react-native-form-select-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useDispatch } from "react-redux";
import { userAuthChange } from "../redux/actions/isUserSignedInAction";
import { Icon } from "react-native-elements";
import DocumentPicker from "react-native-document-picker";
import storage from "@react-native-firebase/storage";
import getPath from "@flyerhq/react-native-android-uri-path";

const SignUp = () => {
  const [fileX, setFileX] = useState([{ name: null, uri: null }]);
  const [isUploadedFileX, setIsUploadedFileX] = useState([{ name: null, uri: null }]);
  const [studentNumber, setStudentNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryIdentifier, setCountryIdentifier] = useState("");
  const [adres, setAdres] = useState("");
  const [ogrSinif, setOgrSinif] = useState("");
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(1640908800));
  const [faculty, setFaculty] = useState("");
  const [departmant, setDepartmant] = useState("");

  const [faculties, setFaculties] = useState([]);
  const [departmans, setDepartmans] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    firestore().collection("faculties")
      .onSnapshot((docs) => {
        let facultiess = [];
        docs.forEach(doc => {
          facultiess.push({
            uid: doc.id,
            name: doc.data().name,
          });
        });
        setFaculties(facultiess);
      });
  }, []);

  useEffect(() => {
    firestore().collection("faculties")
      .doc(faculty)
      .collection("departmans")
      .onSnapshot(docs => {
        let departmanss = [];
        docs.forEach(doc => {
          departmanss.push({
            uid: doc.id,
            name: doc.data().name,
          });
        });
        setDepartmans(departmanss);
      });
  }, [faculty]);

  /*
  * https://stackoverflow.com/questions/48541270/how-to-add-document-with-custom-id-to-firestore
  * firestore'a veri eklemek için
  * */
  const createAccount = async () => {
    setIsLoading(true);
    try { /*try catch ekle eğer collection eklenmezse user'ı sil*/
      const response = await auth().createUserWithEmailAndPassword(email, password);
      await response.user.updateProfile({
        displayName: name,
      });
      await firestore().collection("users").doc(response.user.uid).set({
        name,
        studentNumber,
        email,
        phoneNumber,
        countryIdentifier,
        adres,
        ogrSinif,
        faculty,
        departmant,
        profilePhoto: null,
        type: 0,
      });

      await firestore().collection("users").doc(response.user.uid).collection("appeals").doc("deneme").set({ deneme: "deneme" });
      await firestore().collection("users").doc(response.user.uid).collection("appeals").doc("deneme").delete();
      if (fileX[0].name !== null) await uploadFile("x", studentNumber, name, response.user.uid);
      setIsLoading(false);
      await auth().signInWithEmailAndPassword(email, password);
      dispatch(userAuthChange());
    } catch (e) {
      setIsLoading(false);
      setError(e.message);
    }
  };

  const onPhoneInputChange = (value, iso2) => {
    const newState = {
      phoneInputValue: value,
    };

    if (iso2) {
      newState.countryCode = iso2?.toUpperCase();
    }

    setPhoneNumber(newState);
  };

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const onChange = (event, value) => {
    const date = value ? value : selectedDate;
    setSelectedDate(date);
    if (Platform.OS === "android") {
      setIsPickerShow(false);
    }
    console.log(selectedDate);
  };

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

  const deleteFile = async () => {
    try {
      setFileX([{ name: null, uri: null }]);
    } catch (e) {
      console.log(e.message);
    }
  };

  const uploadFile = async (type, studentNumber, displayName, userId) => {
    let file = fileX[0];

    let fileName = file.name;
    const fileUri = getPath(file.uri);
    const extension = fileName.split(".").pop();
    const name = fileName.split(".").slice(0, -1).join(".");

    fileName = studentNumber + "_"
      + displayName.replace(" ", "-") + "_"
      + userId + "_"
      + Date.now() + "."
      + extension;


    let task = storage().ref("images/userProfilePicture/" + fileName).putFile(fileUri);


    try {
      await task;
      await firestore().collection("users")
        .doc(auth().currentUser.uid)
        .set({
          profilePhoto: fileName,
        }, { merge: true }).then(() => {
          setFileX([{ name: fileName, uri: null }]);
          setIsUploadedFileX([{ name: fileName }]);
        });
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <ScrollView>
      <View style={{ margin: 16 }}>
        {!!error && (
          <Subheading style={{ color: "red", textAlign: "center", marginBottom: 16 }}>{error}</Subheading>
        )}

        <TextInput key={0}
                   label="Öğrenci Numarası"
                   value={studentNumber}
                   onChangeText={(text) => setStudentNumber(text)}
                   keyboardType="numeric"
        />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TextInput key={1}
                     label="Şifre"
                     style={{ width: "45%", marginTop: 12 }}
                     value={password}
                     onChangeText={(text) => setPassword(text)}
                     secureTextEntry
          />
          <TextInput key={2}
                     label="Şifre Tekrar"
                     style={{ width: "50%", marginTop: 12 }}
                     value={passwordAgain}
                     onChangeText={(text) => setPasswordAgain(text)}
                     secureTextEntry
          />
        </View>
        <TextInput key={3}
                   label="Email"
                   style={{ marginTop: 12 }}
                   value={email}
                   onChangeText={(text) => setEmail(text)}
                   keyboardType="email-address"
        />
        <TextInput key={4}
                   label="Ad Soyad"
                   style={{ marginTop: 12 }}
                   value={name}
                   onChangeText={(text) => setName(text)}
        />

        <TextInput key={5}
                   style={{ marginTop: 18 }}
                   label=""
                   render={props =>
                     <PhoneInput
                       style={{ marginTop: 24, marginLeft: 12 }}
                       initialCountry={"tr"}
                       onChangePhoneNumber={onPhoneInputChange}
                       textProps={{
                         placeholder: "Telefon numarası giriniz..",
                       }}
                     />
                   }
        />

        <TextInput key={6}
                   label="TC Kimlik No"
                   style={{ marginTop: 18 }}
                   value={countryIdentifier}
                   onChangeText={(text) => setCountryIdentifier(text)}
                   keyboardType="numeric"
                   maxLength={11}
        />
        <TextInput key={7}
                   label="Adres"
                   style={{ marginTop: 12 }}
                   value={adres}
                   onChangeText={(text) => setAdres(text)}
        />

        <SelectPicker key={8}
                      style={styles.list}
                      onValueChange={(value) => setOgrSinif(value)}
                      selected={ogrSinif}
                      placeholder="Sınıf"
        >
          <SelectPicker.Item label="1" value="1" key="1" />
          <SelectPicker.Item label="2" value="2" key="2" />
          <SelectPicker.Item label="3" value="3" key="3" />
          <SelectPicker.Item label="4" value="4" key="4" />
        </SelectPicker>

        <View>
          {/* The button that used to trigger the date picker */}
          <Pressable onPress={() => showPicker()}>
            <View>
              <TextInput style={{ marginTop: 12 }} disabled
                         label={selectedDate.getTime() !== 1640908800 ? (selectedDate.getDate() + "/" + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear()) : "Doğum Tarihi Seçiniz.."} />
            </View>
          </Pressable>

          {/* The date picker */}
          {isPickerShow && (
            <DateTimePicker key={9}
                            value={selectedDate}
                            mode={"date"}
                            is24Hour={true}
                            onChange={onChange}
                            minimumDate={new Date(1950, 1, 1)}
                            maximumDate={new Date(2020, 12, 31)}
            />
          )}
        </View>

        <SelectPicker key={10}
                      style={styles.list}
                      onValueChange={(value) => setFaculty(value)}
                      selected={faculty}
                      placeholder="Fakülte"
        >
          {faculties.map((faculty) => (
            <SelectPicker.Item label={faculty.name} value={faculty.uid} key={faculty.uid} />
          ))}
        </SelectPicker>

        <SelectPicker key={11}
                      style={styles.list}
                      onValueChange={(value) => setDepartmant(value)}
                      selected={departmant}
                      placeholder="Bölüm"
        >
          {departmans.map(departman => (
            <SelectPicker.Item label={departman.name} value={departman.uid} key={departman.uid} />
          ))}
        </SelectPicker>

        <View key={12}>
          <TouchableOpacity
            style={{
              marginTop: 6,
              paddingVertical: 8,
              paddingLeft: 18,
              paddingRight: 12,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,.3)",
              borderRadius: 6,
            }}
            onPress={() => docPicker()}
          >
            {fileX[0].name ? fileX.map(({ name, uri }) => {
                return (
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text>{name.length > 25 ? name.substring(0, 22) + "..." : name}</Text>
                    <TouchableOpacity style={{ marginLeft: 18 }}
                                      onPress={() => deleteFile()}>
                      <Icon name="close" type="ionicon" />
                    </TouchableOpacity>
                  </View>
                );
              }) :
              <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Profil Fotoğrafı</Text>}
          </TouchableOpacity>
        </View>

        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
        }}>
          <Button
            style={{ width: "100%", paddingTop: 6, paddingBottom: 6 }}
            theme={{ roundness: 3 }}
            mode="contained"
            disabled={studentNumber === ""
            || name === ""
            || email === ""
            || password === ""
            || passwordAgain === ""
            || phoneNumber === ""
            || countryIdentifier === ""
            || adres === ""
            || ogrSinif === ""
            || faculty === ""
            || departmant === ""}
            onPress={() => createAccount()}
            loading={isLoading}
          >
            <Text style={{ color: "white" }}>KAYIT OL</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 22,
    paddingBottom: 16,
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0, .197)",
    backgroundColor: "rgb(231, 231, 231)",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});

export default SignUp;
