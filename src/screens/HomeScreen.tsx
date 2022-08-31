import React from 'react';
import { ActivityIndicator, Dimensions, View, ScrollView, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Carousel from 'react-native-snap-carousel';

import { MoviePoster } from '../components/MoviePoster';
import { useMovies } from '../hooks/useMovies';
import { HorizontalSlider } from '../components/HorizontalSlider';

const { width: windowWidth } = Dimensions.get('window');

export const HomeScreen = () => {

    const { nowPlaying, popular, topRated, upcoming, isLoading } = useMovies();
    const { top } = useSafeAreaInsets();
   

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
                        itemWidth={ 300 }
                        inactiveSlideOpacity={0.9}
                    />
                </View>


            </View>
        </ScrollView>
    )
}
