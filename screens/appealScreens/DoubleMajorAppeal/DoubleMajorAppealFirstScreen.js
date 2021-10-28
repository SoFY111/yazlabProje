import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Checkbox } from "react-native-paper";

import DocumentPicker from "react-native-document-picker";

import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { useRoute } from "@react-navigation/core";
import getPath from '@flyerhq/react-native-android-uri-path'
import { Icon } from "react-native-elements";


const DoubleMajorAppealFirstScreen = () => {
  const [fileX, setFileX] = useState([{ name: null, uri: null }]);
  const [fileY, setFileY] = useState([{ name: null, uri: null }]);
  const [fileZ, setFileZ] = useState([{ name: null, uri: null }]);
  const [fileQ, setFileQ] = useState([{ name: null, uri: null }]);
  const [userData, setUserData] = useState(null);
  const [appealUUID, setAppealUUID] = useState("");
  const appealUUIDroute = useRoute().params.appealUUID;

  useEffect(() => {
    setAppealUUID(appealUUIDroute);

    firestore().collection("users")
      .doc(auth().currentUser.uid)
      .get()
      .then(querySnapshot => {
        setUserData(querySnapshot.data());
      });
  });


  const docPicker = async (type) => {
    if(type === 'x') setFileY([{}]);
    else if(type === 'y') setFileY([{}])
    else if(type === 'z') setFileZ([{}])
    else if(type === 'q') setFileQ([{}])
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

      if(type === 'x') setFileX([{ name: res[0].name, uri: res[0].uri }]);
      else if(type === 'y') setFileY([{ name: res[0].name, uri: res[0].uri }])
      else if(type === 'z') setFileZ([{ name: res[0].name, uri: res[0].uri }])
      else if(type === 'q') setFileQ([{ name: res[0].name, uri: res[0].uri }])


      console.log('fileX: ' + fileX[0].name)
      console.log('fileY: ' + fileY[0].name)
      console.log('fileZ: ' + fileZ[0].name)
      console.log('fileQ: ' + fileQ[0].name)

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
    const [fileType, setFileType] = useState('')

    if(type === 'x') {
      file = fileX[0];
      // setFileType('fileX')
    }
    else if(type === 'y') {
      file = fileY[0];
      // setFileType('fileY')
    }
    else if(type === 'z') {
      file = fileZ[0];
      // setFileType('fileZ')
    }
    else if(type === 'q') {
      file = fileQ[0];
      // setFileType('fileQ')
    }

    console.log('type: ' + type)
    console.log('fileType: ' + fileType)
    console.log(file.name)

    /*let fileName = file.name;
    const fileUri = getPath(file.uri);
    const extension = fileName.split(".").pop();
    const name = fileName.split(".").slice(0, -1).join(".");

    fileName = userData.studentNumber + "_"
            + auth().currentUser.displayName.replace(" ", "-") + "_"
            + Date.now() + "_"
            + appealUUID + '_'
            + fileType + '.'
            + extension;

    let task;

    if(extension === 'pdf') task = storage().ref('pdf/'+fileName).putFile(fileUri);
    else task = storage().ref('images/'+fileName).putFile(fileUri);*/

    /*try {
      await task;
    } catch (e) {
      console.log(e.message);
    }*/
  };

  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scv}>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse in ante id nisi efficitur scelerisque in
          sit amet tortor. Quisque eget faucibus velit. Phasellus est nisl, convallis quis lorem eu, malesuada
          sollicitudin velit. Suspendisse potenti. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rutrum
          lorem eu elit consectetur, ac feugiat turpis auctor. Proin congue lectus sem, eget vehicula orci ornare vel.
          Proin varius lectus sem, vitae fringilla risus dictum maximus. Curabitur dui diam, pretium sed neque nec,
          venenatis ullamcorper nulla. Nullam ut tortor venenatis, molestie erat eget, hendrerit nulla. Pellentesque
          rutrum dapibus tortor, quis elementum nulla iaculis nec. Quisque vel vehicula mi. Curabitur sit amet velit
          porta, ornare mi at, convallis sem. Suspendisse velit ex, pharetra placerat pharetra id, mattis laoreet lorem.
          Ut ornare augue in elit volutpat, in commodo nulla viverra. Nulla non fermentum diam, eu ultrices ipsum.
          Duis mollis mauris rhoncus dapibus semper. Donec nec augue at sapien aliquam accumsan. Ut eros purus, vehicula
          ut ipsum a, interdum imperdiet nulla. Duis non sem id sem fermentum porttitor. Aenean purus diam, cursus sed
          pulvinar ut, consequat sed ante. Curabitur velit lectus, pellentesque ut consequat non, accumsan a dui.
          Praesent mattis metus at risus ultrices suscipit. Nulla sit amet ex vel eros porta consectetur commodo nec
          nulla. Donec nulla erat, tincidunt vel neque eu, gravida faucibus felis. Suspendisse scelerisque risus mauris,
          auctor suscipit magna dapibus id. Vestibulum id condimentum nulla. Ut lobortis lacus enim, et molestie lorem
          consectetur non. Mauris non tempor tellus. Ut efficitur hendrerit enim, sit amet tincidunt ipsum placerat ut.
          Aliquam molestie ac leo convallis convallis. Donec vestibulum, sem ut pellentesque cursus, libero turpis
          egestas nibh, eget tincidunt lectus sem in tellus. Nullam vitae tortor tortor. Maecenas ante turpis, fringilla
          vel lacinia in, iaculis ut ex. Maecenas mollis erat at dictum euismod. Etiam in purus nec urna porttitor
          fringilla et eget felis. Nullam lacus mi, condimentum molestie felis at, fringilla aliquet est. Sed vitae
          tincidunt urna, mattis dapibus odio. Vestibulum dictum accumsan nisl non gravida. Aliquam mi leo, viverra ac
          magna eget, scelerisque tempus nulla. Nam malesuada faucibus augue, a lobortis nibh molestie eu. Curabitur
          dapibus orci sed nibh sollicitudin, non lobortis tellus sollicitudin. Aenean a turpis ac nisi mollis ultrices.
          Vivamus venenatis ultricies tincidunt. Donec volutpat metus vitae erat porttitor fringilla. Etiam posuere dui
          vel diam gravida pulvinar.
          Aliquam in nunc hendrerit, gravida urna sed, ullamcorper nulla. Quisque eu malesuada metus. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis non finibus dui, et
          vestibulum odio. Fusce sed condimentum est, ut semper est. Aenean at magna libero. Pellentesque porttitor
          fermentum dui, vel tristique purus fermentum et. Pellentesque sodales est et quam euismod mollis. Pellentesque
          sed nunc lacus. Cras elit magna, placerat nec sem id, tristique aliquet quam.
          Vestibulum egestas auctor urna in dapibus. Fusce neque ligula, mollis vitae rutrum eget, facilisis eu diam.
          Aliquam ligula ipsum, feugiat sit amet magna vitae, aliquet iaculis orci. Aliquam erat volutpat. Suspendisse
          eu ante augue. Curabitur volutpat lorem in viverra cursus. Sed convallis ultricies sapien, vitae dapibus ex
          ultricies ac.
          Pellentesque diam dui, finibus at purus sed, bibendum ultricies eros. Integer tempus sed metus eu consectetur.
          Ut dapibus sapien pharetra erat aliquam hendrerit. Duis maximus suscipit turpis. Duis eget bibendum urna.
          Praesent lobortis congue justo, ac varius urna gravida quis. Vestibulum a aliquam ligula. Morbi faucibus
          consequat libero. Proin orci ipsum, ultricies sit amet ornare a, tristique non felis. Suspendisse auctor
          auctor mauris nec rutrum. Sed sit amet laoreet augue. Quisque non lectus suscipit, tempor massa quis,
          elementum mi. Curabitur viverra massa a libero viverra sollicitudin. Sed a sollicitudin risus, vitae viverra
          sem. Aliquam a tempus dolor, nec tincidunt elit. Maecenas nibh urna, viverra ut faucibus vitae, porta in
          dolor.
          Mauris pulvinar viverra ligula eu porta. In mi felis, convallis eget mollis eu, mollis ut ipsum. Maecenas ac
          massa tellus. Quisque quis purus ut massa interdum accumsan. Sed sit amet purus condimentum, sagittis dolor
          vel, tempor quam. Ut in eros dui. Ut tristique maximus vehicula. Ut porta nunc in fermentum pulvinar. Morbi ac
          pharetra enim. Vivamus ac enim erat. Pellentesque vel laoreet nunc. Integer sed molestie nisi, non aliquam
          quam. Vivamus finibus nibh ut nulla blandit posuere. Ut feugiat aliquam feugiat.
          Sed eu lorem at nunc facilisis dapibus. Aliquam eget gravida mauris. Mauris mattis hendrerit tortor in
          maximus. Aenean condimentum condimentum laoreet. Duis in nisl malesuada, sollicitudin metus et, efficitur
          nisi. Nulla quis consequat massa, vulputate aliquam metus. Cras vel vehicula arcu, auctor feugiat dolor. Donec
          pharetra laoreet nisl non laoreet. Donec tempus purus dignissim, sodales arcu quis, fermentum nunc.
          Suspendisse non porttitor augue, et ultricies turpis. Nunc tristique fermentum ex eget finibus. Duis tempor,
          lorem sed iaculis cursus, neque nunc gravida diam, fermentum fringilla eros neque quis diam.
          Vestibulum lacinia elit massa, at vestibulum nisi feugiat nec. Duis rhoncus sed magna id maximus. Nullam
          consectetur gravida pulvinar. Nulla eleifend nulla non urna blandit feugiat. Morbi mattis enim nec est iaculis
          malesuada. Suspendisse finibus nibh eu ante sagittis fermentum. Suspendisse quis magna posuere sapien gravida
          varius. Etiam vehicula eu ipsum at efficitur. Aliquam lacinia tempus semper. Etiam dictum mollis odio. Donec
          eu lorem venenatis eros convallis blandit ac sit amet lacus. Ut vulputate luctus metus ac sagittis. Curabitur
          augue lacus, luctus non maximus at, tincidunt in felis. Vestibulum fringilla, turpis at tempor rutrum, nisi
          metus gravida ex, luctus tincidunt est mi eu dui.
          Aliquam porttitor magna tortor, cursus convallis quam efficitur vel. Nullam molestie arcu in turpis laoreet
          suscipit. In id elit id eros convallis efficitur vitae eget dui. Nunc mollis, magna non auctor tempus, felis
          nisi dapibus ipsum, nec auctor risus felis id metus. Curabitur pulvinar, dui eu ornare feugiat, tortor dolor
          mattis augue, vitae congue lacus nisl in erat. Duis ex diam, interdum pharetra est non, consequat varius
          sapien. Donec odio est, posuere tincidunt aliquet ut, porttitor et nunc. Curabitur varius lacus sed pharetra
          pretium. Sed congue magna non quam malesuada porta.
          Sed faucibus vestibulum purus eget maximus. Phasellus rutrum ligula ac aliquet elementum. Nulla vel accumsan
          velit. Nam auctor tortor id sapien cursus dapibus. Sed euismod diam sed turpis tristique vestibulum.
          Suspendisse laoreet tellus eget quam porta, ut feugiat mi convallis. Sed neque mi, lacinia ut dolor non,
          fermentum vehicula mi. Curabitur lobortis suscipit vulputate. Nunc quis augue venenatis, dictum libero a,
          ornare enim. Ut consectetur felis viverra porta fringilla. Nunc nec nibh mi. Vivamus eu eleifend velit.
          Donec mauris mi, placerat et mauris ut, varius semper elit. Sed non euismod sapien. Sed a ultrices quam.
          Quisque tincidunt ante sed nisi sodales efficitur. Praesent posuere tempor convallis. Fusce ornare diam
          sapien, quis iaculis lorem pulvinar quis. Orci varius natoque penatibus et magnis dis parturient montes,
          nascetur ridiculus mus. Curabitur dolor elit, dictum ac iaculis at, condimentum at urna. Phasellus euismod
          vitae lorem quis volutpat. Phasellus eu ante id velit mattis elementum ac eu sem.
          Phasellus faucibus, urna eget faucibus vehicula, erat urna sagittis erat, sed luctus tellus urna ut metus.
          Phasellus quis commodo turpis, ut pulvinar urna. Quisque accumsan non elit ut tincidunt. Etiam tincidunt
          bibendum porta. Aenean ultricies nibh eget odio vestibulum, at mollis turpis mollis. Suspendisse posuere
          tellus vel egestas viverra. Fusce id egestas eros, sit amet interdum lacus. Fusce nec feugiat velit. Nunc
          molestie lectus eu nisi suscipit sagittis. Ut non placerat odio. Aenean vehicula iaculis erat, a ornare massa
          tristique in. Cras molestie sagittis rhoncus. In tristique et tortor hendrerit rutrum. Duis in dui nec orci
          lobortis molestie. Sed consequat vulputate purus in condimentum. Morbi faucibus tortor ac ex semper, sed
          tincidunt eros cursus.
          Nullam ultricies ultrices tristique. Morbi vitae imperdiet sem, eget vehicula odio. Duis a magna id enim
          eleifend tristique. In leo nunc, posuere a tincidunt vitae, facilisis nec ante. Ut enim justo, ornare eu quam
          quis, dapibus venenatis risus. Quisque varius dapibus tempor. Phasellus vel erat ultrices, laoreet nibh eget,
          imperdiet orci. In ultrices purus id fringilla facilisis. Interdum et malesuada fames ac ante ipsum primis in
          faucibus. Curabitur elit ante, scelerisque nec malesuada quis, interdum vestibulum tortor. Morbi et sapien
          tempor, elementum urna at, placerat nisl. Quisque ligula urna, eleifend et blandit quis, mollis vitae nulla.
          Pellentesque elementum dolor quis efficitur sagittis. Integer vitae lacinia neque.
          Donec ex purus, tincidunt in congue quis, scelerisque a lectus. Cras facilisis lorem ac ipsum elementum, ut
          porttitor tellus egestas. Maecenas egestas venenatis dui, sed euismod est imperdiet imperdiet. In gravida
          semper metus, ut dictum urna semper nec. Fusce elementum posuere orci, in blandit libero vestibulum quis.
          Donec bibendum dictum porta. Mauris at eros eget purus aliquam venenatis ut a tortor. Aenean lacinia velit
          urna, in fermentum velit aliquam sed. Nulla sodales enim quis ante vestibulum, vel malesuada sapien elementum.
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
              flexDirection:"column",
              justifyContent:'flex-start',
            }}
          >
            <View key={0}>
              <TouchableOpacity
                style={{marginTop:6  ,paddingVertical: 8, paddingLeft:18, paddingRight:12 , borderWidth:1, borderColor: 'rgba(0,0,0,.3)', borderRadius:6}}
                onPress={() => docPicker('x')}
              >
                {fileX[0].name ? fileX.map(({ name, uri }) => {
                  return (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent:"space-between"}}>
                      <Text>{name}</Text>
                      <TouchableOpacity style={{marginLeft:18}} onPress={() => setFileX([{name: null, uri: null}])}>
                        <Icon name='close' type="ionicon" />
                      </TouchableOpacity>
                      <Button style={{marginLeft:4}} mode="contained" onPress={() => uploadFile('x')}><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  );
                }) : <Text style={{paddingHorizontal: 64, paddingVertical:6}}>X Evrağı Yükle</Text>}
              </TouchableOpacity>
            </View>
            <View key={1}>
              <TouchableOpacity
                style={{marginTop:6  ,paddingVertical: 8, paddingLeft:18, paddingRight:12 , borderWidth:1, borderColor: 'rgba(0,0,0,.3)', borderRadius:6}}
                onPress={() => docPicker('y')}
              >
                {fileY[0].name ? fileY.map(({ name, uri }) => {
                  return (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent:"space-between"}}>
                      <Text>{name}</Text>
                      <TouchableOpacity style={{marginLeft:18}} onPress={() => setFileY([{name: null, uri: null}])}>
                        <Icon name='close' type="ionicon" />
                      </TouchableOpacity>
                      <Button style={{marginLeft:4}} mode="contained" onPress={() => uploadFile('y')}><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  );
                }) : <Text style={{paddingHorizontal: 64, paddingVertical:6}}>Y Evrağı Yükle</Text>}
              </TouchableOpacity>
            </View>
            <View key={2}>
              <TouchableOpacity
                style={{marginTop:6  ,paddingVertical: 8, paddingLeft:18, paddingRight:12 , borderWidth:1, borderColor: 'rgba(0,0,0,.3)', borderRadius:6}}
                onPress={() => docPicker('z')}
              >
                {fileZ[0].name ? fileZ.map(({ name, uri }) => {
                  return (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent:"space-between"}}>
                      <Text>{name}</Text>
                      <TouchableOpacity style={{marginLeft:18}} onPress={() => setFileZ([{name: null, uri: null}])}>
                        <Icon name='close' type="ionicon" />
                      </TouchableOpacity>
                      <Button style={{marginLeft:4}} mode="contained" onPress={() => uploadFile('z')}><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  );
                }) : <Text style={{paddingHorizontal: 64, paddingVertical:6}}>Z Evrağı Yükle</Text>}
              </TouchableOpacity>
            </View>
            <View key={3}>
              <TouchableOpacity
                style={{marginTop:6  ,paddingVertical: 8, paddingLeft:18, paddingRight:12 , borderWidth:1, borderColor: 'rgba(0,0,0,.3)', borderRadius:6}}
                onPress={() => docPicker('q')}
              >
                {fileQ[0].name ? fileQ.map(({ name, uri }) => {
                  return (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent:"space-between"}}>
                      <Text>{name}</Text>
                      <TouchableOpacity style={{marginLeft:18}} onPress={() => setFileQ([{name: null, uri: null}])}>
                        <Icon name='close' type="ionicon" />
                      </TouchableOpacity>
                      <Button style={{marginLeft:4}} mode="contained" onPress={() => uploadFile('q')}><Text
                        style={{ color: "#fff" }}>Yükle</Text></Button>
                    </View>
                  );
                }) : <Text style={{paddingHorizontal: 64, paddingVertical:6}}>Q Evrağı Yükle</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.nextButtonContainer}>
        <Button mode="contained" onPress={() => console.log('pressed')}>
          <Text style={{ color: "#fff" }}>Devam</Text>
        </Button>
      </View>

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
    backgroundColor: "blue",
  },
  nextButtonContainer: {
    alignItems: "flex-end",
    alignContent: "flex-end",
    justifyContent: "flex-end",
    marginVertical: 12,
  },
});


export default DoubleMajorAppealFirstScreen;
