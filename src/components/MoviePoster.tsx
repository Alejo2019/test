import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Item} from '../interfaces/movieInterface';
import {useNavigation} from '@react-navigation/core';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface Props {
  movie: Item;
  height?: number;
  width?: number;
}

export const MoviePoster = ({movie}: Props) => {
  const uri = `${movie.volumeInfo.imageLinks.smallThumbnail}`;
  const navigation = useNavigation();
  //console.log(movie)
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DetailScreen', movie)}
      activeOpacity={0.8}
      style={{
        width: 200,
        height: 200,
        marginHorizontal: 2,
        paddingBottom: 20,
        paddingHorizontal: 7,
      }}>
      <View style={styles.imageContainer}>
        <Image source={{uri}} style={styles.image} />
      </View>
      <Text style={styles.tittle}>{movie.volumeInfo.title}</Text>
      <Text>{movie.volumeInfo.authors}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    borderRadius: 18,
   
  },
  imageContainer: {
    flex: -1,
    height: 250,
    width: 150,
    justifyContent: 'center',
    alignContent: 'center',
    left: 25,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.24,
    shadowRadius: 7,

    elevation: 9,
  },
  tittle: {
    top: 10,
  },
});
