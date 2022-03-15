import { Box, Tab, OutlinedInput, LinearProgress, Button, IconButton, InputAdornment} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState, useEffect, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

import './home-styles.css'

function Home() {
    const [activeTabIndex, setActiveTabIndex] = useState('1');
    const [searchParam, setSearchParam] = useState();
    const [movieList, setMovieList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [moreToSearch, setMoreToSearch] = useState(true);
    const [loading, setLoading] = useState(false);
    const gridRef = useRef();

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
                    title: fullMovie.data.Title,
                    poster: fullMovie.data.Poster,
                    rating: fullMovie.data.imdbRating,
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
                    title: fullMovie.data.Title,
                    poster: fullMovie.data.Poster,
                    rating: fullMovie.data.imdbRating,
                })
            }
            
            if(second10Movies.length>0){
                movies.push(...second10Movies);
                setMovieList( movies);
                setCurrentPage(currentPage+2);
                if(second10Movies.length < 10){
                    setMoreToSearch(false);
                }
            }
            setLoading(false);
        } else {
            setMovieList([]);
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        setSearchParam('avengers');
        fetchMovies('avengers', []);
    }, []);

    useEffect(() => {
        setMovieList([]);
        setCurrentPage(1);
    }, [searchParam]);

    const handleChange = (event, newValue) => {
        setActiveTabIndex(newValue);
    };

    const onScroll = () => {
        if (gridRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = gridRef.current;
          if (scrollHeight - scrollTop - clientHeight < 3 && !loading) {
            setLoading(true);
            fetchMovies(searchParam, movieList);
          }
        }
      };

    const movieGrid = (list) => {
        if(activeTabIndex === "2"){
            list.sort((a,b)=>
                b.rating - a.rating
            )
        }
        return (
            <div className='movie-grid' ref={gridRef} onScroll={onScroll}>
                {list && list.length > 0 && list.map((movie, index) => {
                    return (
                        <div className='movie-card' key={index}>
                            <img width='100%' src={movie.poster} alt='No Poster' />
                            <p>{movie.title}</p>
                        </div>
                    )
                })}
            </div>
        )
    }

    const search = ()=> {
        setLoading(true);
        fetchMovies(searchParam, []);
    }

    return (
        <div>
            <TabContext value={activeTabIndex}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <Tab label={<span style={{ color: activeTabIndex === "1" ? '#D8E9A8' : '#4E9F3D'}}>All</span>} value="1" />
                        <Tab label={<span style={{ color: activeTabIndex === "2" ? '#D8E9A8' : '#4E9F3D'}}>Trending</span>} value="2" />
                        <Tab label={<span style={{ color: activeTabIndex === "3" ? '#D8E9A8' : '#4E9F3D'}}>Favorites</span>} value="3" />
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
                {loading && <LinearProgress style={{margin:'5px'}}/>}
                <TabPanel value="1">
                    {movieGrid([...movieList])}
                </TabPanel>
                <TabPanel value="2">
                    {movieGrid([...movieList])}
                </TabPanel>
                <TabPanel value="3">Item Three</TabPanel>
            </TabContext>
        </div>
    );
}

export default Home;
