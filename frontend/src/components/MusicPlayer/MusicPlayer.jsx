import "./MusicPlayer.scss";
import React from "react";
import { songs } from "../../objects/songs";
import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const MusicPlayer = ({containerClass}) => {
    const [currentSong, setCurrentSong] = useState(songs[0]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSongChange = (song) => {
        const index = songs.findIndex(s => s.id === song.id);
        setCurrentSong(song);
        setCurrentIndex(index);
    };

    const handleNextSong = () => {
        const nextIndex = (currentIndex + 1) % songs.length;
        setCurrentSong(songs[nextIndex]);
        setCurrentIndex(nextIndex);
    };

    const handlePreviousSong = () => {
        const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
        setCurrentSong(songs[prevIndex]);
        setCurrentIndex(prevIndex);
    };

    return (
        <div className={containerClass}>
            <div className="music-content-container">
                <AudioPlayer
                    src={currentSong.src}
                    onPlay={(e) => console.log("onPlay")}
                    header={`${currentSong.title}`}
                    showSkipControls={true}
                    showJumpControls={false}
                    onClickNext={handleNextSong}
                    onClickPrevious={handlePreviousSong}
                    onEnded={handleNextSong}
                />
            </div>
        </div>
    );
}

export default MusicPlayer;