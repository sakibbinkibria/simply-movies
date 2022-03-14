import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState } from 'react';
import DataStore from '../data-store';

function Home() {
    const [activeTabIndex, setActiveTabIndex] = useState('1');
    const handleChange = (event, newValue) => {
        setActiveTabIndex(newValue);
    };
    return (
        <div>
            <TabContext value={activeTabIndex}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <Tab label={<span style={{ color: activeTabIndex === "1" ? '#E9A6A6' : '#864879'}}>All</span>} value="1" />
                        <Tab label={<span style={{ color: activeTabIndex === "2" ? '#E9A6A6' : '#864879'}}>Trending</span>} value="2" />
                        <Tab label={<span style={{ color: activeTabIndex === "3" ? '#E9A6A6' : '#864879'}}>Favorites</span>} value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    {DataStore.movies && DataStore.movies.length > 0 && DataStore.movies.map((movie)=>{
                        console.log(movie);
                        return <p><img height="200" src={movie.Poster}/>{movie.Title}</p>
                    })}
                </TabPanel>
                <TabPanel value="2">Item Two</TabPanel>
                <TabPanel value="3">Item Three</TabPanel>
            </TabContext>
        </div>
    );
}

export default Home;
