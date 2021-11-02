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


const ClassAdaptationAppealScreen = () => {
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
          T.C.
          KOCAELİ ÜNİVERSİTESİ MUAFİYET VE İNTİBAK YÖNERGESİ
          BiRiNCİ BÖLÜM
          Amaç, Kapsam, Dayanak ve Tanımlar
          MADDE 1- (1) Bu Yönergenin amacı; Yükseköğretim Kurulu tarafından denkliği kabul edilen bir önlisans veya lisans programından gelen öğrencilerin, Kocaeli Üniversitesinde önlisans ve lisans eğitim-öğretimi yapan fakülte, yüksekokul, meslek yüksekokul ve devlet konservatuarında ders muafiyet ve intibak usul ve esaslarını düzenlemektir,
          Kapsam
          MADDE 2- (1) Bu Yönerge, Kocaeli Üniversitesi muafiyet ve intibak uygulamalarına ilişkin usul ve esasları kapsar.
          Dayanak
          MADDE 3- (1) Bu Yönerge, 4/11/1981 tarihli ve 2547 sayılı Yükseköğretim Kanunu’un 14’üncü maddesine dayandırılarak hazırlanılmıştır.
          Tanımlar
          MADDE 4- (1) Bu Yönergede geçen;
          a) Akademik Birim: Eğitim-öğretim faaliyetinin yülrütüldüğü Fakülte/Yiiksekokul
          Meslek Yüksekokul/Devlet Konservatuarını,
          b) Bölüm: Eğitim _ öğretim faaliyetinin yürütüldüğü ilgili bölümü programı,
          c) Komisyon: İlgili akademik birimin ya da bölümün muafiyet ve intibak işlemlerini
          yürüten ve ders vermekle.yükümlü en az üç öğretim elemanından oluşan komisyonu,
          ç) Rektör: Kocaeli Üniversitesi Rektörünü,
          d) Senato: Kocaeli Üniversitesi Senatosunu,
          e) Üniversite: Kocaeli Üniversitesini (KOÜ),
          ifade eder.

          İKİNCİ BÖLÜM

          Muafiyet ve İntibak komisyonunun oluşturulmısı, Başvurular ve Başvuru Şartları, Ders Muafıyeti Değerlendirmesi ve Muafiyet Raporu,
          Muafiyet ve İntibakların Yapılması
          MADDE 5- (1) Komisyon, akademik birim tarafından ''Akademik Birim Komisyonu'' olarak oluşturulabileceği gibi, ilgili bölüm başkanı tarafından, bölüm başkanı veya bölüm başkan yardımcısının başkanlığında, ders vermekle yükümlü en az üç öğretim elemanından bölüm komisyonu olarak da oluşturulabilir.
          Muafiyet ve intibak başvuruları
          MADDE 6- (1) Muafiyet ve intibak başıurulan, kayıt yaptırılan eğitim-öğretim yılının/ yarıyılının en geç birinci haftası sonuna kadar ilgili bölüm başkanlıklanna şahsen yapılır. posta ile yapılan başvurular kabul edilmez. Başvuru yapan öğrenci istenen belgeleri eksiksiz teslim ettiğine ilişkin "evrak teslim tutanağını" imzalar. Evrakları teslim alan personel,
          Öğrenciye evraklarını teslim aldığına ilişkin bir belge verir. Başvuru sonuçları 15 gün içerisinde akademik birim yönetim kurulları tarafından karara bağlanır.
          (2) ÖSYM tarafından yapılan ek yerleştirmelerde ise mevzuata göre en kısa sürede işlem yapılır.
          (3) Bu Yönergenin 6 ncı maddesinin birinci fırkasında belirtilen zamanlar dışında muafiyet ve intibak başvurusunda bulunulamaz. Muafiyet ve intibak başvurusu sadece bir defaya mahsus yapılır.
          Ders muıfiyetine başvuru şartları
          MADDE 7- (l) Kocaeli Üniversitesinin herhangi bir birimine kayıt yaptıran bir öğrenci, aşağıdaki şartlan sağlaması durumunda, kayıt yaptırdığı bölüme ders muafiyet dilekçesi ile başvuruda bulunabilir.
          a) Öğrenci, muafiyet dilekçesinde, muaf olmak istediği dersleri belirtmeli,
          b) Dikey geçişle geldiğini veya daha önce Yükseköğretim Kurulu tarafından denkliği kabul edilen bir önlisans veya lisans programında eğitim gördüğünü, ders aldığını ve başarılı olduğunu transkript ile belgelemeli,
          c) Muafiyet talebinde bulunduğu dersler için, ders aldığı kurum tarafindan onaylanmış ders içeriğini ve ders kazanımlarını/öğrenme çıktılarını belgelemelidir.
          Ders muafiyeti değerlendirmesi
          MADDE 8- (1) Öğrencinin ders muafiyeti değerlendirilirken, eşdeğer programlardan gelen öğrenciler için; beyan edilen ders(ler)in, yarıyıl gözetilmeksizin, ilgili böliim müfredatındaki benzer içeriğe veya ders kazanımına/öğrenme çıktısına sahip olma şartı aranır.
          (2) Diğer programlardan gelen öğrenciler için; benzer ders kazanrmları/öğrenme çıktıları ve ders içeriği olmakla birlikte, ders(ler)in AKTS/kredi/saat değer(ler)inden herhangi birine eşdeğer olma şartı aranır.
          Muafiyet raporu
          MADDE 9- (1) Komisyon tarafından hazırlanan muafiyet raporu, komisyon üyelerinin imzası ve komisyon başkanının onayı ile ilgili akademik birim yönetim kuruluna sunulur. Yönetim kurulunun kararından sonra, muaf olunan veya muaf olunmayan derslere ilişkin detaylı muafiyet kararı, gerekçeleri ile birlikte ilgili öğrenciye ve Ögrenci İşleri Daire Başkanlığına bildirilir. Öğrenci, verilen listeyi sonraki ders seçimlerindIe kullanmak üzere saklamak ve danışmanını bu konuda bilgilendirmekle yükümlüdür.
          Muafıyet ve intibakın yapılması
          MADDE 10- (1) Muafiyeti yapılan öğrencinin, .ilgili şartları sağlaması ve talepte bulunması halinde üst yarıyıllara intibakı yapılabilir. Öğrencinin muafıyet ve intibakının yapılabilmesi için aşağıda belirtilen durumlar göz önüne alınır:
          a) Öğrenci önlisans/lisans mezunu iken ÖSYM sınavlarına tekrar girerek Üniversiteye kaydını yaptırması halinde, mezun olduğu böltimdeki 4'lük sistem üzerinden notu 2'nin altnda başarılı olduğu derslerden CC harf nofu ile muaf sayılır.
          b) Öğrenim gördüğü bölümden mezun olmadan ÖSYM sınav sonuçları veya yatay geçiş ile kayıt yaptıran öğrenciler için, 4'lü sistem üzerinden notu 2'nin altında başarlı olduğu ders değerlendirilirken genel not ortalamasına bakılır. Genel not ortalaması 2'nin altında ise öğrenci o dersten muaf edilmez; 2 ve üzerinde ise başarılı ve CC harf notu ile muaf sayılır.
          c) Öğrenci başka bir üniversiteden muaf/yeterlİ/başarılı gibi değerlendirmeler ile gelmiş ise;
          1) Öğencinin bu derslerin notunu belgelendirmesi halinde, o notun kaışılığı koü not sistemine dönüştiirüliir; belgelendirememesi durumunda ise o dersleıe KOÜ not sistemindeki CC harf notu verilir.
          2) Muaf olunan dersler, yarıyıl içi ortalamalanna katılmaz (bu derslerin başansı %10 hesaplamalarında dikkate alınmaz). Ancak genel not ortalamasına katılır.
          ç) Öğrencinin önlisans/lisans programından mezun olması veya öğrenim gördüğü bölüm/programdan mezun olmadan ÖSYM sınavına tekar girerek Üniversiteye kaydını yaptırması halinde, tüm yarıyıllara/yıllara ait toplam muaf olunan derslerin her bir 40 AKTS değeri için bir üst sınıfa intibakı yapılır, Bu şekildeki intibaklar; önlisans programları için en fazla 3. yarıyıla, lisans programlan için ise en fazla 5. yarıyıla yapılır.
          (2) İntibakı yapılan bir öğrenci, intibak ettirildiği yarıyıldan önceki yanyıllara ait muaf olmadığı dersleri almak zorundadır.
          (3) Yatay/Dikey geçişlerle veya Yükseköğretim Kurumlarında Önlisans ve Lisans Düzeyindeki Programlar Arasında Geçiş, Çift Anadal, Yan Dal ile Kurumlar Arası Kredi Transferi Yapılması Esaslanna İlişkin Yönetmelik kapsamında nakil yoluyla Üniversiteye gelen öğrencilerin, alt yarıyıllardan muaf olmadıkları dersleri almak koşuluyla, geldikleri yarıyıl/yıla kayıtları yapılır. Bu şekilde Üniversiteye gelen öğrencilerden bu Yönergenin 10 uncu maddesinin (ç) bendinde belirtilen 40 AKTS koşulu aranmaz.
          (4) Daha önce öğrenim gördüğü bir üniversitede yaptığı stajı belgeleyen ve kaydını yaptırdığı birimin Staj Komisyonu tarafından stajı onaylanan öğrencinin, staj dersinin kredi karışılıkları ile muafiyeti yapılır,
          (5) Öğrencinin transkriptinde başarılı olduğu bir ders, birden fazla derse veya birden fazla başarılı olduğu dersler bir derse eşdeğer sayılabilir. Bu durumda; birden fazla dersin bir derse eşdeğer olması halinde başarılı olunan derslerin ağırlıklı not ortalaması muaf olunan dersin başarı notu; bir dersin birden fazla derse eşdeğer olması durumunda ise başarılı olunan dersin notu, muaf olunan diğer derslerin başan notu olarak yazılır.
          İtiraz
          MADDE 11-(1) Muafiyet kararının ilanından itibaren 3 (üç) iş gtinü içerisinde öğrenci muafiyet kararına ilgili bölüm/program başkanlığına dilekçe ile itirazda bulunabilir. İtiraz başvurusu komisyon tarafından 10 (on) gün içerisinde sonuçlandırılarak, ilgili yönetim kurulu tarafından karara bağlanır.
          ÜÇÜNCÜ BÖLÜM
          Son Hükümler
          Hüküm bulunmayan haller
          MADDE 12- (1) Bu Yönergede hüküm bulunmayan hallerde, ilgili mevzuat hükümleri ile Senato kararları uygulanır.

          Yürürlük
          MADDE 13- (1) Bu Yönerge, 2019-2020 eğitim-öğretim yılından itibaren yürürlüğe girer, Bu Yönergenin_ yürürlüğe girmesi ile 16/11/2016 tarihli ve 2 nolu Senato kararıyla kabul edilen Kocaeli Üniversitesi Muafiyet ve İntibak Yönergesi yürürlülükten kaldırılmıştır.

          Yürütme
          MADDE 14- (1) Bu Yönerge hükümlerini Kocaeli Üniversitesi Rektörü yürütür.
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
                }) : <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Transkript</Text>}
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
                }) : <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Ders İçeriği</Text>}
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
                }) : <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Ders Planı</Text>}
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
                  <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Muafiyet Dilekçesi</Text>}
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


export default ClassAdaptationAppealScreen;
