import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, View } from "react-native";
import { Button as MUIButton, Text } from "react-native-paper";
// import firestore from '@react-native-firebase/firestore'
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/core";

import { useDispatch, useSelector } from "react-redux";

const Application = () => {

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const isSignedIn = useSelector((state) => state.isUserSignedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isSignedIn) navigation.navigate("SignIn");
  }, [isSignedIn]);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      setEmail(user?.email ?? "");
    });
  }, []);

  const [chats, setChats] = useState([]);
  /*useEffect(()=>{
    return firestore()
      .collection('chats')
      .where('users', 'array-contains', email)
      .onSnapshot((querySnapshot) => {
        setChats(querySnapshot.docs)
      })
  },[email])*/

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{paddingBottom:14, borderBottomWidth:1 , borderBottomColor:'rgba(0,0,0,.2)'}}>
        <Text>Devam Eden Başvurular</Text>
        <View>
          <Text>Başvuru 1</Text>
          <Text>Başvuru 2</Text>
          <Text>Başvuru 3</Text>
          <Text>Başvuru 4</Text>
          <Text>Başvuru 5</Text>
        </View>
      </View>
      <ScrollView style={{ width: "100%", marginTop:14 }}>
        <MUIButton style={styles.boxes} mode="contained" theme={{ roundness: 3 }} onPress={() => navigation.navigate('NecessaryPapers', {type:0})}>
          <Text style={styles.texts}>{"çap başvuru".toLocaleUpperCase()}</Text>
        </MUIButton>
        <MUIButton style={styles.boxes} mode="contained" theme={{ roundness: 3 }} onPress={() => navigation.navigate('NecessaryPapers', {type:1})}>
          <Text style={styles.texts}>{"dgs başvuru".toLocaleUpperCase()}</Text>
        </MUIButton>
        <MUIButton style={styles.boxes} mode="contained" theme={{ roundness: 3 }} onPress={() => navigation.navigate('NecessaryPapers', {type:2})}>
          <Text style={styles.texts}>{"yatay geçiş başvuru".toLocaleUpperCase()}</Text>
        </MUIButton>
        <MUIButton style={styles.boxes} mode="contained" theme={{ roundness: 3 }} onPress={() => navigation.navigate('NecessaryPapers', {type:3})}>
          <Text style={styles.texts}>{"yaz okulu başvuru".toLocaleUpperCase()}</Text>
        </MUIButton>
        <MUIButton style={styles.boxes} mode="contained" theme={{ roundness: 3 }} onPress={() => navigation.navigate('NecessaryPapers', {type:4})}>
          <Text style={styles.texts}>{"ders intibak başvuru".toLocaleUpperCase()}</Text>
        </MUIButton>
      </ScrollView>
      {/*{chats.map(chat => (
        <React.Fragment>
          <List.Item
            title="ds"
            //description={chat.data().messages[0].text ?? ''}
            description=''
            left={() => <Avatar.Text label="a" size={56} />}
            onPress={() => navigation.navigate('Chat', {chatId : chat.id})}
          />
          <Divider inset />
        </React.Fragment>
      ))}

      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
          <Dialog.Title>New Chat</Dialog.Title>
          <Dialog.Content>
            <TextInput label='Enter User Email' value={userEmail} onChangeText={(text) => setUserEmail(text)}/>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => console.log("saveee")} loading={isLoading}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FAB
        icon="plus"
        style={{ position: "absolute", bottom: 16, right: 16 }}
        onPress={() => setIsDialogVisible(true)}
      />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  boxes:{
    width:'100%',
    marginTop:8,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius:6
  },
  texts: {
    color: "#fff",
  },
});

export default Application;
