console.log("lets write a javascript")
let currentSong=new Audio();
let songs;
let currFolder;


function secondsToMinutesAndSeconds(seconds) {
    if(isNaN(seconds) || seconds<0){
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format the result as "mm:ss"
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currFolder=folder;
    let a=await fetch(`http://127.0.0.1:5500/${folder}/`)
    let  response=await a.text();

    let div=document.createElement("div")
    div.innerHTML=response;
     let as=div.getElementsByTagName("a")
    songs =[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index]; 
    if(element.href.endsWith(".mp3"))  {
       songs.push(element.href.split(`/${folder}/`)[1])
    }     
    }


        //all songs shown in library 
        let songUL=document.querySelector(".song-list").getElementsByTagName("ul")[0]
        songUL.innerHTML=""
        for (const song of songs){
            songUL.innerHTML=songUL.innerHTML + `<li> <img class=" invert" src="img/music-note-square-02-stroke-rounded.svg" alt="music">
                                
    
                                <div class="song-info">
                                    <div> ${song.replaceAll("%20"," ")} </div>
                                    <div>SG</div>
                                </div>
    
                                <div class="playnow">
                                    <span>Playnow</span>
                                    <img class="invert" src="img/play-circle-stroke-rounded.svg" alt="play">
                                    </div>
    
            
            </li>`;
        }
     
    //attach an event listener to each song
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element =>{
            
            console.log(e.querySelector(".song-info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".song-info")
            .firstElementChild.innerHTML.trim())
        })
    })

    return songs
 
}

const playMusic = (track,pause=false) => {

   currentSong.src=`/${currFolder}/` + track
   if(!pause){

       currentSong.play()
       play.src="img/pause.svg"
   }
    document.querySelector(".info-song").innerHTML= decodeURI(track)
     document.querySelector(".song-time").innerHTML="00:00 / 00:00"

}

async function displayAlbum(){
    let a=await fetch(`http://127.0.0.1:5500/Songs/`)
    let  response=await a.text();

    let div=document.createElement("div")
    div.innerHTML=response;
    console.log(div)
}

 async function main(){

    
    //get the list of all songs
    await getSongs("Songs/cs");
    playMusic(songs[0],true)

    //display all the  album on the page
    displayAlbum()
    
      


//Attach an event listener to play,next and previous
    play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="img/pause.svg"
    }
    else{
        currentSong.pause()
        play.src="img/play.svg"
    }
})

//listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".song-time").innerHTML=`${secondsToMinutesAndSeconds(currentSong.currentTime)} / 
        ${secondsToMinutesAndSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 + "%";
    })


    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=percent +"%";
        currentSong.currentTime=((currentSong.duration)*percent)/100
    })

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".leftbox").style.left="0"
    })

    //add an event listener for close button
    document.querySelector(".close-button").addEventListener("click",()=>{
            document.querySelector(".leftbox").style.left="-200%";

})

    //add an event listener for previous and next button
    previous.addEventListener("click",()=>{
        currentSong.pause()
        console.log("previous clicked")
        console.log(currentSong)

        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index - 1) >= 0){
            playMusic(songs[index-1])
        }
    })

    next.addEventListener("click",()=>{
        currentSong.pause()
        console.log("next clicked")

        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index + 1)<songs.length){
            playMusic(songs[index+1])
        }
    })

    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e,e.target,e.target.value)
        currentSong.volume=parseInt(e.target.value)/100
    })

    //add an event to listener to mute the volume
    document.querySelector(".volume>img").addEventListener("click",(e)=>{
        console.log(e.target)
        console.log("changing",e.target.src)
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }

        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume= 10
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
        
    })

    //load the playlist whenever card us clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    }) 

 }

main()
