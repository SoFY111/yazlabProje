import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Subheading, TextInput, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/core";

import PhoneInput from "react-native-phone-input/dist";
import SelectPicker from "react-native-form-select-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useDispatch } from "react-redux";
import { userAuthChange } from "../redux/actions/isUserSignedInAction";

const SignUp = () => {
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
  const [selectedDate, setSelectedDate] = useState(new Date(-631152000000));
  const [faculty, setFaculty] = useState("");
  const [departmant, setDepartmant] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();
  const dispatch = useDispatch()

  const createAccount = async () => {
    setIsLoading(true);
    try { /*try catch ekle eğer collection eklenmezse user'ı sil*/
      const response = await auth().createUserWithEmailAndPassword(email, password);
      await response.user.updateProfile({
        displayName: name,
      });
      await firestore().collection("users").doc(response.user.uid).set({
        studentNumber,
        phoneNumber,
        countryIdentifier,
        adres,
        ogrSinif,
        faculty,
        departmant,
        type: 0
      });
      setIsLoading(false);
      await auth().signInWithEmailAndPassword(email, password);
      dispatch(userAuthChange())
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

  return (
    <ScrollView>
      <View style={{ margin: 16 }}>
        {!!error && (
          <Subheading style={{ color: "red", textAlign: "center", marginBottom: 16 }}>{error}</Subheading>
        )}

        <TextInput
          label="Öğrenci Numarası"
          value={studentNumber}
          onChangeText={(text) => setStudentNumber(text)}
          keyboardType="numeric"
        />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TextInput
            label="Şifre"
            style={{ width: "45%", marginTop: 12 }}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <TextInput
            label="Şifre Tekrar"
            style={{ width: "50%", marginTop: 12 }}
            value={passwordAgain}
            onChangeText={(text) => setPasswordAgain(text)}
            secureTextEntry
          />
        </View>
        <TextInput
          label="Email"
          style={{ marginTop: 12 }}
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
        <TextInput
          label="Ad Soyad"
          style={{ marginTop: 12 }}
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <TextInput
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


        <TextInput
          label="TC Kimlik No"
          style={{ marginTop: 18 }}
          value={countryIdentifier}
          onChangeText={(text) => setCountryIdentifier(text)}
          keyboardType="numeric"
          maxLength={11}
        />
        <TextInput
          label="Adres"
          style={{ marginTop: 12 }}
          value={adres}
          onChangeText={(text) => setAdres(text)}
        />
        <SelectPicker
          style={styles.list}
          onValueChange={(value) => setOgrSinif(value) }
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
                         label={selectedDate.getTime() !== -631152000000 ? (selectedDate.getDate() + "/" + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear()) : "Doğum Tarihi Seçiniz.."} />
            </View>
          </Pressable>

          {/* The date picker */}
          {isPickerShow && (
            <DateTimePicker
              value={selectedDate}
              mode={"date"}
              is24Hour={true}
              onChange={onChange}
              minimumDate={new Date(1950, 1, 1)}
              maximumDate={new Date(2020, 12, 31)}
            />
          )}
        </View>

        <SelectPicker
          style={styles.list}
          onValueChange={(value) => setFaculty(value)}
          selected={faculty}
          placeholder="Fakülte"
        >
          <SelectPicker.Item label="1" value="1" key="1" />
          <SelectPicker.Item label="2" value="2" key="2" />
          <SelectPicker.Item label="3" value="3" key="3" />
          <SelectPicker.Item label="4" value="4" key="4" />
        </SelectPicker>

        <SelectPicker
          style={styles.list}
          onValueChange={(value) => setDepartmant(value)}
          selected={departmant}
          placeholder="Bölüm"
        >
          <SelectPicker.Item label="1" value="1" key="1" />
          <SelectPicker.Item label="2" value="2" key="2" />
          <SelectPicker.Item label="3" value="3" key="3" />
          <SelectPicker.Item label="4" value="4" key="4" />
        </SelectPicker>

        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
        }}>
          <Button
            style={{ width: "100%", paddingTop: 6, paddingBottom: 6 }}
            theme={{ roundness: 3 }}
            mode="contained"
            disabled={ studentNumber === ""
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
