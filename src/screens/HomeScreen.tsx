import React from 'react';
import { ActivityIndicator, Dimensions, View, ScrollView, FlatList, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MoviePoster } from '../components/MoviePoster';
import { useMovies } from '../hooks/useMovies';


const { width: windowWidth } = Dimensions.get('window');

export const HomeScreen = () => {

    const { nowPlaying, isLoading } = useMovies();
    const { top } = useSafeAreaInsets();
   
 //console.log(nowPlaying)
    if ( isLoading ) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                <ActivityIndicator color="red" size={ 100 } />
            </View>
        )
    }


    return (

        <ScrollView>

            
            <View style={{ marginTop: top + 20 }}>
                
                {/* Carosel Principal */}
                <View style={{ height: '100%' }}>
                    <FlatList 
                        data={ nowPlaying }
                        renderItem={ ({ item }: any) => <MoviePoster movie={ item } /> }
                        numColumns={2}
                        //itemWidth={ 300 }
                        //inactiveSlideOpacity={0.9}

                        ListHeaderComponent={(
                            <Text style={{
                                top: top + 20,
                                marginBottom: top + 20,
                                paddingBottom: 10
                            }}>Books </Text>
                        )}
                    />
                </View>


            </View>
        </ScrollView>
    )
}
