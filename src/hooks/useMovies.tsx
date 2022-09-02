import { useEffect, useState } from 'react';
import { Item } from '../interfaces/movieInterface';
import bookDB from '../api/movieDB';

interface MoviesState {
    nowPlaying: Item[];
}

export const useMovies = () => {

    const [ isLoading, setIsLoading ] = useState(true);
    const [ book, setBook ] = useState<MoviesState>({
        nowPlaying: []
    })


    const getMovies = async () => {
        
        const nowPlayingPromise = bookDB.get('/volumes?q=quilting');

        
        const resps = await Promise.all([ 
            nowPlayingPromise
        ]);


        setBook({
            nowPlaying: resps[0].data.items
        })

        setIsLoading( false );
    }

   
    useEffect(() => {
        // now_playing
        getMovies();

    }, [])



    return {
        ...book,
        isLoading
    }

}
