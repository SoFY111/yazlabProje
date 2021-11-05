import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/core";
import { Avatar, Button, TextInput, Title } from "react-native-paper";

import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { Icon } from "react-native-elements";

import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";


const AppealDetail = () => {

  const navigation = useNavigation();
  let appealUUID = useRoute().params.appealUUID; //Başvuru tipini tanımla (0, 1, 2, 3, 4 durumu .app.config.txt dosyasında belirtildi)
  const userId = useRoute().params.userId; //Başvuru tipini tanımla (0, 1, 2, 3, 4 durumu .app.config.txt dosyasında belirtildi)
  const [appealDetail, setAppealDetails] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const [userProfilePhotoURL, setUserProfilePhotoURL] = useState("");
  const [userFaculty, setUserFaculty] = useState("");
  const [userDepartman, setUserDepartman] = useState("");
  const [appealStatus, setAppealStatus] = useState(2);
  const [appealDescription, setAppealDescription] = useState("");

  const [description, setDescription] = useState("");

  useEffect(() => {
    console.log(appealUUID);
    firestore().collection("users")
      .doc(userId)
      .onSnapshot(docs => {
        setUserDetail(docs.data());
      });
  }, [userId]);

  useEffect(() => {
    firestore().collection("users")
      .doc(userId)
      .collection("appeals")
      .doc(appealUUID)
      .onSnapshot(docs => {
        setAppealDetails(docs.data());
        setAppealStatus(docs.data()?.result?.status);
        setAppealDescription(docs.data()?.result?.description);
      });

  }, []);

  useEffect(() => {
    if (userDetail?.profilePhoto !== null) {
      storage().ref("/images/userProfilePicture/" + userDetail?.profilePhoto).getDownloadURL().then(url => {
        setUserProfilePhotoURL(url);
      });
    }
  }, [appealDetail]);

  useEffect(() => {
    firestore().collection("faculties")
      .doc(userDetail?.faculty)
      .onSnapshot(docs => {
        setUserFaculty(docs.data()?.name);
      });

    firestore().collection("faculties")
      .doc(userDetail?.faculty)
      .collection("departmans")
      .doc(userDetail?.departmant)
      .onSnapshot(docs => {
        setUserDepartman(docs.data()?.name);
      });
  }, [appealDetail]);

  const getDownloadURLFromFirestoreURL = async (fileName) => {

    console.log(fileName);
    if (fileName !== undefined || fileName !== null) {
      const extension = fileName.split(".").pop();
      let task;

      if (extension === "pdf") task = storage().ref("pdf/" + appealUUID + "/" + fileName).getDownloadURL().then(url => openPdf(url, fileName));
      else if (extension === "jpg" || extension === "jpeg" || extension === "png") task = storage().ref("images/" + appealUUID + "/" + fileName).getDownloadURL().then(url => openPdf(url, fileName));
      else task = storage().ref("documents/" + appealUUID + "/" + fileName).getDownloadURL().then(url => openPdf(url, fileName));
      await task;
    }
  };

  const openPdf = (fileURL, fileName) => {
    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    const options = {
      fromUrl: fileURL,
      toFile: localFile,
    };
    RNFS.downloadFile(options).promise
      .then(() => FileViewer.open(localFile))
      .then(() => {
        // success
      })
      .catch(error => {
        console.log(error);
      });
  };

  const ignoreAppeal = async (appealUUID, userId, description) => {
    try {
      await firestore().collection("users")
        .doc(userId)
        .collection("appeals")
        .doc(appealUUID)
        .set({
          result: {
            status: 0,
            description: description,
          },
        }, { merge: true });

      await firestore().collection("adminAppeals")
        .doc(appealUUID)
        .set({
          result: {
            status: 0,
            description: description,
          },
        }, { merge: true });
      navigation.goBack();
    } catch (e) {
      console.log(e.message);
    }
  };

  const approveAppeal = async (appealUUID, userId, description) => {
    try {
      await firestore().collection("users")
        .doc(userId)
        .collection("appeals")
        .doc(appealUUID)
        .set({
          result: {
            status: 1,
            description: description,
          },
        }, { merge: true });


      await firestore().collection("adminAppeals")
        .doc(appealUUID)
        .set({
          result: {
            status: 1,
            description: description,
          },
        }, { merge: true });
      navigation.goBack();
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      <View style={{ padding: 8 }}>
        <Title style={{ marginBottom: 8 }}>Öğrenci Detayları</Title>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {userDetail?.profilePhoto === null ?
            <View style={{}}>
              <Avatar.Text label={userDetail?.name.split(" ").reduce((prev, current) => prev + current[0], "")} />
            </View> :
            <View style={{}}>
              <Avatar.Image size={88} source={{ uri: userProfilePhotoURL }} />
            </View>
          }

          <View style={{ flexDirection: "column" }}>
            <Text style={{ marginLeft: 12 }}>{userDetail?.studentNumber}</Text>
            <Text style={{ marginLeft: 12 }}>{userDetail?.name}</Text>
            <Text style={{ marginLeft: 12 }}>{userDetail?.ogrSinif}. Sınıf</Text>
            <Text style={{ marginLeft: 12 }}>{userDetail?.email}</Text>
            <Text style={{ marginLeft: 12 }}>{userDetail?.phoneNumber?.phoneInputValue}</Text>
            <Text style={{ marginLeft: 12 }}>{userFaculty} </Text>
            <Text style={{ marginLeft: 24 }}>{userDepartman} </Text>
          </View>

        </View>
      </View>
      <View style={{ padding: 8 }}>
        <Title style={{ marginBottom: 8 }}>Yüklenilen Dosyalar</Title>

        {appealDetail?.appealType === 0 ?
          <View style={{ flexDirection: "column", alignContent: "center" }}>
            <View style={styles.links}>
              <Text style={{ fontSize: 16 }}>Başvuru Dilekçesi</Text>
              <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileX)}>
                <Icon style={{
                  padding: 3,
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: appealDetail?.files?.fileX !== undefined ? appealDetail?.files?.fileX !== null ? "#5AA658" : "gray" : "gray",
                }} name="eye"
                      type="ionicon"
                      color={appealDetail?.files?.fileX !== undefined ? appealDetail?.files?.fileX !== null ? "#5AA658" : "gray" : "gray"}
                      size={15} />
              </Pressable>
            </View>

            <View style={styles.links}>
              <Text style={{ fontSize: 16 }}>Transkript</Text>
              <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileY)}>
                <Icon style={{
                  padding: 3,
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: appealDetail?.files?.fileY !== undefined ? appealDetail?.files?.fileY !== null ? "#5AA658" : "gray" : "gray",
                }} name="eye"
                      type="ionicon"
                      color={appealDetail?.files?.fileY !== undefined ? appealDetail?.files?.fileY !== null ? "#5AA658" : "gray" : "gray"}
                      size={15} />
              </Pressable>
            </View>

            <View style={styles.links}>
              <Text style={{ fontSize: 16 }}>Başarı Sıralaması</Text>
              <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileZ)}>
                <Icon style={{
                  padding: 3,
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: appealDetail?.files?.fileZ !== undefined ? appealDetail?.files?.fileZ !== null ? "#5AA658" : "gray" : "gray",
                }} name="eye"
                      type="ionicon"
                      color={appealDetail?.files?.fileZ !== undefined ? appealDetail?.files?.fileZ !== null ? "#5AA658" : "gray" : "gray"}
                      size={15} />
              </Pressable>
            </View>

            <View style={styles.links}>
              <Text style={{ fontSize: 16 }}>ÖSYM Belgesi</Text>
              <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileQ)}>
                <Icon style={{
                  padding: 3,
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: appealDetail?.files?.fileQ !== undefined ? appealDetail?.files?.fileQ !== null ? "#5AA658" : "gray" : "gray",
                }} name="eye"
                      type="ionicon"
                      color={appealDetail?.files?.fileQ !== undefined ? appealDetail?.files?.fileQ !== null ? "#5AA658" : "gray" : "gray"}
                      size={15} />
              </Pressable>
            </View>

            <View style={styles.links}>
              <Text style={{ fontSize: 16 }}>Yabancı Dil Belgesi</Text>
              <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileF)}>
                <Icon style={{
                  padding: 3,
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: appealDetail?.files?.fileF !== undefined ? appealDetail?.files?.fileF !== null ? "#5AA658" : "gray" : "gray",
                }} name="eye"
                      type="ionicon"
                      color={appealDetail?.files?.fileF !== undefined ? appealDetail?.files?.fileF !== null ? "#5AA658" : "gray" : "gray"}
                      size={15} />
              </Pressable>
            </View>
          </View> :
          appealDetail?.appealType === 1 ?
            <View style={{ flexDirection: "column", alignContent: "center" }}>
              <View style={styles.links}>
                <Text style={{ fontSize: 16 }}>DGS Yerleştirme Sonuç Belgesi</Text>
                <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileX)}>
                  <Icon style={{
                    padding: 3,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: appealDetail?.files?.fileX !== undefined ? appealDetail?.files?.fileX !== null ? "#5AA658" : "gray" : "gray",
                  }} name="eye"
                        type="ionicon"
                        color={appealDetail?.files?.fileX !== undefined ? appealDetail?.files?.fileX !== null ? "#5AA658" : "gray" : "gray"}
                        size={15} />
                </Pressable>
              </View>

              <View style={styles.links}>
                <Text style={{ fontSize: 16 }}>Önlisans Transkript</Text>
                <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileY)}>
                  <Icon style={{
                    padding: 3,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: appealDetail?.files?.fileY !== undefined ? appealDetail?.files?.fileY !== null ? "#5AA658" : "gray" : "gray",
                  }} name="eye"
                        type="ionicon"
                        color={appealDetail?.files?.fileY !== undefined ? appealDetail?.files?.fileY !== null ? "#5AA658" : "gray" : "gray"}
                        size={15} />
                </Pressable>
              </View>

              <View style={styles.links}>
                <Text style={{ fontSize: 16 }}>Ders İçerikleri</Text>
                <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileZ)}>
                  <Icon style={{
                    padding: 3,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: appealDetail?.files?.fileZ !== undefined ? appealDetail?.files?.fileZ !== null ? "#5AA658" : "gray" : "gray",
                  }} name="eye"
                        type="ionicon"
                        color={appealDetail?.files?.fileZ !== undefined ? appealDetail?.files?.fileZ !== null ? "#5AA658" : "gray" : "gray"}
                        size={15} />
                </Pressable>
              </View>

              <View style={styles.links}>
                <Text style={{ fontSize: 16 }}>Ders Planı Müfredatı</Text>
                <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileQ)}>
                  <Icon style={{
                    padding: 3,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: appealDetail?.files?.fileQ !== undefined ? appealDetail?.files?.fileQ !== null ? "#5AA658" : "gray" : "gray",
                  }} name="eye"
                        type="ionicon"
                        color={appealDetail?.files?.fileQ !== undefined ? appealDetail?.files?.fileQ !== null ? "#5AA658" : "gray" : "gray"}
                        size={15} />
                </Pressable>
              </View>

              <View style={styles.links}>
                <Text style={{ fontSize: 16 }}>Mezuniyet Belgesi</Text>
                <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileF)}>
                  <Icon style={{
                    padding: 3,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: appealDetail?.files?.fileF !== undefined ? appealDetail?.files?.fileF !== null ? "#5AA658" : "gray" : "gray",
                  }} name="eye"
                        type="ionicon"
                        color={appealDetail?.files?.fileF !== undefined ? appealDetail?.files?.fileF !== null ? "#5AA658" : "gray" : "gray"}
                        size={15} />
                </Pressable>
              </View>
            </View> :
            appealDetail?.appealType === 2 ?
              <View style={{ flexDirection: "column", alignContent: "center" }}>
                <View style={styles.links}>
                  <Text style={{ fontSize: 16 }}>Ders İçerikleri</Text>
                  <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileX)}>
                    <Icon style={{
                      padding: 3,
                      borderWidth: 1,
                      borderRadius: 4,
                      borderColor: appealDetail?.files?.fileX !== undefined ? appealDetail?.files?.fileX !== null ? "#5AA658" : "gray" : "gray",
                    }} name="eye"
                          type="ionicon"
                          color={appealDetail?.files?.fileX !== undefined ? appealDetail?.files?.fileX !== null ? "#5AA658" : "gray" : "gray"}
                          size={15} />
                  </Pressable>
                </View>

                <View style={styles.links}>
                  <Text style={{ fontSize: 16 }}>Ders Planı</Text>
                  <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileY)}>
                    <Icon style={{
                      padding: 3,
                      borderWidth: 1,
                      borderRadius: 4,
                      borderColor: appealDetail?.files?.fileY !== undefined ? appealDetail?.files?.fileY !== null ? "#5AA658" : "gray" : "gray",
                    }} name="eye"
                          type="ionicon"
                          color={appealDetail?.files?.fileY !== undefined ? appealDetail?.files?.fileY !== null ? "#5AA658" : "gray" : "gray"}
                          size={15} />
                  </Pressable>
                </View>

                <View style={styles.links}>
                  <Text style={{ fontSize: 16 }}>Transkript</Text>
                  <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileZ)}>
                    <Icon style={{
                      padding: 3,
                      borderWidth: 1,
                      borderRadius: 4,
                      borderColor: appealDetail?.files?.fileZ !== undefined ? appealDetail?.files?.fileZ !== null ? "#5AA658" : "gray" : "gray",
                    }} name="eye"
                          type="ionicon"
                          color={appealDetail?.files?.fileZ !== undefined ? appealDetail?.files?.fileZ !== null ? "#5AA658" : "gray" : "gray"}
                          size={15} />
                  </Pressable>
                </View>

                <View style={styles.links}>
                  <Text style={{ fontSize: 16 }}>ÖSYM Sonuç Belgesi</Text>
                  <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileQ)}>
                    <Icon style={{
                      padding: 3,
                      borderWidth: 1,
                      borderRadius: 4,
                      borderColor: appealDetail?.files?.fileQ !== undefined ? appealDetail?.files?.fileQ !== null ? "#5AA658" : "gray" : "gray",
                    }} name="eye"
                          type="ionicon"
                          color={appealDetail?.files?.fileQ !== undefined ? appealDetail?.files?.fileQ !== null ? "#5AA658" : "gray" : "gray"}
                          size={15} />
                  </Pressable>
                </View>
              </View> :
              appealDetail?.appealType === 3 ?
                <View style={{ flexDirection: "column", alignContent: "center" }}>
                  <View style={styles.links}>
                    <Text style={{ fontSize: 16 }}>Yaz Okulu Ders Dilekçesi</Text>
                    <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileX)}>
                      <Icon style={{
                        padding: 3,
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: appealDetail?.files?.fileX !== undefined ? appealDetail?.files?.fileX !== null ? "#5AA658" : "gray" : "gray",
                      }} name="eye"
                            type="ionicon"
                            color={appealDetail?.files?.fileX !== undefined ? appealDetail?.files?.fileX !== null ? "#5AA658" : "gray" : "gray"}
                            size={15} />
                    </Pressable>
                  </View>

                  <View style={styles.links}>
                    <Text style={{ fontSize: 16 }}>Okul Taban Puanları</Text>
                    <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileY)}>
                      <Icon style={{
                        padding: 3,
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: appealDetail?.files?.fileY !== undefined ? appealDetail?.files?.fileY !== null ? "#5AA658" : "gray" : "gray",
                      }} name="eye"
                            type="ionicon"
                            color={appealDetail?.files?.fileY !== undefined ? appealDetail?.files?.fileY !== null ? "#5AA658" : "gray" : "gray"}
                            size={15} />
                    </Pressable>
                  </View>

                  <View style={styles.links}>
                    <Text style={{ fontSize: 16 }}>Transkript</Text>
                    <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileZ)}>
                      <Icon style={{
                        padding: 3,
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: appealDetail?.files?.fileZ !== undefined ? appealDetail?.files?.fileZ !== null ? "#5AA658" : "gray" : "gray",
                      }} name="eye"
                            type="ionicon"
                            color={appealDetail?.files?.fileZ !== undefined ? appealDetail?.files?.fileZ !== null ? "#5AA658" : "gray" : "gray"}
                            size={15} />
                    </Pressable>
                  </View>

                  <View style={styles.links}>
                    <Text style={{ fontSize: 16 }}>Ders İçerikleri</Text>
                    <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileQ)}>
                      <Icon style={{
                        padding: 3,
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: appealDetail?.files?.fileQ !== undefined ? appealDetail?.files?.fileQ !== null ? "#5AA658" : "gray" : "gray",
                      }} name="eye"
                            type="ionicon"
                            color={appealDetail?.files?.fileQ !== undefined ? appealDetail?.files?.fileQ !== null ? "#5AA658" : "gray" : "gray"}
                            size={15} />
                    </Pressable>
                  </View>
                </View> :
                <View style={{ flexDirection: "column", alignContent: "center" }}>
                  <View style={styles.links}>
                    <Text style={{ fontSize: 16 }}>Transkript</Text>
                    <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileX)}>
                      <Icon style={{
                        padding: 3,
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: appealDetail?.files?.fileX !== undefined ? appealDetail?.files?.fileX !== null ? "#5AA658" : "gray" : "gray",
                      }} name="eye"
                            type="ionicon"
                            color={appealDetail?.files?.fileX !== undefined ? appealDetail?.files?.fileX !== null ? "#5AA658" : "gray" : "gray"}
                            size={15} />
                    </Pressable>
                  </View>

                  <View style={styles.links}>
                    <Text style={{ fontSize: 16 }}>Ders İçeriği</Text>
                    <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileY)}>
                      <Icon style={{
                        padding: 3,
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: appealDetail?.files?.fileY !== undefined ? appealDetail?.files?.fileY !== null ? "#5AA658" : "gray" : "gray",
                      }} name="eye"
                            type="ionicon"
                            color={appealDetail?.files?.fileY !== undefined ? appealDetail?.files?.fileY !== null ? "#5AA658" : "gray" : "gray"}
                            size={15} />
                    </Pressable>
                  </View>

                  <View style={styles.links}>
                    <Text style={{ fontSize: 16 }}>Ders Planı</Text>
                    <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileZ)}>
                      <Icon style={{
                        padding: 3,
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: appealDetail?.files?.fileZ !== undefined ? appealDetail?.files?.fileZ !== null ? "#5AA658" : "gray" : "gray",
                      }} name="eye"
                            type="ionicon"
                            color={appealDetail?.files?.fileZ !== undefined ? appealDetail?.files?.fileZ !== null ? "#5AA658" : "gray" : "gray"}
                            size={15} />
                    </Pressable>
                  </View>

                  <View style={styles.links}>
                    <Text style={{ fontSize: 16 }}>Muafiyet Dilekçesi</Text>
                    <Pressable onPress={async () => await getDownloadURLFromFirestoreURL(appealDetail?.files?.fileQ)}>
                      <Icon style={{
                        padding: 3,
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: appealDetail?.files?.fileQ !== undefined ? appealDetail?.files?.fileQ !== null ? "#5AA658" : "gray" : "gray",
                      }} name="eye"
                            type="ionicon"
                            color={appealDetail?.files?.fileQ !== undefined ? appealDetail?.files?.fileQ !== null ? "#5AA658" : "gray" : "gray"}
                            size={15} />
                    </Pressable>
                  </View>
                </View>
        }

        <View style={{ padding: 24 }}>
          <TextInput label={appealStatus !== 2 ? "Açıklama" : appealDescription}
                     value={appealStatus !== 2 ? appealDescription : description} disabled={appealStatus !== 2}
                     onChangeText={(text) => setDescription(text)} />
        </View>

      </View>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 12,
        position: "absolute",
        width: "100%",
        bottom: 0,
        left: 0,
      }}>
        <Button mode="contained" disabled={description === "" || appealStatus !== 2}
                style={{ backgroundColor: description === "" || appealStatus !== 2 ? "#D5D5D5" : "#cf3830" }}
                onPress={() => ignoreAppeal(appealUUID, userId, description)}><Text
          style={{ color: "#fff" }}>REDDET</Text></Button>
        <Button mode="contained" disabled={description === "" || appealStatus !== 2}
                onPress={() => approveAppeal(appealUUID, userId, description)}><Text style={{ color: "#fff" }}>KABUL
          ET</Text></Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  links: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 36,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default AppealDetail;
