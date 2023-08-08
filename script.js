let now_playing = document.querySelector('.details');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let randomIcon = document.querySelector('.fa-random');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const music_list = [
    {
        img : 'images/swift.png',
        name : "All Too Well (Taylor's Version)",
        artist : 'Taylor Swift',
        music : 'music/alltoowell.mp3'
    },
    {
        img : 'images/taylor.png',
        name : "Love Story",
        artist : 'Taylor Swift',
        music : 'music/lovestory.mp3'
    },
    {
        img : 'images/sosa.png',
        name : "Love Story",
        artist : 'Chief Keef',
        music : 'music/playboi carti - immortal (prod. cash carti).mp3'
    }
];

// Integration #1 - Fetch Lyrics from Genius API
const geniusApiKey = 'f2f2afcf66msh321fcc28239d764p18ba74jsn89e0721ddc93'; // Replace with your actual Genius API key

async function fetchLyrics() {
    try {
        const response = await fetch('https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=2396871', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': geniusApiKey
            }
        });

        const data = await response.json();
        const lyricsContent = document.getElementById('lyrics-content');
        lyricsContent.textContent = data.lyrics;
    } catch (error) {
        console.error('Error fetching lyrics:', error);
    }
}
fetchLyrics();

// Integration #2 - Fetch Albums and Related Artists from Spotify API
const spotifyApiKey = 'f2f2afcf66msh321fcc28239d764p18ba74jsn89e0721ddc93'; // Replace with your actual Spotify API key

async function fetchAlbumsAndArtists() {
    try {
        const response = await fetch('https://spotify23.p.rapidapi.com/search/?q=q&type=multi&offset=0&limit=10&numberOfTopResults=5', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': spotifyApiKey
            }
        });

        const data = await response.json();

        const albumsContent = document.getElementById('albums-content');
        const artistsContent = document.getElementById('artists-content');

        if (Array.isArray(data.albums)) {
            data.albums.forEach(album => {
                const albumLink = document.createElement('a');
                albumLink.href = album.spotifyLink;
                albumLink.target = '_blank';
                albumLink.textContent = album.name;
                albumsContent.appendChild(albumLink);
                albumsContent.appendChild(document.createElement('br'));
            });
        }

        if (Array.isArray(data.artists)) {
            data.artists.forEach(artist => {
                const artistLink = document.createElement('a');
                artistLink.href = artist.spotifyLink;
                artistLink.target = '_blank';
                artistLink.textContent = artist.name;
                artistsContent.appendChild(artistLink);
                artistsContent.appendChild(document.createElement('br'));
            });
        }

    } catch (error) {
        console.error('Error fetching albums and artists:', error);
    }
}

fetchAlbumsAndArtists();

loadTrack(track_index);

function loadTrack(track_index){
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[track_index].music;
    curr_track.load();

    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;

    updateTimer = setInterval(setUpdate, 1000);

    curr_track.addEventListener('ended', nextTrack);
}

function reset(){
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}
function randomTrack(){
    isRandom ? pauseRandom() : playRandom();
}
function playRandom(){
    isRandom = true;
    randomIcon.classList.add('randomActive');
}
function pauseRandom(){
    isRandom = false;
    randomIcon.classList.remove('randomActive');
}
function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}
function playTrack(){
    curr_track.play();
    isPlaying = true;

    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;

    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
function nextTrack(){
    if(track_index < music_list.length - 1 && isRandom === false){
        track_index += 1;
    }else if(track_index < music_list.length - 1 && isRandom === true){
        let random_index = Number.parseInt(Math.random() * music_list.length);
        track_index = random_index;
    }else{
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}
function prevTrack(){
    if(track_index > 0){
        track_index -= 1;
    }else{
        track_index = music_list.length -1;
    }
    loadTrack(track_index);
    playTrack();
}
function seekTo(){
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}
function setUpdate(){
    let seekPosition = 0;
    if(!isNaN(curr_track.duration)){
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}
