import './App.css';
import Home from './components/home-component';
import axios from 'axios';
import { useState, useEffect } from 'react';
import DataStore from './data-store';

function App() {
  const [searchParam, setSearchParam] = useState('avengers');
  async function fetchMovies(key) {
    const movies = await axios.get("http://www.omdbapi.com/?apikey=aef3137f&s="+searchParam);
    DataStore.movies = movies.data.Search;
  }

  useEffect(()=>{
    fetchMovies(searchParam)
  },[searchParam])

  return (
    <div className="app-container">
      <Home/>
    </div>
  );
}

export default App;
