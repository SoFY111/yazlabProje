import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Checkbox, Dialog, Portal } from "react-native-paper";

import DocumentPicker from "react-native-document-picker";

import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { useNavigation, useRoute } from "@react-navigation/core";
import { Icon } from "react-native-elements";

import getPath from "@flyerhq/react-native-android-uri-path";


const HorizontalAppealScreen = () => {
  const [fileX, setFileX] = useState([{ name: null, uri: null }]);
  const [fileY, setFileY] = useState([{ name: null, uri: null }]);
  const [fileZ, setFileZ] = useState([{ name: null, uri: null }]);
  const [fileQ, setFileQ] = useState([{ name: null, uri: null }]);
  const [isUploadedFileX, setIsUploadedFileX] = useState([{ name: null, uri: null }]);
  const [isUploadedFileY, setIsUploadedFileY] = useState([{ name: null, uri: null }]);
  const [isUploadedFileZ, setIsUploadedFileZ] = useState([{ name: null, uri: null }]);
  const [isUploadedFileQ, setIsUploadedFileQ] = useState([{ name: null, uri: null }]);
  const [fileUploadedLoader, setFileUploadedLoader] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [fileXisLoading, setFileXisLoading] = useState(false);
  const [fileYisLoading, setFileYisLoading] = useState(false);
  const [fileZisLoading, setFileZisLoading] = useState(false);
  const [fileQisLoading, setFileQisLoading] = useState(false);

  const [checked, setChecked] = useState(false);
  const [lastAcceptTermsAndConditions, setLastAcceptTermsAndConditions] = useState(false);
  const [percentCounter, setPercentCounter] = useState(0);
  const [userData, setUserData] = useState(null);
  const [appealUUID, setAppealUUID] = useState(useRoute().params?.appealUUID);
  const navigation = useNavigation();

  useEffect(() => {

    firestore().collection("users")
      .doc(auth().currentUser.uid)
      .get()
      .then(querySnapshot => {
        setUserData(querySnapshot.data());
      });
  }, []);

  useEffect(() => {
    firestore().collection("users")
      .doc(auth().currentUser.uid)
      .collection("appeals")
      .doc(appealUUID)
      .get()
      .then(querySnapshot => {
        console.log(querySnapshot.data()?.appealUUID);
        if (querySnapshot.exists) {
          if (querySnapshot.data()?.files.fileX) {
            setPercentCounter(percentCounter + 1);
            setFileX([{ name: querySnapshot.data()?.files?.fileX }]);
            setIsUploadedFileX([{ name: querySnapshot.data()?.files?.fileX }]);
          }
          if (querySnapshot.data()?.files.fileY) {
            setPercentCounter(percentCounter + 1);
            setFileY([{ name: querySnapshot.data()?.files?.fileY }]);
            setIsUploadedFileY([{ name: querySnapshot.data()?.files?.fileY }]);
          }
          if (querySnapshot.data()?.files.fileZ) {
            setPercentCounter(percentCounter + 1);
            setFileZ([{ name: querySnapshot.data()?.files?.fileZ }]);
            setIsUploadedFileZ([{ name: querySnapshot.data()?.files?.fileZ }]);
          }
          if (querySnapshot.data()?.files.fileQ) {
            setPercentCounter(percentCounter + 1);
            setFileQ([{ name: querySnapshot.data()?.files?.fileQ }]);
            setIsUploadedFileQ([{ name: querySnapshot.data()?.files?.fileQ }]);
          }
        }
      });
  }, []);


  const docPicker = async (type) => {
    if (type === "x") setFileY([{}]);
    else if (type === "y") setFileY([{}]);
    else if (type === "z") setFileZ([{}]);
    else if (type === "q") setFileQ([{}]);

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
        type: [DocumentPicker.types.allFiles],
      });

      if (type === "x") setFileX([{ name: res[0].name, uri: res[0].uri }]);
      else if (type === "y") setFileY([{ name: res[0].name, uri: res[0].uri }]);
      else if (type === "z") setFileZ([{ name: res[0].name, uri: res[0].uri }]);
      else if (type === "q") setFileQ([{ name: res[0].name, uri: res[0].uri }]);
      else if (type === "f") setFileF([{ name: res[0].name, uri: res[0].uri }]);

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
    else if (type === "y") file = fileY[0];
    else if (type === "z") file = fileZ[0];
    else if (type === "q") file = fileQ[0];

    let fileName = file.name;
    const fileUri = getPath(file.uri);
    const extension = fileName.split(".").pop();
    const name = fileName.split(".").slice(0, -1).join(".");

    fileName = userData.studentNumber + "_"
      + auth().currentUser.displayName.replace(" ", "-") + "_"
      + Date.now() + "_"
      + appealUUID + "_"
      + "file" + type.toUpperCase() + "."
      + extension;


    let task;

    if (extension === "pdf") task = storage().ref("pdf/" + appealUUID + "/" + fileName).putFile(fileUri);
    else if (extension === "jpg" || extension === "jpeg" || extension === "png") task = storage().ref("images/" + appealUUID + "/" + fileName).putFile(fileUri);
    else task = storage().ref("documents/" + appealUUID + "/" + fileName).putFile(fileUri);


    try {
      await task;
      if (type === "x") await firestore().collection("users")
        .doc(auth().currentUser.uid)
        .collection("appeals")
        .doc(appealUUID)
        .set({
          percent: (percentCounter + 1) / 4 * 100,
          files: {
            fileX: fileName,
          },
        }, { merge: true }).then(() => {
          setPercentCounter(percentCounter + 1);
          setFileXisLoading(false);
          setFileX([{ name: fileName, uri: null }]);
          setIsUploadedFileX([{ name: fileName }]);
          setFileUploadedLoader(true);
          setTimeout(() => {
            setFileUploadedLoader(false);
          }, 2000);
        });
      else if (type === "y") await firestore().collection("users")
        .doc(auth().currentUser.uid)
        .collection("appeals")
        .doc(appealUUID)
        .set({
          percent: (percentCounter + 1) / 4 * 100,
          files: {
            fileY: fileName,
          },
        }, { merge: true }).then(() => {
          setPercentCounter(percentCounter + 1);
          setFileYisLoading(false);
          setFileY([{ name: fileName, uri: null }]);
          setIsUploadedFileY([{ name: fileName }]);
          setFileUploadedLoader(true);
          setTimeout(() => {
            setFileUploadedLoader(false);
          }, 2000);
        });
      else if (type === "z") await firestore().collection("users")
        .doc(auth().currentUser.uid)
        .collection("appeals")
        .doc(appealUUID)
        .set({
          percent: (percentCounter + 1) / 4 * 100,
          files: {
            fileZ: fileName,
          },
        }, { merge: true }).then(() => {
          setPercentCounter(percentCounter + 1);
          setFileZisLoading(false);
          setFileZ([{ name: fileName, uri: null }]);
          setIsUploadedFileZ([{ name: fileName }]);
          setFileUploadedLoader(true);
          setTimeout(() => {
            setFileUploadedLoader(false);
          }, 2000);
        });
      else if (type === "q") await firestore().collection("users")
        .doc(auth().currentUser.uid)
        .collection("appeals")
        .doc(appealUUID)
        .set({
          percent: ((percentCounter + 1) / 4 * 100),
          files: {
            fileQ: fileName,
          },
        }, { merge: true }).then(() => {
          setPercentCounter(percentCounter + 1);
          setFileQisLoading(false);
          setFileQ([{ name: fileName, uri: null }]);
          setIsUploadedFileQ([{ name: fileName }]);
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

    const extension = fileName.split(".").pop();
    let fileExtensionPath;
    if (extension === "pdf") fileExtensionPath = "pdf";
    else if (extension === "jpg" || extension === "jpeg" || extension === "png") fileExtensionPath = "images";
    else fileExtensionPath = "documents";

    try {
      console.log(fileExtensionPath + "/" + appealUUID + "/" + fileName);
      await storage().ref(fileExtensionPath + "/" + appealUUID + "/" + fileName).delete()
        .then(() => {
            if (type === "x") {
              firestore().collection("users")
                .doc(auth().currentUser.uid)
                .collection("appeals")
                .doc(appealUUID)
                .set({
                  percent: (percentCounter - 1) / 4 * 100,
                  files: {
                    fileX: null,
                  },
                }, { merge: true }).then(() => {
                setPercentCounter(percentCounter - 1);
                setFileX([{ name: null, uri: null }]);
                setIsUploadedFileX([{ name: null }]);
              });
            } else if (type === "y") {
              firestore().collection("users")
                .doc(auth().currentUser.uid)
                .collection("appeals")
                .doc(appealUUID)
                .set({
                  percent: (percentCounter - 1) / 4 * 100,
                  files: {
                    fileY: null,
                  },
                }, { merge: true }).then(() => {
                setPercentCounter(percentCounter - 1);
                setFileY([{ name: null, uri: null }]);
                setIsUploadedFileY([{ name: null }]);
              });
            } else if (type === "z") {
              firestore().collection("users")
                .doc(auth().currentUser.uid)
                .collection("appeals")
                .doc(appealUUID)
                .set({
                  percent: (percentCounter - 1) / 4 * 100,
                  files: {
                    fileZ: null,
                  },
                }, { merge: true }).then(() => {
                setPercentCounter(percentCounter - 1);
                setFileZ([{ name: null, uri: null }]);
                setIsUploadedFileZ([{ name: null }]);
              });
            } else if (type === "q") {
              firestore().collection("users")
                .doc(auth().currentUser.uid)
                .collection("appeals")
                .doc(appealUUID)
                .set({
                  percent: (percentCounter - 1) / 4 * 100,
                  files: {
                    fileQ: null,
                  },
                }, { merge: true }).then(() => {
                setPercentCounter(percentCounter - 1);
                setFileQ([{ name: null, uri: null }]);
                setIsUploadedFileQ([{ name: null }]);
              });
            }
          },
        );
    } catch (e) {
      console.log(e.message);
    } finally {
      if (type === "x") setFileX([{ name: null, uri: null }]);
      else if (type === "y") setFileY([{ name: null, uri: null }]);
      else if (type === "z") setFileZ([{ name: null, uri: null }]);
      else if (type === "q") setFileQ([{ name: null, uri: null }]);
    }
  };

  const finishAppeal = async () => {
    try {
      await firestore().collection("users")
        .doc(auth().currentUser.uid)
        .collection("appeals")
        .doc(appealUUID)
        .set({
          isStart: 1,
          percent: 100,
        }, { merge: true });

      await firestore().collection("adminAppeals")
        .doc(appealUUID)
        .set({
          isStart: 1,
        }, { merge: true });
    } catch (e) {
      console.log(e.message);
    }
    navigation.navigate("Applications");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scv}>
        <Text>
          Kocaeli Üniversitesi Başarıya Dayalı ve Merkezi Puan (Ek Madde-1) ile Kurum İçi ve Kurumlar Arası Yatay
          Geçiş Başvurularına İlişkin Usul ve Esaslar
          (02.07.2018 tarihli senato toplantısında kabul edilmiştir.)
          Bu Usul ve Esaslar, Yükseköğretim Kurumlarında önlisans ve lisans düzeyindeki programlar arasında
          geçiş, çift anadal, yan dal ile kurumlar arası kredi transferi yapılması esaslarına ilişkin yönetmeliğin
          7 nci maddesinin ikinci fıkrası ve Ek Madde 1’e dayanılarak hazırlanmıştır.
          1-) Disiplin cezası alan öğrenciler başarıya dayalı yatay geçiş yapamazlar. Disiplin cezası almadıklarını
          başvuru sırasında belgelemeleri şarttır. Merkezi puanla (EK Madde-1) yatay geçiş yapacak olan
          öğrencilerin disiplin cezası alıp almadıklarına bakılmaz.
          2-) Tamamen/kısmen yabancı dil ile eğitim yapan veya öğretim dili Türkçe olan bölümden/ programdan,
          tamamen veya kısmen yabancı dil ile eğitim yapan bölümlere/programlara başarıya dayalı veya merkezi puanla
          (Ek Madde-1) kurum içi veya kurumlar arası yatay geçiş yapacak öğrencilerin başvuru sırasında; geldiği
          yükseköğretim kurumunda almış olduğu zorunlu veya isteğe bağlı yabancı dil hazırlık eğitimini
          başarmış olduklarını belgelemeleri veya Üniversitemiz tarafından yapılacak olan yabancı dil yeterlik
          sınavını başarmaları veya ulusal veya uluslararası geçerliliği olan yabancı dil sınavlarından aşağıdaki
          minimum puanları almış olduklarını belgelemeleri şarttır. Ancak, merkezi puanla (Ek Madde-1) hazırlık ve
          birinci sınıfa yatay geçiş yapacak öğrencilerin, Üniversitemiz tarafından yapılacak olan yabancı dil
          yeterlik sınavını başaramamaları veya ulusal/uluslararası geçerliliği olan yabancı dil sınavlarından
          minimum puanları almış olduklarını belgeleyememeleri durumunda, yatay geçiş sonrasında Üniversitemizde
          yabancı dil hazırlık eğitimi almaları zorunludur.
          Sınav Adı: KPDS,ÜDS,YDS,YÖKDİL TOEFL iBT
          PTE Akademik
          Minimum Puan: 50/100
          60/120 45/90
          3-) Tamamen veya kısmen yabancı dil ile eğitim yapan bölümden/programdan, merkezi puanla (Ek Madde-1)
          tamamen veya kısmen yabancı dil ile eğitim yapan bölüme/programa yatay geçiş hakkı kazanan, ancak
          geldiği yükseköğretim kurumunda yabancı dil hazırlık eğitiminde bir yıl başarısız olmuş öğrenciler
          için merkezi puanla (Ek Madde-1) yatay geçişten sonra en fazla bir yıl yabancı dil hazırlık eğitim hakkı
          daha verilir. Geldiği yükseköğretim kurumunda yabancı dil hazırlık eğitiminde iki yıl başarısız olmuş
          öğrencilerin, başvurusu kabul edilmez.
          4-) Başarıya dayalı kurum içi veya kurumlar arası yatay geçiş için, öğrencinin kayıt dondurduğu
          yarıyıl/yarıyıllar hariç olmak üzere, geçiş yapacağı yarıyıla kadar ders planında yer alan tüm
          derslerini almış ve başarmış olması ile birlikte ağırlıklı genel not ortalamasının (AGNO) 100 üzerinden
          en az 70 olması şarttır. Başvuruda bulunan öğrencilerin başarı sıralaması;
          (Ağırlıklı genel not ortalaması x 0,4) + (ÖSYM yerleştirme puanı x 0,6)
          formülüne göre yapılır. 4’lük ve 100’lük not dönüşümünde YÖK not dönüşüm tablosu kullanılır.
          Yurtdışı yatay geçiş kontenjanlarına başvuran öğrencilerin değerlendirilmesi sadece AGNO’ya göre
          yapılır.
          5-) Bir yükseköğretim kurumuna yerleştirilen önlisans öğrencileri yerleştirildikleri programda bir
          yarıyıl, lisans öğrencileri bir yıl öğrenim gördükten sonra, merkezi puanla (EK Madde-1) Üniversitemiz
          bölümlerine/programlarına kurum içi veya kurumlar arası yatay geçiş başvurusu yapabilir. Geldiği
          Yükseköğretim Kurumunda bir yarıyıl/yıl tamamlamamış olan öğrencilerin başvurusu kabul edilmez.
          6-) Kurum içi veya kurumlar arası, başarıya dayalı veya Ek Madde-1 kapsamındaki tüm yatay geçiş
          türlerinde, öğrenci geldiği Yükseköğretim Kurumu/Bölümü/Programı’nda tamamlamış olduğu aktif
          dönemin/yılın bir sonraki dönemi/yılı için açılmış olan kontenjana başvurabilir. Kayıt hakkı kazanan
          öğrencinin kaydı ve ders planı ataması, başvuru yaptığı dönem/yıl için yapılır. Örneğin; geldiği
          Yükseköğretim Kurumunda ikinci sınıfı tamamlamış bir lisans öğrencisi, üçüncü sınıf kontenjanına
          başvurabilir, kayıt hakkı kazanması halinde üçüncü sınıfa kaydı yapılır ve üçüncü sınıf ders planına
          tabi olur.
          7-) Merkezi puan (Ek Madde 1) kapsamında yapılan başvuruların değerlendirilmesinde yapılacak başarı
          sıralaması;
          [(Adayın ÖSYM puanı - Bölüm ÖSYM taban puanı) x 100] / Bölüm ÖSYM taban puanı
          formülüne göre yapılır.
          8-) Başvuru değerlendirme sonuçlarına itiraz, sonuçların ilanından sonraki ilk iki iş günü içerisinde
          mesai saatlerinde, ilgili bölüm/program başkanlıklarına yapılır.
          9-) 24 Nisan 2010 tarih ve 27561 sayılı Resmi Gazete’de yayımlanarak yürürlüğe giren “Yükseköğretim
          Kurumlarında Önlisans ve Lisans Düzeyindeki Programlar Arasında Geçiş, Çift Anadal, Yan Dal İle Kurumlar
          Arası Kredi Transferi Yapılması Esaslarına İlişkin Yönetmelik” ten önce kullanılmakta olan “Kocaeli
          Üniversitesi Önlisans ve Lisans Öğretimi Yatay Geçiş Yönergesi” yürürlükten kaldırılmıştır.
        </Text>
      </ScrollView>
      <View>
        <View style={styles.acceptTerms}>
          <Checkbox status={checked ? "checked" : "unchecked"}
                    onPress={() => {
                      setChecked(!checked);
                    }}

          />
          <Text>Okudum, anladım.</Text>
        </View>
        <View style={styles.content}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <View key={0}>
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
                onPress={() => docPicker("x")}
              >
                {fileX[0].name ? fileX.map(({ name, uri }) => {
                  return (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text>{name.length > 25 ? name.substring(0, 22) + "..." : name}</Text>
                      <TouchableOpacity style={{ marginLeft: 18 }}
                                        onPress={() => deleteFile("x", name)}>
                        <Icon name="close" type="ionicon" />
                      </TouchableOpacity>
                      <Button style={{ marginLeft: 4 }} mode="contained" loading={fileXisLoading}
                              onPress={async () => {
                                setFileXisLoading(true);
                                await uploadFile("x");
                              }
                              }><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  );
                }) : <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Ders
                  İçerikleri</Text>}
              </TouchableOpacity>
            </View>
            <View key={1}>
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
                onPress={() => docPicker("y")}
              >
                {fileY[0].name ? fileY.map(({ name, uri }) => {
                  return (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text>{name.length > 25 ? name.substring(0, 22) + "..." : name}</Text>
                      <TouchableOpacity style={{ marginLeft: 18 }}
                                        onPress={() => deleteFile("y", name)}>
                        <Icon name="close" type="ionicon" />
                      </TouchableOpacity>
                      <Button style={{ marginLeft: 4 }} mode="contained" loading={fileYisLoading}
                              onPress={async () => {
                                setFileYisLoading(true);
                                await uploadFile("y");
                              }}><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  );
                }) : <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Ders Planı
                  Müfredatı</Text>}
              </TouchableOpacity>
            </View>
            <View key={2}>
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
                onPress={() => docPicker("z")}
              >
                {fileZ[0].name ? fileZ.map(({ name, uri }) => {
                  return (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text>{name.length > 25 ? name.substring(0, 22) + "..." : name}</Text>
                      <TouchableOpacity style={{ marginLeft: 18 }}
                                        onPress={() => deleteFile("z", name)}>
                        <Icon name="close" type="ionicon" />
                      </TouchableOpacity>
                      <Button style={{ marginLeft: 4 }} mode="contained" loading={fileZisLoading}
                              onPress={async () => {
                                setFileZisLoading(true);
                                await uploadFile("z");
                              }}><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  );
                }) : <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Transkript</Text>}
              </TouchableOpacity>
            </View>
            <View key={3}>
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
                onPress={() => docPicker("q")}
              >
                {fileQ[0].name ? fileQ.map(({ name, uri }) => {
                    return (
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text>{name.length > 25 ? name.substring(0, 22) + "..." : name}</Text>
                        <TouchableOpacity style={{ marginLeft: 18 }}
                                          onPress={() => deleteFile("q", name)}>
                          <Icon name="close" type="ionicon" />
                        </TouchableOpacity>
                        <Button style={{ marginLeft: 4 }} mode="contained" loading={fileQisLoading}
                                onPress={async () => {
                                  setFileQisLoading(true);
                                  await uploadFile("q");
                                }}><Text
                          style={{ color: "#fff" }}>Yükle</Text></Button>
                      </View>
                    );
                  }) :
                  <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>ÖSYM Sonuç
                    Belgesi</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.nextButtonContainer}>
        <Text style={{ color: "#28A745" }}>{fileUploadedLoader ? "Dosya yüklendi." : ""}</Text>
        <Button mode="contained" onPress={() => setIsDialogVisible(true)}
                disabled={!checked || !isUploadedFileX[0].name || !isUploadedFileY[0].name || !isUploadedFileZ[0].name || !isUploadedFileQ[0].name}>
          <Text style={{ color: "#fff" }}>BAŞVURUYU TAMAMLA</Text>
        </Button>
      </View>
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
          <Dialog.Title>{"başvuruyu tamamla".toLocaleUpperCase()}</Dialog.Title>
          <Dialog.Content>
            <View style={styles.acceptTerms}>
              <Checkbox status={lastAcceptTermsAndConditions ? "checked" : "unchecked"}
                        onPress={() => {
                          setLastAcceptTermsAndConditions(!lastAcceptTermsAndConditions);
                        }}

              />
              <Text>Evrakları doğru doldurduğumu ve bana ait olduğunu onaylıyorum.</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Vazgeç</Button>
            <Button onPress={() => finishAppeal()}
                    disabled={!lastAcceptTermsAndConditions}>Onayla</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    paddingHorizontal: 24,
  },
  acceptTerms: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  scv: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0, .2)",
    borderRadius: 4,
    padding: 8,
  },
  nextButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "space-between",
    justifyContent: "space-between",
    marginVertical: 12,
  },
});


export default HorizontalAppealScreen;
