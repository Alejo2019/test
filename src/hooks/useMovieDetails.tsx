import { useEffect, useState } from 'react'
import movieDB from '../api/movieDB';
import { Item } from '../interfaces/movieInterface';

interface MovieDetails {
    isLoading: boolean;
    bookFull?: Item;
}


export const useMovieDetails = ( bookId: number ) => {

    const [state, setState] = useState<MovieDetails>({
        isLoading: true,
        bookFull: undefined,
    });


    const getMovieDetails = async() => {

        const bookDetailsPromise = movieDB.get<Item>(`/${ bookId }`);

        const [ bookDetailsResp ] = await Promise.all([ bookDetailsPromise ]);

        setState({
            isLoading: false,
            bookFull: bookDetailsResp.data
        })
    }

    useEffect(() => {
        getMovieDetails();
        
    }, []);


    return {
        ...state
    }
    
}
