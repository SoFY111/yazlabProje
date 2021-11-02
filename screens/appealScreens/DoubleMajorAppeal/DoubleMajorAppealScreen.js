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


const DoubleMajorAppealScreen = () => {
  const [fileX, setFileX] = useState([{ name: null, uri: null }]);
  const [fileY, setFileY] = useState([{ name: null, uri: null }]);
  const [fileZ, setFileZ] = useState([{ name: null, uri: null }]);
  const [fileQ, setFileQ] = useState([{ name: null, uri: null }]);
  const [fileF, setFileF] = useState([{ name: null, uri: null }]);
  const [isUploadedFileX, setIsUploadedFileX] = useState([{ name: null, uri: null }]);
  const [isUploadedFileY, setIsUploadedFileY] = useState([{ name: null, uri: null }]);
  const [isUploadedFileZ, setIsUploadedFileZ] = useState([{ name: null, uri: null }]);
  const [isUploadedFileQ, setIsUploadedFileQ] = useState([{ name: null, uri: null }]);
  const [isUploadedFileF, setIsUploadedFileF] = useState([{ name: null, uri: null }]);
  const [fileUploadedLoader, setFileUploadedLoader] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [fileXisLoading, setFileXisLoading] = useState(false);
  const [fileYisLoading, setFileYisLoading] = useState(false);
  const [fileZisLoading, setFileZisLoading] = useState(false);
  const [fileQisLoading, setFileQisLoading] = useState(false);
  const [fileFisLoading, setFileFisLoading] = useState(false);

  const [checked, setChecked] = useState(false);
  const [lastAcceptTermsAndConditions, setLastAcceptTermsAndConditions] = useState(false);
  const [percentCounter, setPercentCounter] = useState(0);
  const [userData, setUserData] = useState(null);
  const [appealUUID, setAppealUUID] = useState(useRoute().params?.appealUUID);
  const navigation = useNavigation()

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
          if (querySnapshot.data()?.files.fileF) {
            setPercentCounter(percentCounter + 1);
            setFileF([{ name: querySnapshot.data()?.files?.fileF }]);
            setIsUploadedFileF([{ name: querySnapshot.data()?.files?.fileF }]);
          }
        }
      });
  }, []);


  const docPicker = async (type) => {
    if (type === "x") setFileY([{}]);
    else if (type === "y") setFileY([{}]);
    else if (type === "z") setFileZ([{}]);
    else if (type === "q") setFileQ([{}]);
    else if (type === "f") setFileF([{}]);

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
    else if (type === "f") file = fileF[0];

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
          percent: (percentCounter+1)/4*100,
          files: {
            fileX: fileName,
          },
        }, { merge: true }).then(() => {
          setPercentCounter(percentCounter + 1)
          setFileXisLoading(false)
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
          percent: (percentCounter+1)/4*100,
          files: {
            fileY: fileName,
          },
        }, { merge: true }).then(() => {
          setPercentCounter(percentCounter + 1)
          setFileYisLoading(false)
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
          percent: (percentCounter+1)/4*100,
          files: {
            fileZ: fileName,
          },
        }, { merge: true }).then(() => {
          setPercentCounter(percentCounter + 1)
          setFileZisLoading(false)
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
          percent: ((percentCounter+1)/4*100),
          files: {
            fileQ: fileName,
          },
        }, { merge: true }).then(() => {
          setPercentCounter(percentCounter + 1)
          setFileQisLoading(false)
          setFileQ([{ name: fileName, uri: null }]);
          setIsUploadedFileQ([{ name: fileName }]);
          setFileUploadedLoader(true);
          setTimeout(() => {
            setFileUploadedLoader(false);
          }, 2000);
        });
      else if (type === "f") await firestore().collection("users")
        .doc(auth().currentUser.uid)
        .collection("appeals")
        .doc(appealUUID)
        .set({
          files: {
            fileF: fileName,
          },
        }, { merge: true }).then(() => {
          setFileFisLoading(false)
          setFileF([{ name: fileName, uri: null }]);
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
                  percent: (percentCounter - 1)/4*100,
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
                  percent: (percentCounter - 1)/4*100,
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
                  percent: (percentCounter - 1)/4*100,
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
                  percent: (percentCounter - 1)/4*100,
                  files: {
                    fileQ: null,
                  },
                }, { merge: true }).then(() => {
                setPercentCounter(percentCounter - 1);
                setFileQ([{ name: null, uri: null }]);
                setIsUploadedFileQ([{ name: null }]);
              });
            } else if (type === "f") {
              firestore().collection("users")
                .doc(auth().currentUser.uid)
                .collection("appeals")
                .doc(appealUUID)
                .set({
                  files: {
                    fileF: null,
                  },
                }, { merge: true }).then(() => {
                setFileF([{ name: null, uri: null }]);
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
      else if (type === "f") setFileF([{ name: null, uri: null }]);
    }
  };

  const finishAppeal = async () => {
    try {
      await firestore().collection('users')
        .doc(auth().currentUser.uid)
        .collection('appeals')
        .doc(appealUUID)
        .set({
          isStart: 1,
          percent: 100
        }, {merge: true})
    }
    catch (e) {
      console.log(e.message)
    }
    navigation.navigate('Applications')
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scv}>
        <Text>
          KOCAELİ ÜNİVERSİTESİ ÇİFT ANADAL PROGRAMI YÖNETMELİĞİ
          BİRİNCİ BÖLÜM
          Amaç, Kapsam, Dayanak, Tanımlar ve Kısaltmalar
          MADDE 1 - (1) Bu Yönetmeliğin amacı, Kocaeli Üniversitesinde çift anadal programlarının açılmasına,
          başvuru ve kabul koşullarının belirlenmesine, yürütülmesine ve bitirilmesine ilişkin usul ve esasları
          düzenlemektir.
          Kapsam
          MADDE 2 - (1) Bu Yönetmelik, Kocaeli Üniversitesi çift anadal programlarına ilişkin hükümleri kapsar.
          Dayanak
          MADDE 3 - (1) Bu Yönetmelik;
          a) 2547 sayılı Yükseköğretim Kanununun 14 üncü maddesi,
          b) 24/4/2010 tarihli ve 27561 sayılı Resmi Gazete'de yayımlanan Yükseköğretim Kurumlarında Önlisans ve
          Lisans Düzeyindeki Programlar Arasında Geçiş, Çift Anadal, Yan Dal ile Kurumlar Arası Kredi Transferi
          Yapılması Esaslarına İlişkin Yönetmelik,
          c) 9/6/2017 tarihli ve 30091 sayılı Resmi Gazete'de yayımlanan Yükseköğretim Kurumlarında Önlisans ve
          Lisans Düzeyindeki Programlar Arasında Geçiş, Çift Anadal, Yan Dal ile Kurumlar Arası Kredi Transferi
          Yapılması Esaslarına İlişkin Yönetmelikte Değişiklik Yapılmasına Dair Yönetmelik hükümlerine
          dayanılarak hazırlanmıştır.
          Tanımlar ve kısaltmalar
          MADDE 4 - (1) Bu Yönetmelikte geçen;
          a) AKTS: Avrupa Kredi Transfer Sistemini,
          b) Birinci anadal: Öğrencinin, başvuru tarihinde kayıtlı bulunduğu önlisans veya lisans programını,
          c) Bölüm/Program: Kocaeli Üniversitesi lisans veya önlisans diploma programlarına öğrenci kabul eden
          akademik birimlerini, ç) ÇAP: Çift anadal programını,
          d) ÇAP Danışmanı: Öğrencilerin eğitim, öğretim ve diğer sorunlarıyla ilgilenmek üzere
          görevlendirilen öğretim elemanını,
          e) GNO: Genel not ortalamasını,
          f) İkinci anadal: Öğrencinin başvurduğu ve kabul edildiği ikinci lisans veya önlisans diploma
          programını,
          g) Kurul: Kocaeli Üniversitesine bağlı fakülte/yüksekokul/meslek yüksekokulları kurullarını,
          ğ) Rektör: Kocaeli Üniversitesi Rektörünü,
          h) Senato: Kocaeli Universitesi Senatosunu,
          ı) Üniversite: Kocaeli Üniversitesini.
          i) Yönetim Kurulu: Kocaeli Üniversitesine bağlı fakülte/yüsekokul/meslek yüksekokulların yönetim
          kurullarını,
          ifade eder.
          İKİNCİ BÖLÜM
          Çift Anadat Programına İlişkin Esaslar
          Çift anadal programının amacı
          MADDE 5 - (1) Çift anadal programının amacı, öğrenimini yüksek başarı seviyesinde sürdüren
          öğrencilere, Üniversitede yürütülen önlisans diploma programları ile diğer önlisans diploma
          programları arasında, lisans programları ile diğer lisans programları veya önlisans programları arasında
          öğrenim görme imkanı sağlamaktır.
          (2) Üniversite bölümleri/programları arasında ÇAP uygulanabilir. Bölümler/Programlar arası ÇAP,
          fakülte/yüksekokul/meslek yüksekokularının ilgili bölümlerinin/programlarının ÇAP komisyonları
          tarafından Yüksek Öğretim Alan Yeterlilikleri dikkate alınarak, hazırlanıp ilgili kurul kararı ile Senatoya
          sunulur. Senatoda onaylanan program, Üniversite akademik takviminde belirtilen tarihten itibaren uygulanır.
          Başvuru ve kabul koşulları
          MADDE 6-(1) ÇAP kontenjanları akademik yıl başlamadan, ilgili bölümlerin/programların görüşü alınarak,
          fakülte/yüksekokul/meslek yüksekokulları tarafından yarıyılın başlangıcından önce ilan edilir.
          (2) Başvuru anında anadal diploma programındaki GNO'su 4.00'lük not sisteminde en az 3.00 olan ve anadal
          diploma programının ilgili sınıfında başarı sıralaması itibariyle ilk %20'sinde bulunan öğrenciler ikinci
          anadal programına başvurabilir. Ayrıca aşağıdaki şartlar uyarınca fakülte/yüksekokul/meslek
          yüksekokulları kontenjan belirleyebilir ve öğrenciler bu şartlar kapsamında başvuru yapabilir;
          a) Çift anadal yapacak öğrencilerin kontenjanı, anadal diploma programındaki GNO'su en az 3.00 olmak
          şartıyla, anadal diploma programının ilgili sınıfında başarı sıralaması %20'sinden az olmamak üzere Senato
          tarafından belirlenir.
          b) Hukuk, Tıp ve Sağlık Programları ile Mühendislik Programları hariç olmak üzere, çift anadal yapılacak
          diğer ÇAP kontenjanları da bölümlerin/programların kontenjanının %20'sinden az olmamak üzere senato
          tarafından belirlenir.
          c) Anadal diploma programındaki GNO'su en az 3.00 olan ancak anadal diploma programının ilgili sınıfında
          başarı sıralaması itibariyle en üst %20'sinde yer almayan öğrencilerden çift anadal yapılacak
          bölümün/programın ilgili yıldaki taban puanından az olmamak üzere puana sahip olanlar da ÇAP'a
          başvurabilirler.
          (3) Başvuru sayısı kontenjandan fazla olduğu takdirde sıralamanın nasıl yapılacağı
          fakülte/yüksekokul/meslek yüksekokulunca önceden belirlenir ve kontenjan ilanı ile birlikte öğrencilere
          duyurulur.
          (4) Özel yetenek sınavı olan bir bölümde/programda ÇAP yapılacak ise öğrencinin, girişte özel yetenek
          sınavını başarması gerekir.
          (5) İkinci anadal programına başvuran öğrenciler, başvurdukları bölüm/program için ÖSYM kılavuzunda
          belirtilen veya ilgili birimler tarafından önceden belirlenmiş özel şartları sağlamalıdır.
          (6) Kayıtlı olduğu önlisans veya lisans bölümünden/programından başvurduğu tarih itibari ile alması
          gereken tüm dersleri alan ve başaran, ağırlıklı genel not ortalaması en az 3.00 olan öğrenciler ikinci
          anadal diploma programına;
          a) Anadal lisans diploma programında en erken üçüncü yarıyılın başında en geç ise dört yıllık
          programlarda beşinci yarıyılın başında, beş yıllık programlarda yedinci yarıyılın başında, altı yıllık
          programlarda ise dokuzuncu yarıyılın başında,
          b) Anadal önlisans diploma programında en erken ikinci yarıyılın başında, en geç ise üçüncü yarıyılın
          başında başvurabilir.
          (7) ÇAP için başvurular, birinci ve ikinci anadal fakülte/yüksekokul/meslek yüksekokullarına yazılı
          olarak yapılır. Kabul edilen öğrenciler, her iki anadala birden ders kayıtlarını yaptırırlar. ÇAP için
          başvuru takvimi Senato tarafından belirlenir.
          (8) En fazla iki programa ÇAP başvurusu yapılabilir. Birinci öğretim programı öğrencileri ikinci
          öğretime veya ikinci öğretim programı öğrencileri de birinci öğretim programlarına başvurabilirler.
          Ancak, birden fazla ikinci anadal diploma programına kayıt yapılmaz.
          (9) ÇAP’a başvurabilmek için öğrencinin herhangi bir disiplin cezası almamış olması gerekir.(12.05.2019
          30772RG)
          Programın yürütülmesi/uygulanması
          MADDE 7 - (1) Çift anadal programları ilgili bölümün/programın önerisi ile ilgili kurul tarafından her
          iki programda öğrencinin mezuniyetine veya ilişiğinin kesilmesine kadar ÇAP danışmanları tarafından
          izlenir.
          (2) ÇAP'a kabul edilen öğrenciler için her iki programın ÇAP danışmanları ilgili programların AKTS'sini,
          program yeterliklerini, derslerin amaç, içerik ve öğrenme kazanımlarını değerlendirerek öğrencinin
          çift anadal ders planını hazırlarlar. Bu ders planında, hem birinci anadal, hem de ikinci anadalda
          öğrencinin alması gereken tüm dersler yazılır. Her iki anadalın ÇAP danışmanları tarafından onaylanan bu
          ders planları ikinci anadalın ilgili bölüm/program ve yönetim kurulunda görüşülerek karara bağlanır.
          Yönetim kurulunca onaylanan ders planı ve Üniversitenin ÇAP Yönetmeliği, daha sonra öğrenciye imza
          karşılığı tebliğ edilir. Bu ders planı hazırlandıktan sonra öğrencinin herhangi bir dersten muafiyet
          isteği ya da plan dışında herhangi bir ders alma isteği değerlendirmeye alınmaz. Her iki anadaldan birinde
          Senato tarafından onaylanan ders planı ve içeriklerinde değişiklik olmadığı sürece hazırlanan çift
          anadal ders planında değişiklik yapılamaz.
          (3) ÇAP'a kayıtlı öğrencinin ikinci anadal programından alacağı derslerin toplam AKTS'si, ilgili programın
          toplam AKTS'sinin en az o/o35'i olmalıdır. Öğrencinin ikinci anadal programından alacağı herhangi bir ders,
          birinci anadal programında muaf tutulamaz veya herhangi bir dersin yerine sayılamaz. Öğrencinin birinci
          anadal programından aldığı herhangi bir ders, öğrencinin ders planında belirlenen ikinci anadal
          programından %35 AKTS'lik derslerin dışında sayılması şartı ile ikinci anadal programında seçmeli
          ders/dersler yerine sayılabilir.
          (4) ÇAP öğrencileri devam ettikleri her iki anadal programında da, yürürlükte olan Kocaeli Üniversitesi
          Önlisans ve Lisans Eğitim- Öğretim Yönetmeliğine tabidirler. Ancak çift anadal programı öğrencileri,
          her bir anadalda ayrı ayrı bir öğrencinin ders alma limitlerini kullanabilirler.
          (5) ÇAP öğrencileri, ikinci anadal bölüm/program başkanın onayı ile derslerinin ve sınavlarının
          çakışması durumunda ikinci anadalı yaptıkları bölümün/programın birinci ya da ikinci öğretim
          programından ders alabilir ve diğer öğretim sınav programında ilgili dersin sınavına girebilir. Buna
          rağmen sınav programlarının uygun olmaması durumunda bu öğrenciler için ikinci anadalı yaptıkları ilgili
          birimin yönetim kurulu kararıyla ayrı bir sınav takvimi de belirlenebilir.
          (6) Ara sınavlar için herhangi bir nedenle sağlık raporu alan bir öğrenci, her iki anadaldan da raporlu
          sayılır. Benzer şekilde izinli ya da mazeretli olarak yapılan değerlendirmeler her iki anadalı da kapsar.
          (7) Her iki anadalda İngilizce destekli eğitim yapılmakta ise ikinci anadalda %30 İngilizce ders alma
          koşulu aranmaz.
          (8) Türkçe eğitim yapan bir anadaldan, İngilizce destekli eğitim yapan ikinci anadala geçmek isteyen
          öğrencilerin İngilizce dil yeterliklerini belgelemeleri ön koşuldur. Senato tarafından belirlenen
          esaslara göre dil yeterliğini belgeleyen adaylar arasında, GNO dikkate alınarak sıralama yapılır. ÇAP
          kontenjanı dolmaması halinde, dil yeterliğini sağlayamayan adaylara, kendi imkanları ile dil yeterliğini
          sağlamaları için bir yıl süre verilir. Bu süre içerisinde dil yeterliğini veremeyen adaylar kesin kayıt
          hakkını kaybederler. İkinci anadal ÇAP danışmanı tarafından ikinci anadalda %30 İngilizce ders alma
          koşulu sağlanacak şekilde öğrenciye çift anadal ders planı hazırlanır. Ders planında ikinci anadalın
          yapıldığı lisans programına kayıtlı öğrencilerin öğrenim süreleri boyunca aldıkları İngilizce dersin
          AKTS eşdeğerinde dersin, ÇAP yapan öğrenci tarafından alınması sağlanır.
          Başarı değerlendirme ve kayıt silme
          MADDE 8 - (1) Öğrencinin kendi bölümünün/programının önlisans veya lisans programı ile çift anadal
          programının ayrılığı
          esastır. Ögrencinin birinci anadaldan mezuniyeti ÇAP nedeni ile etkilenmez. Birinci anadaldan mezun olan
          öğrenciye birinci anadal önlisans/lisans diploması verilir. Öğrencinin ikinci anadaldan mezuniyet
          diploması, ancak devam ettiği birinci anadal programından mezun olması halinde verilir.
          (2) ÇAP öğrencilerine, istedikleri takdirde, birinci anadal ve ikinci anadal programları için ayrı ayrı
          öğrenim belgesi verilir. Her bir öğrenim belgesinde sadece öğrencinin o anadala ait aldığı dersler
          gösterilir. İkinci anadaldan alınacak olan not durum belgesinde, öğrencinin ÇAP programına başladığı
          anadaldaki muaf tutulduğu dersler de gösterilir.
          (3) Öğrencilerin, her yarıyıl (yıllık ders planı uygulayan bölümlerde/programlarda yıl) sonunda
          bölümlerin/programların ÇAP danışmanları tarafından, birinci anadaldaki yarıyıl (yıllık ders planı
          uygulayan bölümlerde/programlarda yıl) sonu not ortalamaları ilgili

          yönetim kuruluna sunulur. Önlisans veya lisans öğrencilerinin ÇAP'a devam edebilmeleri ve mezun
          olabilmeleri için her yarıyıl (yıllık ders planı uygulayan bölümlerde/programlarda yıl) sonu itibarı ile
          birinci anadala ait GNO'nun en az 2.50 olması şartı aranır. Ancak, tüm ÇAP öğrenimi süresince
          öğrencinin birinci anadal genel not ortalaması bir defaya mahsus olmak üzere 2.00-2.49 arasında olabilir.
          GNO'su 2.00-2.49 arasında kalan öğrencilere ilgili fakülte/yüksekokul/meslek yüksekokul tarafından uyarı
          yazısı yazılarak programa devam etme hakkı tanınır. Genel not ortalaması ikinci kez 2.50'nin altına düşen
          öğrencinin ikinci anadal diploma programından ilgili yönetim kurulu kararı ile kaydı silinir.
          (4) Birinci anadal GNO'su 2.00'ın altına düşen öğrencinin ikinci anadal programından kaydı ilgili yönetim
          kurulu kararı ile silinir. (5) Öğrenciler, çift anadal programından kendi isteği ile ayrılabilir.
          (6) İkinci anadal programından iki yarıyıl (yıllık ders planı uygulayan bölümlerde/programlarda iki yıl)
          üst üste ders almayan
          öğrencinin ikinci anadal diploma programından kaydı silinir.
          (7) ÇAP’a kayıt yaptıran öğrencilerin öğrenim süresi içerisinde herhangi bir disiplin cezası almaları
          durumunda, disiplin cezası
          aldıkları yarıyıl sonu itibarıyla ikinci anadal programından ilgili yönetim kurulu kararı ile kayıtları
          silinir. (12.05.2019-30772 RG)
          Özel öğrenci
          MADDE 9 - (1) Geçerli mazereti ilgili kurul ve Senato onayı ile kabul edilen ÇAP öğrencisi, en fazla bir
          yarıyıl (yıllık ders planı
          uygulayan bölümlerde/programlarda bir yıl) başka bir yükseköğretim kurumunda özel öğrenci olarak
          devam edebilir. Ancak birinci anadal programından mezun olan ÇAP öğrencisi, başka bir yükseköğretim
          kurumunda özel öğrenci olarak devam edemez.
          Proje, staj, bitirme çalışması ve işyeri eğitimi uygulamaları
          MADDE 10, (1) ÇAP'ta hem birinci hem de ikinci anadala ait proje, staj ve bitirme çalışmalarının ayrı ayrı
          yapılması zorunlu olup muafiyeti yapılamaz. İşletmede Mühendislik/Mesleki Eğitim (İME) uygulamalarının
          eşdeğerliği ve ikinci anadalda hangilerinin, hangi içerikte ve sürelerde yapılması gerektiği,
          öğrencinin ikinci anadal yaptığı bölüm/program tarafından önerilir ve ilgili birimin yönetim kurulu
          tarafından karara bağlanır.
          Mezuniyet
          MADDE 11 - (1) ÇAP'taki başarı ve mezuniyet koşulları bu Yönetmeliğin ilgili maddelerine göre
          belirlenir.
          (2) ÇAP öğrencileri, sadece birinci anadal programında başarı sıralamasına tabi tutulur.
          (3) ÇAP süresi içinde birinci anadaldan mezun olan öğrencinin öğrencilik işlemleri, ikinci anadala ait
          bölüm/program ve
          fakülte/yüksekokul/meslek yüksekokul tarafından yürütülür..
          (4) Birinci anadaldan mezuniyet hakkını elde etmek koşulu ile çift anadal programını tamamlayan öğrenciye
          ayrıca ikinci anadalı
          yaptığı bölümün./programın önlisans veya lisans diploması verilir.
          Katkı payı
          MADDE 12 - (1) ÇAP'a tabi öğrenciler, birinci anadaldan mezun oluncaya kadar sadece birinci anadala ait,
          mezun olduktan sonra ise sadece ikinci anadala ait öğrenci katkı payını yürürlükteki yasal mevzuata uygun
          olarak öderler.
          ÜÇÜNCÜ BÖLÜM Çeşitli ve Son Hükümler
          Yürürlükten kaldırılan yönetmelik
          MADDE 13 - (1) 2016/2016 tarihli ve 29748 sayılı Resmi Gazete'de yayımlanan Kocaeli Üniversitesi Çift Anadal
          Programı Yönetmeliği yürürlükten kaldırılmıştır.
          Hüküm bulunmayan haller
          MADDE 14-(1) Bu Yönetmelikte hüküm bulunmayan hallerde; yürürlükte olan Kocaeli Üniversitesi Önlisans
          ve Lisans Eğitim- Öğretim Yönetmeliği, Kocaeli Üniversitesi Önlisans ve Lisans Programları İçin Özel
          Ögrenci Yönergesi ile Yükseköğretim Kurumlarında Önlisans ve Lisans Düzeyindeki Programlar Arasında
          Geçiş, Çift Anadal, Yan Dal ile Kurumlar Arası Kredi Transferi Yapılması Esaslarına İlişkin Yönetmelik
          hükümleri ve Senato kararları uygulanır.
          Geçici Hüküm
          Madde 1 – (1) ÇAP öğrencisinin bu Yönetmeliğin yürürlüğe girmesinden önce almış olduğu disiplin
          cezasından dolayı ikinci anadal programında kaydı silinmez. (12.05.2019-30772 RG)
          Yürürlük
          MADDE 15 - (1) Bu Yönetmelik, 2019-2020 eğitim-öğretim yılında yürürlüğe girer.
          Yürütme
          MADDE 16 - (1) Bu Yönetmelik hükümlerini Kocaeli Üniversitesi Rektörü yürütür
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
                }) : <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Başvuru
                  Dilekçesi </Text>}
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
                                setFileYisLoading(true)
                                await uploadFile("y");
                              }}><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  );
                }) : <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Transkript</Text>}
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
                                setFileZisLoading(true)
                                await uploadFile("z");
                              }}><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  );
                }) : <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Başarı
                  sıralaması</Text>}
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
                                  setFileQisLoading(true)
                                  await uploadFile("q");
                                }}><Text
                          style={{ color: "#fff" }}>Yükle</Text></Button>
                      </View>
                    );
                  }) :
                  <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>ÖSYM Belgesi</Text>}
              </TouchableOpacity>
            </View>
            <View key={4}>
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
                onPress={() => docPicker("f")}
              >
                {fileF[0].name ? fileF.map(({ name, uri }) => {
                  return (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text>{name.length > 25 ? name.substring(0, 22) + "..." : name}</Text>
                      <TouchableOpacity style={{ marginLeft: 18 }}
                                        onPress={() => deleteFile("f", name)}>
                        <Icon name="close" type="ionicon" />
                      </TouchableOpacity>
                      <Button style={{ marginLeft: 4 }} mode="contained" loading={fileFisLoading}
                              onPress={async () => {
                                setFileFisLoading(true)
                                await uploadFile("f");
                              }}><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  );
                }) : <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Yabancı Dil
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
    borderColor: 'rgba(0,0,0, .2)',
    borderRadius:4,
    padding:8,
  },
  nextButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "space-between",
    justifyContent: "space-between",
    marginVertical: 12,
  },
});


export default DoubleMajorAppealScreen;
