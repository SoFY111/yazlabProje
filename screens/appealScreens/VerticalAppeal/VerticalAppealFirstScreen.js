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


const VerticalAppealFirstScreen = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [lastAcceptTermsAndConditions, setLastAcceptTermsAndConditions] = useState(false);
  const [percentCounter, setPercentCounter] = useState(0);
  const [userData, setUserData] = useState(null);
  const [appealUUID, setAppealUUID] = useState(useRoute().params.appealUUID);
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
          KOCAELİ ÜNİVERSİTESİ ÖN LİSANS VE LİSANS
          EĞİTİM-ÖĞRETİM YÖNETMELİĞİ
          BİRİNCİ BÖLÜM
          Amaç, Kapsam, Dayanak ve Tanımlar
          Amaç
          MADDE 1 – (1) Bu Yönetmeliğin amacı; Kocaeli Üniversitesinin Devlet Konservatuvarı, Tıp ve Diş Hekimliği Fakülteleri dışındaki fakülte, yüksekokul, meslek yüksekokulları ve Rektörlüğe bağlı bölümlerde ön lisans ve lisans düzeyinde eğitim-öğretim ile ilgili esasları düzenlemektir.
          Kapsam
          MADDE 2 – (1) Bu Yönetmelik; Kocaeli Üniversitesinin Devlet Konservatuvarı, Tıp ve Diş Hekimliği Fakülteleri dışındaki fakülte, yüksekokul, meslek yüksekokullarında ve Rektörlüğe bağlı bölümlerde, ön lisans ve lisans eğitim-öğretim programlarının düzenlenmesine, öğrenci kabulüne, ölçme ve değerlendirmelerin yapılmasına, akademik danışmanlığa, diplomaya, devamlı ve geçici ayrılma işlemlerine, staj, mesleki uygulama, bitirme çalışması ve diğer öğretim çalışmalarına ilişkin hükümleri kapsar.
          Dayanak
          MADDE 3 – (1) Bu Yönetmelik, 4/11/1981 tarihli ve 2547 sayılı Yükseköğretim Kanununun 14 üncü, 44 üncü ve 46 ncı maddelerine dayanılarak hazırlanmıştır.
          Tanımlar
          MADDE 4 – (1) Bu Yönetmelikte geçen;
          a) Akademik danışman: Bir öğrenciye, Üniversiteye kayıt oluşundan itibaren Üniversiteyle ilişiği kesilene kadar geçen süre içinde; kayıt, eğitim-öğretim çalışmaları ve öğrencinin Üniversitedeki yaşamı ile ilgili problemlerinde yardımcı olmak ve öğrenciyi yönlendirmek üzere, ilgili bölüm/program başkanı tarafından görevlendirilen öğretim elemanını,
          b) AKTS: Avrupa Kredi Transfer Sistemini,
          c) Ağırlıklı Genel Not Ortalaması (AGNO): Katsayısı olmayan başarı notları hariç olmak üzere, öğrencinin almış olduğu tüm derslerdeki başarı notlarına karşılık gelen katsayılar ile bu derslerin AKTS değerlerinin çarpımının, öğrencinin aldığı derslerin toplam AKTS değerine bölümü ile hesaplanan ortalamayı,
          ç) Çalışma yükü: İlgili ders için öğrencilerin tüm öğrenme faaliyetlerini tamamlamalarında gerekli olan zamanı,
          d) Ders: Öğretim planında yer alan ve haftalık program çerçevesinde öğretim elemanı/elemanları tarafından yürütülen ve elli dakika süren eğitim-öğretim çalışmasını,
          e) E-ders: Öğretim içeriği ve materyallerinin, internet/intranet ya da bir bilgisayar ağı üzerinden sunulduğu, öğrencilerin ise öğreticiler ve diğer öğrenciler ile birlikte bu ortama eş zamanlı ve/veya eş zamansız katılım göstererek öğrenmelerini gerçekleştirdiği, zaman ve mekân bağımlılığı olmayan ve en az otuz dakika süren elektronik ders uygulamasını,
          f) Eğitim-öğretim çalışmaları: Bir yarıyıl/yılı kapsayan ders içi ve ders dışı her türlü etkinlik, seminer, alan uygulamaları, mesleki öğretim uygulamaları, bitirme çalışmaları ve benzeri çalışmaları,
          g) Eğitim-öğretim çalışmaları yükü: Her yarıyıl/yıl için eğitim-öğretim planında gösterilen o yarıyıl/yıla ait eğitim-öğretim çalışmalarını,
          ğ) Eğitim-öğretim planı: Yükseköğretim Kurulunun ilgili program için tespit ettiği asgari eğitim-öğretim çalışmalarını ve ilgili kurullarca onaylanan, tümüyle başarıldığında ilgili diplomanın alınmasına hak kazandıran eğitim-öğretim etkinliklerinin tümünü,
          h) Eğitim-öğretim yılı: Ara sınav haftası hariç en az on dört haftalık güz ve bahar eğitim-öğretim yarıyıllarından veya en az yirmi sekiz haftalık bir eğitim-öğretim yılından oluşan dönemi,
          ı) ÖBS: Öğrenci Bilgi Sistemini,
          i) Öğrenci İşleri Daire Başkanlığı: Kocaeli Üniversitesi Öğrenci İşleri Daire Başkanlığını,
          j) Öğrenme kazanımları: Bir dersin öğrenme sürecinin başarı ile tamamlanması sonrası öğrencilerin edindiği bilgi ve becerileri,
          k) Rektör: Kocaeli Üniversitesi Rektörünü,
          l) Senato: Kocaeli Üniversitesi Senatosunu,
          m) Üniversite: Kocaeli Üniversitesini,
          ifade eder.
          İKİNCİ BÖLÜM
          Eğitim-Öğretim ile İlgili Esaslar
          Eğitim-öğretim süresi ve düzeyleri
          MADDE 5 – (1) Üniversitenin tüm birimleri tarafından uygulanacak akademik takvim Senato tarafından kararlaştırılır.
          (2) Ön lisans düzeyi dört yarıyıllık bir eğitim-öğretimi, lisans düzeyi ise sekiz yarıyıllık veya dört tam yıllık bir eğitim-öğretimi kapsar.
          (3) Bu Yönetmelik hükümlerine göre meslek yüksekokullarında dört yarıyıllık bir eğitim-öğretim programını tamamlayan öğrencilere meslek yüksekokulu diploması, fakülte ve yüksekokullarda sekiz yarıyıllık veya dört tam yıllık bir eğitim-öğretim programını tamamlayan öğrencilere lisans diploması verilir.
          (4) Herhangi bir nedenle fakülte veya yüksekokul ile ilişiği kesilen öğrencilerden, ilk dört yarıyıla veya ilk iki yıla ait zorunlu ve seçmeli derslerin tümünden başarılı olanlara talepleri halinde ilgili birimlerin yönetim kurulu kararı ile ön lisans diploması verilir. Bu haktan; öğrenciliğini devam ettirmesine engel bir suçtan hüküm giyenler ve 38 inci maddenin birinci fıkrasının (b) bendine göre Üniversite ile ilişiği kesilenler yararlanamaz. Bir yıl süreli yabancı dil hazırlık sınıfı ve izinli geçirilen süreler hariç; kayıt olduğu programa ilişkin derslerin verildiği dönemden başlamak üzere, her yarıyıl için kayıt yaptırıp yaptırmadığına bakılmaksızın öğrenim süresi iki yıl olan ön lisans programlarından azami dört yıl, öğrenim süresi dört yıl olan lisans programlarından azami yedi yıl, öğrenim süresi beş yıl olan lisans programlarından azami sekiz yıl içinde mezun olamayanlar için ilgili mevzuat hükümleri uygulanır.
          (5) 18/8/2012 tarihli ve 28388 sayılı Resmî Gazete’de yayımlanan Yükseköğretim Kurumları Öğrenci Disiplin Yönetmeliği hükümleri uyarınca uzaklaştırma cezası uygulanan öğrencilerin uzaklaştırıldıkları süreler eğitim-öğretim süresinden sayılmaz.
          ÜÇÜNCÜ BÖLÜM
          Kayıt ve Kabul Esasları
          Öğrenci kaydı
          MADDE 6 – (1) Üniversiteye kayıtla ilgili işlemler Öğrenci İşleri Daire Başkanlığı tarafından yürütülür. Özel yetenek gerektiren programların sınavları ile seçme ve yerleştirme işlemleri, Yükseköğretim Kurulu kararları çerçevesinde Üniversite tarafından ilgili birimlerce yapılır.
          (2) Kayıt tarihi, kayıt süresi ve gerekli belgeler, Öğrenci İşleri Daire Başkanlığınca duyurulur. Kayıt için adaylardan istenen belgelerin aslı veya Üniversite tarafından onaylı örneği kabul edilir. Askerlik durumu ve adli sicil kaydına ilişkin olarak ise adayın yazılı beyanına dayanılarak işlem yapılır. Kayıt için ilgili mevzuat hükümlerine uygun olarak başvuru yapmayan adaylar kayıt hakkını kaybeder. Kayıt için sunulan belgelerde eksiklik veya tahrifat olduğunun belirlenmesi veya öğrencinin başka bir yükseköğretim kurumuna kayıtlı olması veya başka bir yükseköğretim kurumundan çıkarma cezası almış olması hallerinde, kesin kayıt yapılmış olsa bile kayıt iptal edilir.
          Tanıtım
          MADDE 7 – (1) Yeni kayıt yaptıran öğrencilere Üniversiteyi tanıtmak amacıyla, eğitim-öğretim yılının ilk ayı içerisinde Üniversitenin Basın Yayın ve Halkla İlişkiler Müdürlüğü ve ilgili dekanlıklar veya müdürlükler tarafından ortak tanıtım programları düzenlenir. Tanıtım programlarının takvimi ve kapsamı ile ilgili ayrıntılar akademik birimlerce kayıt döneminden önce açıklanır.
          Akademik danışmanlık
          MADDE 8 – (1) Yeni kayıt yaptıran her öğrenci için kayıtlı oldukları bölüm/program başkanlığı tarafından birinci yarıyıl/yıl derslerinin başlamasından en az yedi gün önce bir öğretim elemanı akademik danışman olarak atanır ve ÖBS’de duyurulur.
          (2) Akademik danışmanlığın yürütülmesine ilişkin esaslar Senato tarafından belirlenir.
          Yatay geçiş
          MADDE 9 – (1) Yurt içi ya da yurt dışındaki bir yükseköğretim kurumundan Üniversitenin eşdeğer öğretim programı uygulayan bir bölümüne/programına geçmek isteyen öğrenciler, 24/4/2010 tarihli ve 27561 sayılı Resmî Gazete’de yayımlanan Yükseköğretim Kurumlarında Önlisans ve Lisans Düzeyindeki Programlar Arasında Geçiş, Çift Anadal, Yan Dal ile Kurumlar Arası Kredi Transferi Yapılması Esaslarına İlişkin Yönetmelik hükümlerine göre fakülte, yüksekokul veya meslek yüksekokulunun ilgili bölümlerine/programlarına yatay geçiş yapabilirler. Kontenjanlar ve başvuru süreleri, akademik yarıyıl/yıl başlamadan en az bir ay önce Rektörlük tarafından duyurulur.
          Bölümler/programlar arası geçiş
          MADDE 10 – (1) Öğrencilerin bölümler/programlar arası geçişleri, Yükseköğretim Kurumlarında Önlisans ve Lisans Düzeyindeki Programlar Arasında Geçiş, Çift Anadal, Yan Dal ile Kurumlar Arası Kredi Transferi Yapılması Esaslarına İlişkin Yönetmelik hükümlerine göre yapılır.
          (2) Öğrenciler; öğrenim gördükleri fakülte, yüksekokul veya meslek yüksekokulunun başka bir bölümüne/programına geçiş yapabilir. Bu geçişler, Senato tarafından belirlenen esaslar çerçevesinde ayrı kontenjan belirlenerek yapılır.
          Dikey geçiş
          MADDE 11 – (1) Meslek yüksekokulu mezunlarının Üniversiteye bağlı lisans programlarına dikey geçişleri, yükseköğretim mevzuatına göre yapılır. Bu öğrencilerin uyum ve hazırlık programları, ilgili akademik birimin yönetim kurulu kararları doğrultusunda ilgili bölüm başkanlığı tarafından yapılır.
          Derse kayıt ve kayıt yenileme
          MADDE 12 – (1) Her yarıyıl/yıl başında ve akademik takvimde belirtilen süreler içinde ÖBS üzerinden tüm öğrenciler kayıtlarını yenilemek ve derslere kaydolmak zorundadır. Ders kayıtları, öğrencinin akademik danışmanının onayı ile kesinleşir. Öğrenciler; derslere kayıt, kayıt yenileme ve varsa katkı payı/öğrenim ücreti ödeme yükümlülüklerini yerine getirmekten sorumludur.
          (2) Öğrenciler, akademik takvimde belirtilen süreler içinde ÖBS üzerinden yeni bir derse kayıt yaptırabilir veya kayıt yaptırdıkları bir dersi bırakabilir. Öğrenci, ders kayıt işlemlerinde, önceki yarıyıl/yıllardan hiç almadığı ve başarısız olduğu dersleri, öncelikle en alt yarıyıl/yıldaki derslerden başlayarak almak zorundadır.
          (3) Öğrencilerin kayıt yaptırdıkları derslere ilişkin itirazlarını, akademik takvimde belirlenen süreler içerisinde ilgili bölüm/program başkanlıklarına yapmaları gerekir.
          (4) Akademik takvimde belirlenen sürede ders kaydını yenilemeyen öğrenciler, o yarıyıl/yılda derslere ve sınavlara giremez. Bu süre, öğrenim süresinden sayılır.
          (5) Mazereti nedeni ile süresi içinde kaydını yaptıramayanlar, yarıyıl/yıl derslerinin başlangıcından itibaren ilk iki hafta sonuna kadar öğrencisi olduğu bölüm/program başkanlığına bir dilekçe ile başvuruda bulunur. Mazereti, bağlı olduğu birimin yönetim kurulunca kabul edilen öğrenciler, ders kayıtlarını ilgili yönetim kurulu kararını izleyen haftanın son mesai gününün bitimine kadar yaptırmak zorundadır.
          Kayıtların tutulması
          MADDE 13 – (1) Öğrencilerin öğrenim bilgilerinin izlenebilmesi ve kontrolünün sağlanabilmesi amacıyla her öğrenci için Öğrenci İşleri Daire Başkanlığı tarafından kayıtlar ÖBS’de tutulur. Öğrencilerle ilgili kayıtların güncellenmesinden, arşivlenmesinden Öğrenci İşleri Daire Başkanlığı sorumludur.
          DÖRDÜNCÜ BÖLÜM
          Dersler, Krediler, Devam Koşulu, Ölçme ve Değerlendirme, Sınavlar,
          Notlar ve Diploma
          Dersler
          MADDE 14 – (1) Dersler, zorunlu ve seçmeli olmak üzere iki gruba ayrılır. Her öğrenci kayıtlı olduğu bölümün/programın zorunlu derslerini almakla yükümlüdür. Seçmeli dersler; bölüm/program seçmeli dersleri ve Üniversite seçmeli dersleri olmak üzere iki gruba ayrılır. Öğrenciler, seçmeli dersleri ilgilerine ve akademik danışman önerilerine göre ilan edilen listeden kontenjan dâhilinde kendileri belirler. Belirlenen bu dersler danışman onayı ile geçerlilik kazanır.
          (2) Ön koşullu ders/dersler, bir derse kayıt olabilmek için daha önce başarılmış olması gereken ders/derslerdir. Ön koşullu ders/dersler anabilim dalı veya ilgili bölüm/program akademik kurulu tarafından fakülte, yüksekokul veya meslek yüksekokulu kuruluna önerilir ve kurulun kararı Senato onayından sonra kesinleşir. Ön koşullu ders/dersler eğitim-öğretim programında belirtilir.
          (3) Süren çalışma; yarıyıl/yıl boyunca devam eden, ölçme ve değerlendirmesi yarıyıl/yıl sonu değerlendirme dönemi sonuna kadar sürebilecek çalışmadır.
          (4) Stajlar, öğrencilerin ders kayıt dönemlerinde alabilecekleri azami AKTS değerinin toplamına katılmaz.
          Üniversite seçmeli dersleri
          MADDE 15 – (1) Üniversite seçmeli dersleri; öğrencilerin bilgi ve becerileri ile ilgi ve yeteneklerine uygun nitelik ve çeşitlilikte, toplumsal hizmet, tarih, kültür ve sanat duyarlılığı ile spor ve sağlık faaliyetleri, çevre bilinci, bilim ve teknoloji alanlarına odaklanan, bağımsız çalışabilme, sorumluluk alabilme, öğrenmeyi öğrenebilme ve yönetebilme, iletişim gibi anahtar/aktarılabilir yeterliliklerini geliştirmek amacıyla açılan derslerdir.
          (2) Üniversite seçmeli dersleri, ön lisans ve lisans programlarında açılabilir. Bu derslerin açılması, seçilmesi, kayıt işlemleri ve yürütülmesi ile ilgili esaslar Senato tarafından belirlenir.
          Derslerin AKTS değeri
          MADDE 16 – (1) Bir dersin ilgili ders koordinatörü tarafından belirlenen öğrenme kazanımları için gerekli çalışma yükü dersin AKTS değerini ifade eder. Derslerin AKTS değeri, öğrencilerin çalışma yükleri hesaplanarak belirlenir.
          (2) Her dersin, ders saati ve AKTS’si öğretim planında belirtilir. Dersin AKTS’si öğrencinin dönem çalışma yükü temel alınarak ders koordinatörü tarafından belirlenir. Ders planı ile birlikte derslerin saati ve AKTS’si ilgili bölüm/program kurulunun önerisi üzerine fakülte/yüksekokul/meslek yüksekokul kurul kararı ile belirlenir ve Senatoda onaylanır. Bir öğrencinin bir yarıyıl/yılda alacağı eğitim-öğretim çalışmaları yükü ders planında gösterildiği kadardır.
          (3) Bir eğitim-öğretim yılında ön lisans ve lisans programları için ders ve uygulama kredisi toplamı 60 AKTS’dir. İki yıllık ön lisans programlarında ders ve uygulama kredisi toplamı 120 AKTS, dört yıllık lisans programlarında ise ders ve uygulama kredisi toplamı 240 AKTS, beş yıllık lisans programlarında ise ders ve uygulama kredisi toplamı 300 AKTS’dir.
          (4) Öğrenci, kayıtlı olduğu ilgili yarıyıl/yıldaki bölüm/program için belirtilen AKTS değeri kadar ders alır. Öğrencinin AGNO’su 2.00’ın altında ise öğrenci bir yarıyılda en fazla 30 AKTS değerinde ders alabilir. Yıllık ders planı uygulanan programlarda bu değer en fazla 60 AKTS olabilir. AGNO’su 2.00 ve üzerinde olan öğrenciler için alınacak AKTS değeri, en fazla 1/3 oranında Senato tarafından belirlenen usul ve esaslara göre artırılabilir.
          Devam koşulu
          MADDE 17 – (1) Öğrenci, ilk kez kayıt yaptırdığı teorik derslerin en az %70’ine, diğer öğretim türlerinin de en az %80’ine devam etmek zorundadır.
          (2) Teori ile uygulama/laboratuvar çalışmaları birlikte yapılan dersler için; teorik ders saati, uygulama/laboratuvar ders saatinden fazla veya uygulama/laboratuvar ders saati, teorik ders saatinden fazla ise birinci fıkrada belirtilen devam koşulu, ders saati fazla olana göre uygulanır. Teori ile uygulama/laboratuvar ders saatlerinin eşit olması durumunda ise en az %70 devam koşulu aranır.
          (3) Teori ile uygulama/laboratuvar çalışmaları birlikte yapılan derslerden başarısız olunması ve bu dersin tekrar alınması halinde; teori ile uygulama/laboratuvar ders saatlerinin eşit olması veya uygulama/laboratuvar ders saatinin teorik ders saatinden fazla olması durumunda, devam koşulu tekrar aranır.
          (4) Dersin tamamı laboratuvar ve/veya uygulamalı olarak yapılıyorsa, bu derslerden başarısız olunması ve dersin tekrar alınması durumunda devam koşulu tekrar aranır.
          (5) Devam koşulu daha önce sağlanmış olan teorik dersin/derslerin tekrarı halinde devam koşulu ile programdaki ders çakışma durumu dikkate alınmaz.
          (6) Öğrencilerin derse devamları, sorumlu öğretim elemanı tarafından yoklamalarla imza karşılığı tespit edilir. Devam durumu yarıyıl/yıl sonu akademik takvimde belirtilen derslerin tamamlandığı haftanın son gününe kadar ilgili öğretim elemanı tarafından ÖBS’de ilan edilir.
          Ölçme ve değerlendirme
          MADDE 18 – (1) Öğrencinin ders başarısı; yarıyıl/yıl içi sınavları, projeler, seminerler, arazi çalışmaları, kısa sınavlar, ödevler, uygulamalar, laboratuvar çalışmaları ve benzeri araçlardan oluşan yarıyıl/yıl içi ve yarıyıl/yıl sonu değerlendirme araçları ile ölçülür. Yarıyıl/yıl içi ve yarıyıl/yıl sonu çalışmalarının her biri 100 puan üzerinden değerlendirilir. Sınavlar akademik takvimde belirlenen sınav tarihlerinde dersin sorumlu öğretim elemanı tarafından yapılır. Öğretim elemanının zorunlu izinli veya raporlu olması gibi özel durumlarda sınavın yapılması için ilgili bölüm/program başkanı tarafından bir öğretim elemanı görevlendirilir. Sınav programları sınav tarihinden en az üç hafta önce ilgili bölüm/program başkanlıkları tarafından öğrencilere duyurulur.
          (2) Talep etmeleri halinde engelli öğrencilerin sınavları, engellerine göre sözlü veya yanlarına görevli verilerek yazılı olarak yapılır. Ayrıca ilgili birimlerin yönetim kurulu kararı ile engellerine göre farklı türlerde de sınav yapılabilir.
          (3) Not ortalamasına katılmayan dersler ve değerlendirilmesi not ile yapılmayan eğitim-öğretim çalışmaları eğitim-öğretim planında önceden belirtilir.
          Yarıyıl/yıl içi ölçme ve değerlendirme
          MADDE 19 – (1) Bir dersin yarıyıl/yıl içi değerlendirmesi ara sınav, proje, seminer, sunum, arazi çalışması, kısa sınav, ödev, uygulama, laboratuvar çalışması ve benzeri araçlarla yapılır.
          (2) Yarıyıl/yıl içi değerlendirmelerin başarı notuna katkısı %30’dan az, %70’ten fazla olamaz. Sadece yarıyıl/yıl sonu sınavı yapılan uygulamalı derslerde, yarıyıl/yıl sonu sınavının başarı notuna katkısı %100’dür. Uzaktan öğretim yöntemi ile verilen derslerde, yarıyıl içi değerlendirmelerin başarıya etkisi en fazla %20, yarıyıl sonu değerlendirmesi ise en az %80 olmak zorundadır. Tek ders sınavı dışındaki tüm sınavlarda öğrencilerin başarı notlarının hesaplanmasında yarıyıl/yıl içi etkinliklerinden alınan puanlar dikkate alınır. Ancak tek ders sınavının başarı notuna katkısı %100’dür. Yarıyıl/yıl içi değerlendirme ağırlığı, ilgili öğretim elemanı tarafından derse yazılma ve kayıt haftasından önce belirlenir ve ÖBS üzerinden yarıyıl/yıl dersleri başlamadan önce öğrencilere duyurulur. Bir dersin dönem sonu notu ÖBS’de ilan edilen bu kriterlere göre hesaplanır.
          (3) Ara sınavlar akademik takvimde belirtilen tarihler içinde yapılır. Süren çalışmanın ölçme ve değerlendirilmesi en geç yarıyıl/yıl sonu değerlendirme dönemi sonunda başarı notuna çevrilir.
          (4) Bir sınıfın alan dersleri için bir günde ikiden fazla sınav yapılmayacak şekilde sınav programı hazırlanır.
          (5) 2547 sayılı Kanunun 5 inci maddesinin birinci fıkrasının (ı) bendinde belirtilen bütün derslerin sınavları aynı oturum içerisinde merkezi sınav yöntemi ile yapılabilir. Bir sınıfın bu kapsamda yapılacak sınav sayısı ikiden fazla ise dördüncü fıkrada belirtilen alan sınavları aynı gün içerisinde yapılmaz.
          Yarıyıl/yıl sonu ölçme ve değerlendirme
          MADDE 20 – (1) Yarıyıl/yıl sonu sınavı, yarıyıl/yıl bitiminden sonra akademik takvimde belirtilen tarihler arasında ilan edilen bir program çerçevesinde yapılır.
          (2) Öğrencinin yarıyıl/yıl sonu ölçme ve değerlendirmeye girebilmesi için aşağıdaki şartları yerine getirmesi gerekir:
          a) Kaydını yenilemiş ve derse kayıt işlemlerini tamamlamış olmak.
          b) Varsa öğrenim katkı payı/öğrenim ücreti yükümlülüklerini akademik takvimde belirtilen süre içinde yerine getirmiş olmak.
          c) Her yarıyıl/yıl başında dersin ilgili bölüm/program başkanlığı tarafından ilan edilen yarıyıl/yıl içi çalışmalarını yerine getirmiş olmak.
          ç) 17 nci maddede belirtilen devam koşullarını sağlamak.
          (3) Öğrenci, yarıyıl/yıl sonu sınavına girmediği ya da başarı notu (DC), (DD), (FD) veya (FF) olan ders/dersler için bütünleme sınavlarına girebilir. Bu durumda ilgili ders veya dersler için alınan en son sınav puanı o dersin yarıyıl/yıl sonu puanı yerine geçer. Bütünleme sınavları sonunda, AGNO’su en az 2.00 olan ve mezuniyetine tek dersi kalan öğrenciye, ilgili ders için devam koşulunu sağlamış olmak şartıyla tek ders sınav hakkı verilir.
          Mazeret sınavı ve ek sınav
          MADDE 21 – (1) Mazeret sınavı, ara sınavı için geçerlidir. Öğrencinin bir dersten mazeret sınavına alınıp alınmayacağı ilgili akademik birimin yönetim kurulunca karara bağlanır.
          (2) Hastalık nedeniyle ara sınavlara giremeyen öğrencilerin durumlarını, sağlık kurumlarınca verilen sağlık raporu ile belgelemeleri gerekir. Üçüncü dereceye kadar yakınlarının ölümü, doğal afet ve benzeri durumlarda mazeretlerini belgeleyen öğrenciler de mazeret sınavı hakkından yararlanır.
          (3) Mazerete gerekçe olan belgelerin, son ara sınav tarihinden itibaren 10 işgünü içinde bölüm/program başkanlığına verilmesi gerekir. Bu sürenin aşılması halinde başvurular işleme konulmaz. Mazeret sınavına girmeyen öğrencilere yeni bir mazeret sınav hakkı verilmez.
          (4) Ülkemizi, uluslararası öğrenciler için kendi ülkesini ve Üniversiteyi temsil etmek için görevlendirilen öğrencilere, katılamadıkları her sınav için ilgili akademik birimin yönetim kurulunca ek sınav hakkı verilir.
          (5) Mazeret sınavları, akademik takvimde belirtilen tarihlerde, bölüm/program başkanlıklarınca belirlenen programa göre yapılır.
          (6) Öğrenci, raporlu olduğu tarih aralığında hiçbir sınava giremez. Bu tarih aralığında girilen sınav/sınavlar geçersiz sayılır.
          Tek ders sınavı
          MADDE 22 – (1) 20 inci maddedeki şartları yerine getirmiş olmak kaydıyla mezuniyetlerine tek dersi kalan öğrenciler, akademik takvimde belirlenen tarihlerde tek ders sınavlarına girerler. Bu sınavlarda alınan puan, başarı notunun değerlendirilmesi konusunda Senato tarafından belirlenen usul ve esaslara göre harf notuna dönüştürülür ve başarı notu olarak sayılır. Bu sınavlara ilk defa girecek öğrencilerden katkı payı/öğrenim ücreti alınmaz. Başarısız öğrenciler, daha sonraki haklarını kullandıklarında katkı payı/öğrenim ücreti ödemeye devam ederler. Bu sınavda başarılı olanlar, başlayacak olan yarıyıl/yıldan önceki yarıyıl/yılda mezun olmuş sayılırlar.
          (2) AGNO’su 2.00 ve üzerinde ise tek ders sınavından başarılı kabul edilmek için en az (DC) harf notu almak zorunludur. Sınavda alınan not, o dersin yarıyıl/yıl sonu başarı notu yerine geçer.
          Değerlendirme sonuçlarının duyurulması
          MADDE 23 – (1) Ölçme ve değerlendirme sonuçları, ölçme tarihini izleyen ilk yedi gün içinde öğretim elemanı tarafından ilan edilir. Yarıyıl/yıl sonu değerlendirme sonuçları, ÖBS’ye girildikten sonra imzalı bir kopya halinde bölüm/program başkanlığına teslim edilir.
          (2) Her yarıyıl/yılın sonunda ilgili fakülte, yüksekokul ve meslek yüksekokulu kurulu, ders ve diğer çalışmaların değerlendirmesini yapar.
          Başarı notu
          MADDE 24 – (1) Öğrencilerin, aldıkları her ders için yarıyıl/yıl sonu notu 100 puan üzerinden hesaplanır. Bu not, başarı notunun değerlendirilmesi konusunda Senato tarafından belirlenen usul ve esaslara göre ÖBS tarafından harf notuna dönüştürülür.
          (2) Bu Yönetmelikte belirtilen başarı notları dışında başka bir başarı notu kullanılamaz. Başarı notları ve bunlara karşılık gelen katsayılar aşağıdaki gibidir:
          Başarı Notu         Katsayı
          AA                         4.00
          BA                         3.50
          BB                         3.00
          CB                         2.50
          CC                         2.00
          DC                         1.50
          DD                         1.00
          FD                         0.50
          FF                          0.00
          D                            0.00
          N                            0.00
          E
          G
          K
          S
          (3) Yukarıda belirtilen harf notları aşağıdaki gibi tanımlanır:
          a) Bir dersten (AA), (BA), (BB), (CB) ve (CC) harf notlarından birini alan öğrenci ilgili dersten başarılı; (DD), (FD), (FF), (D), (N) ve (K) başarı notu alan öğrenci ise ilgili dersten başarısız sayılır.
          b) Öğrencinin bir dersten (DC) harf notu alması halinde bu dersin başarılı sayılıp sayılmamasına ilgili yarıyıl sonunda, yıllık program uygulayan akademik birimlerde ise ilgili yıl sonunda karar verilir. Bu karar verilirken, öğrencinin ilgili yarıyıl/yıl sonu AGNO’suna bakılır. Yarıyıl/yıl sonu AGNO’su 2.00 ve üzerinde ise öğrenci bu dersten başarılı sayılır. Aksi durumda öğrenci bu dersten başarısız sayılır ve öğrenci tekrar eden yarıyıl/yıllarda bu dersi almak zorundadır.
          c) AGNO’su 3.00 ve üzerinde olan ve herhangi bir ders başarı notu (DC) harf notundan düşük olmayan bir öğrenci danışmanının onayıyla üst dönemlerden ders alabilir.
          ç) (D) harf notu: Devam koşullarını sağlamayan öğrencilere (D) harf notu verilir.
          d) (E) harf notu: Yarıyıl/yıl içi ve yarıyıl/yıl sonu sınavları ile diğer değerlendirmelere girmeyen öğrencilere (E) harf notu verilir.
          e) (N) harf notu: (E) harf notu ilgili dönem sonunda (N) harf notuna otomatik olarak dönüşür.
          f) (G) harf notu: Not ortalamasına girmeyen eğitim-öğretim çalışmalarında başarılı olan öğrencilere (G) harf notu verilir.
          g) (K) harf notu: Not ortalamasına girmeyen eğitim-öğretim çalışmalarında başarılı olamayan öğrencilere (K) harf notu verilir.
          ğ) (S) harf notu: Süren çalışmanın ölçme ve değerlendirilmesi en geç yarıyıl/yıl sonu değerlendirme dönemi sonunda başarı notuna çevrilir.
          (4) Öğrenci değişimi, yatay ve dikey geçiş gibi nedenlerle öğrencilerin sunacakları notların bu Yönetmelikteki harf notlarına dönüştürülmesi, Senato tarafından belirlenen esaslar çerçevesince ilgili bölümün intibak komisyonu tarafından yapılır ve ilgili akademik birimin yönetim kurulu tarafından karara bağlanır.
          Değerlendirme sonuç belgelerinin saklanması
          MADDE 25 – (1) Değerlendirme sonuç belgelerinin bir kopyası ilgili bölüm/program başkanlığında beş yıl süre ile saklanır.
          Ölçme belgelerinin saklanması
          MADDE 26 – (1) Ölçme belgeleri, devam çizelgeleri ile birlikte bölüm/program başkanlıkları tarafından iki yıl süre ile saklanır. Bu süre sonunda ilgili dekanlık, yüksekokul veya meslek yüksekokulu müdürlüğü tarafından bir tutanakla imha edilir.
          Notlarda maddi hata ve sınav sonuçlarına itiraz
          MADDE 27 – (1) Öğrenci; sınav sonuçlarının duyurulmasından itibaren üç işgünü içinde bağlı olduğu fakülte dekanlığına, yüksekokul veya meslek yüksekokulu müdürlüğüne bir dilekçe ile başvurarak sınav kâğıdının yeniden incelenmesini isteyebilir. Dekanlık veya müdürlük maddi bir hata yapılıp yapılmadığının belirlenmesi için sınav kâğıdını ilgili bölüm/program başkanı aracılığıyla dersin sorumlu öğretim elemanına inceletir ve sonucu öğrenciye tebliğ eder. Öğrencinin itirazının devamı halinde bu itiraz tebliğ tarihinden itibaren üç işgünü içerisinde yapılabilir. Bu durumda; ilgili fakülte, yüksekokul veya meslek yüksekokulu yönetim kurulu kararı ile sorumlu öğretim elemanının dâhil olmadığı, ilgili alandaki öğretim elemanlarından oluşan en az üç kişilik bir komisyonda cevap anahtarıyla ve/veya diğer sınav kâğıtları ve dokümanları ile karşılaştırmalı olarak yeniden esastan inceleme yapılır. Not değişiklikleri ilgili fakülte, yüksekokul veya meslek yüksekokulu yönetim kurulu kararı ile kesinleşir. Not değişikliği ile ilgili yönetim kurulu kararı Öğrenci İşleri Daire Başkanlığına bildirilir.
          (2) ÖBS’de açıklanan başarı notları ile ilişkili herhangi bir maddi hatanın yapılmış olduğunun belirlenmesi halinde, ilgili öğretim elemanı ilgili bölüm/program başkanına başvurarak düzeltme talebinde bulunur. Bu talep, ilgili fakülte, yüksekokul veya meslek yüksekokulu bölüm/program başkanlığınca değerlendirilir. Eğer varsa not değişikliği veya düzeltmeler yönetim kurulunda görüşülüp karara bağlanır. Yönetim kurulu kararı Öğrenci İşleri Daire Başkanlığına bildirilir. Gerekli değişiklik Öğrenci İşleri Daire Başkanlığı tarafından yapılır.
          Yarıyıl/yıl sonu not ortalaması
          MADDE 28 – (1) Öğrencinin yarıyıl/yıl sonu not ortalaması, bir yarıyıl/yılda almış olduğu tüm derslerdeki başarı notlarına karşılık gelen katsayılar ile bu derslerin AKTS değerlerinin çarpımının, ilgili yarıyıl/yılda alınan derslerin toplam AKTS değerine bölümü ile hesaplanır. Bu hesaplamada elde edilen ortalama, virgülden sonra iki hane olarak alınır.
          (2) Bütün notlar öğrencinin not belgesinde gösterilir.
          Onur ve yüksek onur öğrencileri
          MADDE 29 – (1) Bir eğitim-öğretim yılı sonunda, öğrencinin tabi olduğu ders planının ilgili yıl sonuna kadar olan toplam AKTS değerini tamamlamış ve başarmış olması şartı ile AGNO’su 3.00-3.50 olan öğrenciler onur öğrencisi, AGNO’su 3.51-4.00 olan öğrenciler yüksek onur öğrencisi kabul edilir.
          (2) Bu öğrenciler her eğitim-öğretim yılı sonunda ilgili akademik birimler tarafından tespit edilir ve Öğrenci İşleri Daire Başkanlığına bildirilir. Öğrenci İşleri Daire Başkanlığı tarafından hazırlanan başarı belgeleri öğrencilere verilmek üzere ilgili dekanlık veya müdürlüklere gönderilir.
          (3) Üniversite öğrenciliği süresince disiplin cezası alan öğrenciler bu kapsam dışında tutulur.
          Öğrencilerin genel başarı durumu
          MADDE 30 – (1) AGNO’su 2.00 ve üzeri olan öğrenciler başarılı sayılır.
          Ders tekrarı ile ilgili esaslar
          MADDE 31 – (1) Programdan kaldırılan dersler için öğrenciler, kayıtlı oldukları bölümün/programın Senato tarafından onaylanan uyum programının öngördüğü derslere kayıt olurlar.
          (2) Öğrenciler, daha önce aldıkları seçmeli dersler yerine akademik danışmanlarının görüşü ile ilgili yarıyıl/yılda açılan aynı kategorideki başka seçmeli dersleri alabilirler. Bu takdirde, önceki seçmeli ders ve çalışmalar için sağlanmış olan devam koşulu ve kullanılmış olan sınav hakları yeniden kullanılmaz.
          Hazırlık sınıfı
          MADDE 32 – (1) Hazırlık sınıflarında eğitim-öğretim ile ilgili esaslar Senato tarafından belirlenir.
          Öğrencilik süresi
          MADDE 33 – (1) 5 inci maddenin dördüncü fıkrasında belirtilen sürelerde mezun olamayan öğrenciler için ilgili mevzuat hükümleri uygulanır.
          Mezuniyet tarihi
          MADDE 34 – (1) Öğrencinin mezuniyet tarihi; ilgili fakülte, yüksekokul veya meslek yüksekokulu yönetim kurulunun öğrencinin mezuniyeti ile ilgili aldığı kararın tarihidir.
          Diploma
          MADDE 35 – (1) Öğrenimlerini başarıyla tamamlayan öğrencilere, mezun oldukları fakülte, yüksekokul ile bölüm veya meslek yüksekokulu ile program adını belirten Üniversitenin diploması verilir. Diplomalara mezuniyet tarihi, diploma numarası ve mezun olduğu dönem adı yazılır.
          (2) Ön lisans ve lisans diploması verilebilmesi için öğrencinin AGNO’sunun en az 2.00 olması gerekir.
          (3) AGNO’su 3.00-3.50 olan öğrenciler onur öğrencisi, 3.51-4.00 olan öğrenciler yüksek onur öğrencisi listesine geçerek mezun olur ve bu öğrencilerin durumları diplomalarında belirtilir.
          (4) Mezuniyet AGNO’su 4.00 üzerinden hesaplanır ve bu not diploma ekinde ve mezuniyet transkriptinde belirtilir.
          (5) Diplomada, fakülte için Rektör ve dekanın, yüksekokul ve meslek yüksekokulu için Rektör ve müdürün ıslak veya elektronik imzaları bulunur.
          (6) Diğer üniversitelerden nakil yoluyla gelen öğrencilerin lisans diploması alabilmeleri için son iki yarıyılı veya son bir yılı Üniversitede tamamlamış olmaları zorunludur.
          BEŞİNCİ BÖLÜM
          Bitirme Çalışması, Staj ve İşyeri Eğitimi
          Bitirme çalışması
          MADDE 36 – (1) Bitirme çalışması, öğrencinin öğrenim sonucu istenen bilgi ve beceri düzeyine eriştiğini gösteren bir veya birden fazla öğretim elemanı gözetiminde yapılan çalışmadır.
          (2) Bitirme çalışması konusunun verileceği yarıyıl/yıl ile çalışmanın yapılması, yürütülmesi, teslimi, jürinin oluşturulması ve çalışmanın yarıyıl/yıl içi ve yarıyıl/yıl sonu değerlendirmesiyle ilgili esaslar, ilgili bölümün/programın önerisi, ilgili birimin kurul kararı ve Senatonun onayı ile belirlenir.
          Staj ve işyeri eğitimi
          MADDE 37 – (1) Staj ve işyeri eğitimi; eğitim ve öğretim programlarının niteliklerine bağlı olarak öğrencilerin edindiği bilgileri uygulama alanına aktarması ya da uygulama alanıyla pekiştirmesi amacıyla ön lisans ve lisans düzeylerinde yaptıkları uygulamalı çalışmalardır. Staj ve işyeri eğitimi AKTS iş yüküne dâhil edilir. Staj notu, ortalama ve %10’luk başarı sıralaması hesaplamalarında dikkate alınmaz.
          (2) Staj ve işyeri eğitimi çalışmalarının niteliği, süresi, zamanı, yürütülmesi, teslimi, jürinin/komisyonun oluşturulması ve çalışmanın değerlendirilmesiyle ilgili esasları kapsayan yönergeler; fakülte, yüksekokul veya meslek yüksekokulu kurulu kararı ve Senatonun onayı ile belirlenir.
          ALTINCI BÖLÜM
          Kayıt Silme ve İlişiğin Kesilmesi, İzinli Sayılma, Öğrenci Değişimi,
          Öğrenime Yeniden Devam Etme
          Kayıt silme ve ilişiğin kesilmesi
          MADDE 38 – (1) Öğrencinin;
          a) Yükseköğretimden çıkarma cezası alması,
          b) Yatay geçiş yoluyla bir başka yükseköğretim kurumuna geçmesi,
          nedenleriyle kaydı silinir.
          (2) Öğrenciler, bir dilekçe ile Öğrenci İşleri Daire Başkanlığına başvurarak kendi istekleri ile kayıtlarını sildirebilir. Bu durumda ödemiş oldukları harç ve ücretler iade edilmez.
          (3) Kayıt silme işlemi ilgili yönetim kurulunun gerekçeli kararı alınarak, Öğrenci İşleri Daire Başkanlığı tarafından yapılır.
          (4) Herhangi bir nedenle kaydını sildiren öğrencilerin dosyalarındaki belgeleri ve mezun olarak Üniversiteden ayrılanların diplomalarını alabilmeleri için Üniversite tarafından tespit edilen ilişik kesme işlemlerini yapmaları zorunludur.
          İzinli sayılma
          MADDE 39 – (1) Öğrencilere ilgili yönetim kurulu kararıyla ön lisans öğreniminde en az bir yarıyıl, en fazla iki yarıyıl; lisans öğreniminde en az bir yarıyıl/yıl, en fazla dört yarıyıl veya iki tam yıl izin verilebilir. Verilen izin, öğretim süresinden sayılmaz. Her eğitim-öğretim yarıyıl/yılı için ayrı ayrı yönetim kurulu kararı alınır. Bir öğrencinin izinli sayıldığı sürede katkı payı ödeyip ödemeyeceği ilgili mevzuat hükümlerine göre belirlenir.
          (2) Hastalık izninde; yarıyıl/yıl izni verilmesini gerektirecek süreyi kapsayan sağlık raporunun alınması gerekir.
          (3) Askerlik izni; öğrencinin, tecil veya sevk tehiri işleminin zorunlu nedenlerle yapılmaması sonucu askere alınması halinde verilir. Bu öğrencilerin kayıtları silinmez. Bu durumdaki öğrencilerden izinli sayıldıkları süre için öğrenim katkı payı alınmaz.
          (4) Maddi veya ailevi nedenlerle izin; öğrenci için beklenmedik anlarda ortaya çıkan ve öğrenimini engelleyecek nitelikte ölüm, doğal afet veya benzeri durumlar ile öğrencinin içinde bulunabileceği maddi güçlükler nedeniyle ilgili kurullar tarafından verilebilir.
          (5) Öğrencilere yurt dışında öğrenim görmek için veya öğrenimleri ile ilgili olarak görevlendirilmeleri halinde birinci fıkrada belirtilen sürelerle sınırlı olmak üzere izin verilebilir.
          (6) Yukarıdaki nedenlerle izinli sayılan öğrenciler, izinlerinin bitiminde normal yarıyıl/yıl kayıtlarını yaptırarak öğrenimlerine devam eder. Ancak; hastalık nedeniyle izin almış olan öğrenciler öğrenimlerine devam edecek durumda olduklarını sağlık raporu ile belgelendirmek zorundadır.
          (7) İzinli sayılmak için izin talebi başvuruları, ders seçme ve kayıt haftasının ilk gününden başlayarak, iki hafta içerisinde yapılır. Ani hastalıklar ve beklenmedik durumlar dışında bu süreler bittikten sonra yapılan başvurular kabul edilmez.
          (8) Öğrenci, izinli sayıldığı yarıyıl/yılda herhangi bir derse kaydolamaz ve o yarıyıl/yılın sınavlarına giremez.
          Yurt dışındaki üniversitelerle öğrenci değişimi
          MADDE 40 – (1) Üniversite ile yurt dışındaki üniversiteler arasında yapılan ikili anlaşmalar ve öğrenci değişim programları çerçevesinde, bu üniversitelere bir veya iki yarıyıl süreyle öğrenci gönderilebilir.
          (2) Bu öğrencilerin kayıtları bu süre içerisinde Üniversitede devam eder ve bu süre eğitim-öğretim süresinden sayılır. Bu öğrenciler, o dönem için kendi bölümlerinde/programlarında almaları gereken dersler yerine, okudukları üniversitede aldıkları derslerden sorumlu sayılır. Bu derslerin belirlenmesi, bölüm/program koordinatörünün ve ilgili bölümün/programın intibak komisyonunun teklifi ve fakülte/yüksekokul/meslek yüksekokul yönetim kurulu kararı ile kesinleşir. Bu derslerden alınan notlar, ilgili yarıyıl/yılın başarısı olarak ÖBS’ye işlenir ve akademik ortalamaya katılır. Öğrencinin yurt dışında başarısız olduğu dersler varsa, öğrenci bu derslerin yerine kendi bölümünde/programında akademik danışmanın önerisi ve fakülte, yüksekokul veya meslek yüksekokulu yönetim kurulu kararı ile AKTS değerini tamamlayacak şekilde derse kayıt yapar.
          (3) Yurt dışındaki üniversiteden değişim programı kapsamında gelen öğrencilere Üniversitede okudukları süre içerisinde bu Yönetmelik hükümleri uygulanır ve aldıkları dersler için kendilerine not durum belgesi verilir.
          Yurt içi üniversitelerle öğrenci değişimi
          MADDE 41 – (1) Üniversite ile ulusal düzeyde diğer üniversiteler arasında yapılacak protokoller çerçevesince öğrenci ve öğretim üyesi değişim programı uygulanır. Bu protokoller, ilgili mevzuat hükümlerine göre yapılır.
          YEDİNCİ BÖLÜM
          Çeşitli ve Son Hükümler
          İkinci öğretim
          MADDE 42 – (1) İkinci öğretim, hafta içi birinci öğretimin derslerinin bitimini takiben yapılan öğretimdir ve gerektiğinde hafta sonu da yapılabilir.
          (2) İkinci öğretimde meslek stajları ve mesleki uygulama dersleri, öğrenci istediği takdirde birinci öğretim saatlerinde ve yarıyıl/yıl içerisinde yapılabilir.
          (3) Mezuniyet belgesi ve diplomalarda ikinci öğretim ibaresine yer verilmez.
          (4) İkinci öğretimde birinci öğretimdeki eğitim-öğretim esasları geçerlidir.
          (5) İkinci öğretimde öğrenim gören öğrenciler, birinci öğretim programlarına yatay geçiş yapamaz. Ancak hazırlık sınıfı ve uyum sınıfları hariç, bulundukları sınıfın bütün derslerini vermek ve eğitim-öğretim yarıyıl/yılı sonunda sınıf başarı sıralamasında %10’a girmek koşuluyla bir üst sınıfa geçmiş olan öğrenciler için ilgili mevzuat hükümleri uygulanır.
          (6) Birinci öğretim öğrencileri, ikinci öğretime yatay geçiş yapabilir. Birinci öğretim öğrencilerinin ikinci öğretime geçişlerinde, Üniversiteye giriş yılındaki bölüm/program kontenjanının %5’ini geçmemek üzere kontenjan tanınır. Bu geçişlerde de ikinci öğretimden birinci öğretime geçişte uygulanan ilgili mevzuat hükümleri uygulanır. Ancak geçiş yapan bu öğrenciler, ikinci öğretim için öngörülen katkı payını ödemek zorundadır.
          Çift anadal programı
          MADDE 43 – (1) Bir bölümün öğrencileri, ön lisans/lisans öğrenimleri boyunca aynı fakülte, yüksekokul ve meslek yüksekokulu içinde veya dışında asıl bölümüne konu bakımından yakın olan başka bir lisans öğretimini aynı zamanda takip edebilir. Bununla ilgili esaslar Senato tarafından belirlenir.
          Uzaktan eğitim
          MADDE 44 – (1) Uzaktan eğitim; eğitim-öğretimin her düzeyinde basılı malzeme, radyo-televizyon ve bilgi teknolojileri kullanılarak yapılan, öğrenci ile öğretim elemanının aynı mekânda bulunmasını gerektirmeyen eğitim türüdür.
          (2) Uzaktan eğitimle ilgili esaslar Senato tarafından belirlenir.
          Yaz öğretimi
          MADDE 45 – (1) Yaz öğretimi ile ilgili esaslar Senato tarafından belirlenir.
          Yürürlükten kaldırılan yönetmelik
          MADDE 46 – (1) 1/6/2016 tarihli ve 29729 sayılı Resmî Gazete’de yayımlanan Kocaeli Üniversitesi Önlisans ve Lisans Eğitim ve Öğretim Yönetmeliği yürürlükten kaldırılmıştır.
          Hüküm bulunmayan haller
          MADDE 47 – (1) Bu Yönetmelikte hüküm bulunmayan hallerde ilgili diğer mevzuat hükümleri ile Yükseköğretim Kurulu kararları uygulanır. Bu Yönetmeliğin uygulanmasından doğacak tereddütleri gidermeye Senato yetkilidir.
          İntibak
          GEÇİCİ MADDE 1 – (1) 16 ncı maddenin dördüncü fıkrasında belirtilen koşul, 2019-2020 eğitim-öğretim yılından önce Üniversiteye kayıt yaptıran öğrenciler için 2020-2021 eğitim-öğretim yılından itibaren uygulanır. Bu Yönetmeliğin diğer hükümleri kayıtlı bütün öğrenciler için uygulanır.
          Yürürlük
          MADDE 48 – (1) Bu Yönetmelik 2019-2020 eğitim-öğretim yılı başından geçerli olmak üzere yayımı tarihinde yürürlüğe girer.
          Yürütme
          MADDE 49 – (1) Bu Yönetmelik hükümlerini Kocaeli Üniversitesi Rektörü yürütür.
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
                      <Button style={{ marginLeft: 4 }} mode="contained"
                              onPress={async () => await uploadFile("x")}><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  );
                }) : <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>DGS Yerleştirme Sonuç Belgesi</Text>}
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
                      <Button style={{ marginLeft: 4 }} mode="contained"
                              onPress={async () => await uploadFile("y")}><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  );
                }) : <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Önlisans Transkript</Text>}
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
                      <Button style={{ marginLeft: 4 }} mode="contained"
                              onPress={async () => await uploadFile("z")}><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  );
                }) : <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Ders İçerikleri</Text>}
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
                        <Button style={{ marginLeft: 4 }} mode="contained"
                                onPress={async () => await uploadFile("q")}><Text
                          style={{ color: "#fff" }}>Yükle</Text></Button>
                      </View>
                    );
                  }) :
                  <Text style={{ paddingHorizontal: 64, paddingVertical: 6, textAlign: "center" }}>Ders Planı Müfredatı</Text>}
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
            <Button onPress={() => finishAppeal()} loading={isLoading}
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


export default VerticalAppealFirstScreen;
