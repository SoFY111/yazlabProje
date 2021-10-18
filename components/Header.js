import React, { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import { View } from "react-native";

const Header = ({children}) => {
  return(
    <>
      <View>
        <Text>De</Text>
      </View>
      {children}
    </>
  )
}

export default Header
