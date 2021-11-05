import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Title } from "react-native-paper";
import { Icon } from "react-native-elements";

import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { useRoute } from "@react-navigation/core";
import auth from "@react-native-firebase/auth";

const StudentAppealDetail = () => {
  const [appealDetail, setAppealDetails] = useState([]);
  let appealUUID = useRoute().params.appealUUID;

  useEffect(() => {
    firestore().collection("users")
      .doc(auth().currentUser.uid)
      .collection("appeals")
      .doc(appealUUID)
      .onSnapshot(docs => {
        setAppealDetails(docs.data());
      });
  }, []);

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


  return (
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

      {appealDetail?.result?.status !== 2 ?
        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", marginTop: 25 }}>
          <Title style={{ fontSize: 26 }}>Başvuru Sonucu</Title>
          <Text>{appealDetail?.result?.description}</Text>
        </View>
        : <></>}

    </View>
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


export default StudentAppealDetail;
