import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Linking,
  Image
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';
import { Snackbar } from "react-native-paper";
import { quotes } from "./src/quotes";

export default function App() {
  const [Quote, setQuote] = useState("Loading...");
  const [Author, setAuthor] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [BarVisible, setBarVisible] = useState(false);
  const [Speaker, setSpeaker] = useState(false)

  const [fontsLoaded] = useFonts({
    regular: Poppins_400Regular,
    medium: Poppins_500Medium,
  });

  const genQuotes = function () {
    setLoading(true);
    setTimeout(function(){
      const random = Math.floor(Math.random() * quotes.length);
      const findQuote = quotes[random];
      setQuote(findQuote.text);
      setAuthor(findQuote.author);
      setLoading(false);
    }, 500)
    
  };

  useEffect(function () {
    genQuotes();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="white" />;
  }

  return (
    <SafeAreaView style={Style.body}>
      <StatusBar />
      <Image source={require('./assets/QuotePlusLogo.png')} style={Style.logo} />
      <Animatable.View animation="bounceIn" style={Style.quoteCard}>
        <Text style={Style.title}>Quote of the day</Text>
        <FontAwesome style={Style.quoteIcon} name="quote-left" />
        <Text style={Style.quoteText}>{Quote}</Text>
        <FontAwesome
          style={[Style.quoteIcon, { textAlign: "right" }]}
          name="quote-right"
        />
        <Text style={Style.author}> -- {Author}</Text>

        <View
          onStartShouldSetResponder={genQuotes}
          style={[
            Style.buttonContainer,
            {
              backgroundColor: loading ? "rgba(75, 123, 236, 0.7)" : "#4b7bec",
            },
          ]}
        >
          <Text style={Style.buttonText}>
            {loading ? "Loading..." : "New Quote"}
          </Text>
        </View>

        <View style={Style.iconContainer}>
          <FontAwesome onPress={() => {
            setSpeaker(true)
            Speech.stop();
            Speech.speak(Quote + 'by' + Author, {
            pitch: 1,
            onDone: () => setSpeaker(false)
          })
          }} style={[Style.bottomIcons, {color: Speaker ? 'white' : '#4b7bec', backgroundColor: Speaker ? '#4b7bec' : 'white' }]} name="volume-up" />

          <Ionicons
            onPress={() => {
              Clipboard.setStringAsync(Quote);
              setBarVisible(true)
            }}
            style={Style.bottomIcons}
            name="ios-copy-outline"
          />
          <FontAwesome onPress={() => Linking.openURL(`https://twitter.com/share?text=${Quote}`)} style={Style.bottomIcons} name="twitter" />
        </View>
      </Animatable.View>
      <Snackbar style={{backgroundColor: '#2C3A47'}} visible={BarVisible} onDismiss={() => setBarVisible(false)} action={{
        label: 'Ok'
      }}>
            Copied
      </Snackbar>
    </SafeAreaView>
  );
}

const Style = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#4b7bec",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 100,
    height: undefined,
    aspectRatio: 1, 
    marginBottom: 30

  },

  quoteCard: {
    width: "90%",
    borderRadius: 20,
    padding: 20,
    backgroundColor: "white",
  },

  title: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 22,
    color: "#222f3e",
    marginBottom: 20,
  },

  quoteIcon: {
    color: "#8395a7",
    fontSize: 20,
  },

  quoteText: {
    textAlign: "center",
    fontFamily: "regular",
    marginVertical: 10,
    color: "#485460",
    letterSpacing: 0.2,
    lineHeight: 25,
  },

  author: {
    textAlign: "right",
    fontFamily: "regular",
    marginTop: 10,
    color: "#353b48",
  },

  buttonContainer: {
    width: "100%",
    borderRadius: 100,
    padding: 14,
    marginTop: 20,
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontFamily: "medium",
    fontSize: 16,
  },

  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 15,
  },

  bottomIcons: {
    backgroundColor: "white",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#4b7bec",
    textAlign: "center",
    width: 45,
    height: 45,
    lineHeight: 45,
    color: "#4b7bec",
    fontSize: 16,
  },
});
