import { Drawer, IconButton, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useState } from 'react';

import DataStore from '../data-store';
import './sidebar-styles.css'

function Sidebar({ movie, open, setOpen }) {

    const [isFavorite, setIsfavorite] = useState(movie.isFavorite);
    const dataStore = new DataStore();

    const useStyles = makeStyles({
        paper: {
          background: "rgba(0,0,0,0)",
          fontFamily: 'Amazon Ember'
        }
      });

      const classes = useStyles();

    return (
        <Drawer
        classes={{ paper: classes.paper }}
            anchor={"right"}
            open={open}
            onClose={() => {
                setOpen(false)
            }}
        >
            {/* movie title, plot summary, duration, genre, release date and cast. */}
            <div className='sidebar-container'>
                <Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
                    <IconButton
                        className='star-icon-button-sidebar'
                        onClick={()=>{
                            if(isFavorite){
                                dataStore.favorites = dataStore.favorites.filter((id)=> id !== movie.id);
                                movie.isFavorite = false;
                                setIsfavorite(false);
                            } else {
                                dataStore.favorites.push(movie.id);
                                movie.isFavorite = true;
                                setIsfavorite(true);
                            }
                        }}
                    >
                        { isFavorite ? <StarIcon className='star-icon-sidebar'/> : <StarBorderIcon className='star-icon-sidebar'/>}
                    </IconButton>
                </Tooltip>  
                <img alt ='' src={movie.poster} className= 'sidebar-poster' />
                <p className='sidebar-title'>{movie.title}</p>
                <div className='details'>
                    <div><strong>Plot Summary: </strong> <p>{movie.plot}</p></div>
                    <div><strong>Duration: </strong><span>{movie.duration}</span></div>
                    <div><strong>Genre: </strong><span>{movie.genre}</span></div>
                    <div><strong>Release Date: </strong><span>{movie.releaseDate}</span></div>
                    <div><strong>Cast: </strong><span>{movie.cast}</span></div>
                    <div><strong>IMDB Rating: </strong><span>{movie.rating}</span></div>
                </div>
            </div>
        </Drawer>
    );
}

export default Sidebar;
