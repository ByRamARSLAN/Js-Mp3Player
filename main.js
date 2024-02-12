const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");

const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");

const progressBar = document.getElementById("progress-bar");
const currentProgress = document.getElementById("current-progress");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");

// index şarkı için
let index;

// döngü
let loop = true;

// karıştırıcı açık mı?
let isShuffleActive = false;

//şarkı listesi
const songsList = [
  {
    name: "Kül",
    link: "assets/Kül.mp3",
    artist: "Cem Adrian",
    image: "assets/cem adrian.png",
  },
  {
    name: "Gelo Ew Ki Bu",
    link: "assets/gelo-ew-ki-bu.mp3",
    artist: "Aram Tigran",
    image: "assets/aram-tigran.png",
  },
  {
    name: "Dinle",
    link: "assets/dinle.mp3",
    artist: "Mahsun Kırmızıgül",
    image: "assets/mahsun.png",
  },
  {
    name: "Evin",
    link: "assets/Evin.mp3",
    artist: "Mem Ararat",
    image: "assets/mem-ararat.png",
  },
  {
    name: "Keyfa Mın Jı Tera Te",
    link: "assets/Xece.mp3",
    artist: "Xece",
    image: "assets/xece.png",
  },
];

// zaman formatı ayarlama

const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

// şarkı atama

const setSong = (arrayIndex) => {
    if(loop==true && isShuffleActive==true){
        arrayIndex = Math.floor(Math.random()*100)%songsList.length-1;
    }
    let { name, link, artist, image } = songsList[arrayIndex];
    audio.src = link;
    songName.innerText = name;
    songArtist.innerText = artist;
    songImage.src = image;
    audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
  };

  playListContainer.classList.add("hide");

  playAudio();
};

playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

// sıradakini çal

const nextSong = () => {
  if (loop) {
    if (index == songsList.length - 1) {
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length);
    setSong(randIndex);
  }
  playAudio();
};

const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

// şarkıyı çalma
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
};

const prevSong = () => {
  if (loop) {
    if (index == 0) {
      index = songsList.length - 1;
    } else {
      index -= 1;
    }
    setSong(index);
  }
};

nextButton.addEventListener("click", nextSong);
pauseButton.addEventListener("click", pauseAudio);
playButton.addEventListener("click", playAudio);
prevButton.addEventListener("click", prevSong);
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
  }
});

shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    isShuffleActive = false;
    shuffleButton.classList.remove("active");
    audio.loop = true;
  } else {
    isShuffleActive = true;
    shuffleButton.classList.add("active");
    audio.loop = false;
  }
});

const initializePlaylist = () => {
  for (let i in songsList) {
    playListSongs.innerHTML += `
        <li class="playlist-songs" onclick="setSong(${i})">
            <div class="playlist-image-container">
                <img src="${songsList[i].image}"/>
            </div>
            <div class="playlist-song-details">
                <span id="playlist-song-name">
                    ${songsList[i].name}
                </span>
                <span id="playlist-song-artist-album" >
                    ${songsList[i].artist}
                </span>
            </div>
        </li>
        `;
  }
};

// şarkı bitişini yakala
audio.onended = () => {
  nextSong();
};

setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

progressBar.addEventListener("click", (event) => {
  let coordStart = progressBar.getBoundingClientRect().left;

  let coordEnd = event.clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  currentProgress.style.width = progressBar * 100 + "%";

  audio.currentTime = progress * audio.duration;
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

//ekran yüklenildiğinde
window.onload = () => {
  index = 0;
  setSong(index);

  //durdur ve şarkı listesini oluştur

  pauseAudio();
  initializePlaylist();
};
