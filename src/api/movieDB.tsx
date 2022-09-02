import axios from 'axios';

const bookDB = axios.create({
    baseURL: 'https://www.googleapis.com/books/v1',
});


export default bookDB;
