import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  View,
  ScrollView,
  FlatList,
  Text,
  TextInput,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MoviePoster} from '../components/MoviePoster';
import {useMovies} from '../hooks/useMovies';

export const HomeScreen = () => {
  const {nowPlaying, isLoading} = useMovies();
  const {top} = useSafeAreaInsets();

  //console.log(nowPlaying)
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <ActivityIndicator color="red" size={100} />
      </View>
    );
  }

  return (
    <View style={{marginTop: top + 20}}>
      {/* Carosel Principal */}
      <View style={{height: '100%'}}>
      <Text
            style={{
              top: top + 20,
              marginBottom: top + 60,
              paddingBottom: 10,
              fontSize: 28,
              left: 125,
            }}>
            Bookshelves{' '}
          </Text>
        <FlatList
          data={nowPlaying}
          renderItem={({item}: any) => <MoviePoster movie={item} />}
          numColumns={2}
          //itemWidth={ 300 }
          //inactiveSlideOpacity={0.9}

          ListHeaderComponent={

            <TextInput
            placeholderTextColor="black"
            placeholder='Buscar pelicula'
            style={{
                height: 40, borderColor: 'gray', borderWidth: 1, fontSize: 15, marginHorizontal: 15,
                marginBottom: 5,
                paddingHorizontal: 15,
                borderBottomColor: '#000',
                flex: 1,
                borderRadius: 15,
                shadowColor: "#000",
            }}
        />
            
          }
        />
      </View>
    </View>
  );
};
