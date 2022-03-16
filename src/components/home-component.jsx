import { Box, Tab, OutlinedInput, LinearProgress, Button, IconButton, InputAdornment} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState, useEffect, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';

import DataStore from '../data-store';
import Sidebar from './sidebar-component';

import './home-styles.css'

function Home() {
    const [activeTabIndex, setActiveTabIndex] = useState("1");
    const [searchParam, setSearchParam] = useState("Great");
    const [movieList, setMovieList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [moreToLoad, setMoreToLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState();
    const gridRef = useRef();
    const dataStore = new DataStore();

    useEffect(() => {
        setLoading(true);
        fetchMovies('Great', []);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchParam]);

    async function fetchMovies(searchParam, list) {
        if (searchParam) {
            let first10Movies = [];
            let res1 = await axios.get("http://www.omdbapi.com/?apikey=aef3137f&s=" + searchParam + "&page=" + currentPage);
            if(!res1 || !res1.data || !res1.data.Search || res1.data.Search.length === 0){
                setLoading(false);
                return;
            }
            for(let movie of res1.data.Search){
                const fullMovie = await axios.get("http://www.omdbapi.com/?apikey=aef3137f&i=" + movie.imdbID);
                first10Movies.push({
                    id: movie.imdbID,
                    title: fullMovie.data.Title,
                    poster: fullMovie.data.Poster,
                    rating: fullMovie.data.imdbRating,
                    plot: fullMovie.data.Plot,
                    duration: fullMovie.data.Runtime,
                    genre: fullMovie.data.Genre,
                    releaseDate: fullMovie.data.Released,
                    cast: fullMovie.data.Actors,
                    isFavorite:  dataStore.favorites && dataStore.favorites.includes(movie.imdbID) ? true : false,
                })
            }
            
            let movies = list;
            if(movies.length > 0){
                movies.push(...first10Movies);
                setMovieList(movies)
            } else {
                movies = first10Movies;
                setMovieList(first10Movies);
            }
            let second10Movies = [];
            let res2 = await axios.get("http://www.omdbapi.com/?apikey=aef3137f&s=" + searchParam + "&page="+(currentPage+1));
            if(!res2 || !res2.data || !res2.data.Search || res2.data.Search.length === 0){
                setLoading(false);
                return;
            }
            for(let movie of res2.data.Search){
                const fullMovie = await axios.get("http://www.omdbapi.com/?apikey=aef3137f&i=" + movie.imdbID);
                second10Movies.push({
                    id: movie.imdbID,
                    title: fullMovie.data.Title,
                    poster: fullMovie.data.Poster,
                    rating: fullMovie.data.imdbRating,
                    plot: fullMovie.data.Plot,
                    duration: fullMovie.data.Runtime,
                    genre: fullMovie.data.Genre,
                    releaseDate: fullMovie.data.Released,
                    cast: fullMovie.data.Actors,
                    isFavorite:  dataStore.favorites && dataStore.favorites.includes(movie.imdbID) ? true : false,
                })
            }
            
            if(second10Movies.length>0){
                movies.push(...second10Movies);
                setMovieList( movies);
                setCurrentPage(currentPage+2);
                if(second10Movies.length < 10){
                    setMoreToLoad(false);
                }
            }
            setLoading(false);
        } else {
            setMovieList([]);
            setLoading(false);
        }
    }


    const handleChange = (event, newValue) => {
        setActiveTabIndex(newValue);
    };

    const onScroll = () => {
        if (gridRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = gridRef.current;
          if (scrollHeight - scrollTop - clientHeight < 3 && !loading) {
            setLoading(true);
            if(moreToLoad){
                fetchMovies(searchParam, movieList); 
            } else {
                setLoading(false);
            }
          }
        }
      };

    const movieGrid = (list) => {
        let text = '';
        if(activeTabIndex === "2"){
            list.sort((a,b)=>
                b.rating - a.rating
            )
        } else if(activeTabIndex === "3"){
            list = list.filter(movie => movie.isFavorite);
            text = "Nothing Added to Favorites";
        }
        return (
            <div className='movie-grid' ref={gridRef} onScroll={onScroll}>
                {list && list.length > 0 ? list.map((movie, index) => {
                    return (
                        <div className='movie-card' key={index}
                            onClick={()=>{
                                setOpenSidebar(true);
                                setSelectedMovie(movie);
                            }}>
                            { movie.isFavorite ? <StarIcon className='star-icon'/> : <StarBorderIcon className='star-icon'/>}
                            <img width='100%' className='poster' src={movie.poster}
                                onError= {(e)=>{
                                    e.target.src = "image-not-found.png" 
                                }
                                } />
                            <p style={{textAlign:"center"}}>{movie.title}</p>
                        </div>
                    )
                })
                : <h4>{text}</h4>
            }
            </div>
        )
    }

    const search = ()=> {
        setLoading(true);
        fetchMovies(searchParam, []);
    }

    return (
        <div>
            {openSidebar && <Sidebar movie = {selectedMovie} open={openSidebar} setOpen={setOpenSidebar}/>}
            <TabContext value={activeTabIndex}>
                <Box sx={{ borderBottom: 1, borderColor: "#949085" }}>
                    <TabList onChange={handleChange}>
                        <Tab className='tab-header' label={<span style={{ color: activeTabIndex === "1" ? '#1ce3d6' : '#81ce31'}}>All</span>} value="1" />
                        <Tab className='tab-header' label={<span style={{ color: activeTabIndex === "2" ? '#1ce3d6' : '#81ce31'}}>Trending</span>} value="2" />
                        <Tab className='tab-header' label={<span style={{ color: activeTabIndex === "3" ? '#1ce3d6' : '#81ce31'}}>Favorites</span>} value="3" />
                    </TabList>
                </Box>
                <div style={{display:'flex', justifyContent:"center", alignItems:"center", flexDirection:'row'}}>
                    <OutlinedInput className='search-bar' value={searchParam}
                        onChange={(event)=>{
                            setSearchParam(event.target.value);
                        }}
                        onKeyUp={(event)=>{
                            if(event.key === 'Enter'){
                                event.preventDefault();
                                search();
                            }
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={search}
                                edge="end"
                              >
                                  <SearchIcon/>
                              </IconButton>
                            </InputAdornment>
                        }
                    />

                </div>
                {loading && <LinearProgress/>}
                <TabPanel value="1">
                    {movieGrid([...movieList])}
                </TabPanel>
                <TabPanel value="2">
                    {movieGrid([...movieList])}
                </TabPanel>
                <TabPanel value="3">
                    {movieGrid([...movieList])}
                </TabPanel>
            </TabContext>
        </div>
    );
}

export default Home;
