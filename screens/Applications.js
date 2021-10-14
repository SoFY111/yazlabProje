import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Avatar, Button, Dialog, Divider, FAB, List, Portal, Text, TextInput } from "react-native-paper";
// import firestore from '@react-native-firebase/firestore'
// import auth from "@react-native-firebase/auth";
import {useNavigation} from "@react-navigation/core";
import { useDispatch, useSelector } from "react-redux";

const ChatList = () => {

  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()

  const isSignedIn = useSelector((state) => state.isUserSignedIn)
  const dispatch = useDispatch()

  useEffect(() => {
    if(!isSignedIn) navigation.navigate('SignIn')
  }, [isSignedIn])

  /*useEffect(()=>{
    auth().onAuthStateChanged(user => {
      setEmail(user?.email ?? '')
    })
  }, [])*/

  /*const createChat = async () => {
    if (!email || !userEmail) return
    setIsLoading(true)
    const response = await firestore().collection('chats').add({
      users: [email, userEmail]
    })
    setIsLoading(false)
    setIsDialogVisible(false)
    navigation.navigate('Chat', {chatId: response.id})
  }*/

  const [chats, setChats] = useState([])
  /*useEffect(()=>{
    return firestore()
      .collection('chats')
      .where('users', 'array-contains', email)
      .onSnapshot((querySnapshot) => {
        setChats(querySnapshot.docs)
      })
  },[email])*/

  return (
    <View style={{ flex: 1 }}>
      <Text>Application's Pages</Text>
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

export default ChatList;
