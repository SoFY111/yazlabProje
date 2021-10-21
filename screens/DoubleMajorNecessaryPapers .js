import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { Icon } from "react-native-elements";

const DoubleMajorNecessaryPapers = () => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.wrapper}>
          <Icon name="long-arrow-alt-right" type="font-awesome-5" color="rgba(0,0,0, .3)" size={18} />
          <Text style={styles.texts}>Başvuru dilekçesi</Text>
        </View>
        <View style={styles.wrapper}>
          <Icon name="long-arrow-alt-right" type="font-awesome-5" color="rgba(0,0,0, .3)" size={18} />
          <Text style={styles.texts}>Transkript</Text>
        </View >
        <View style={styles.wrapper}>
          <Icon name="long-arrow-alt-right" type="font-awesome-5" color="rgba(0,0,0, .3)" size={18} />
          <Text style={styles.texts}>Anadal diploma programının ilgili sınıfındaki başarı sıralaması</Text>
        </View>
        <View style={styles.wrapper}>
          <Icon name="long-arrow-alt-right" type="font-awesome-5" color="rgba(0,0,0, .3)" size={18} />
          <Text style={styles.texts}>Kayıt yaptırdığı yıla ait ÖSYM Belgesi (Kontenjanın aşılması during göz önünde
            bulundurulacaktır.)</Text>
        </View>
        <View style={styles.wrapper}>
          <Icon name="long-arrow-alt-right" type="font-awesome-5" color="rgba(0,0,0, .3)" size={18}/>
          <Text style={styles.texts}>Yabancı dil belgesi (Yabancı dil ile eğitim yapılan bölümler/programlar için
            gereklidir.)</Text>
        </View>

      </View>
      <View>
        <Button mode="contained">
          <Text style={{ color: "#fff" }}>{"devam et".toLocaleUpperCase()}</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  texts: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft:8,
    marginTop: 5,
    marginBottom: 5,
  },
});

export default DoubleMajorNecessaryPapers;
