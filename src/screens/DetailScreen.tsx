import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {RootStackParams} from '../navigation/Navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('screen').height;

interface Props extends StackScreenProps<RootStackParams, 'DetailScreen'> {}

export const DetailScreen = ({route, navigation}: Props) => {
  const movie = route.params;
  const uri = `${movie.volumeInfo.imageLinks.smallThumbnail}`;
  const [userName, setUsername] = useState('');
  const [reseña, setReseña] = useState('');

  console.log(userName)
  const saveData = async () => {
    try {
      await AsyncStorage.setItem("",(userName));
      await AsyncStorage.setItem("",(reseña));
      console.log(userName);
      console.log(reseña)
      Alert.alert("Data successfully saved");
    } catch (e) {
      Alert.alert("Failed to save the data to the storage");
    }
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView
        keyboardVerticalOffset={60}
        behavior={
          Platform.OS === 'ios' ? 'position' : 'padding'
        }></KeyboardAvoidingView>
      <View style={styles.imageContainer}>
        <View style={styles.imageBorder}>
          <Image source={{uri}} style={styles.posterImage} />
        </View>
      </View>

      <View style={styles.marginContainer}>
        <Text style={styles.tittle}>{movie.volumeInfo.title}</Text>
        <Text style={styles.subTittle}>{movie.volumeInfo.authors}</Text>
        <Text style={styles.description}>{movie.volumeInfo.description}</Text>
      </View>

      {reseña ? null : <View>
        <Text>{userName}</Text>
        </View>}

      <View>
        <Text style={styles.reseña}>Escribe una reseña</Text>
        <Text style={styles.username}>Nombre de usuario</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={(text: string) => setUsername(text)}
        />
        <Text style={styles.username}>Reseña</Text>
        <TextInput
          style={styles.input}
          value={reseña}
          onChangeText={(text: string) => setReseña(text)}
        />
      </View>

      <View style={styles.fixToText}>
        <Button
        
          title="Right button"
          onPress={saveData}
        />
      </View>

      {/* Boton para cerrar */}
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Icon color="white" name="arrow-back-outline" size={60} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    // backgroundColor: 'red',
    // overflow: 'hidden',
    width: '50%',
    margin:30,
    left: 70 ,
    height: screenHeight * 0.4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.24,
    shadowRadius: 7,

    elevation: 9,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },

  imageBorder: {
    flex: 1,
    overflow: 'hidden',
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },
  posterImage: {
    flex: 1,
  },

  marginContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },
  subTitle: {
    fontSize: 16,
    opacity: 0.8,
    alignContent: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  tittle: {
   textAlign: 'center',
    color: '#9A9A9A',
  },
  subTittle: {
    top: 10,
   textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    zIndex: 999,
    elevation: 9,
    top: 30,
    left: 5,
    color: '#0a0a0a' ,
  },
  input: {
    top: 10,
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 5,

    //padding: 10,
  },
  fixToText: {
    top:15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'flex-end',
    left: 250,
    marginBottom:50
  },
  description:{
    alignItems: 'center',
    top: 15,
    margin: 10,
    justifyContent: 'center'
  },
  reseña:{
    left:25,
    fontSize: 20
  },
  username:{
    left: 25,
    top:15
  }
});
