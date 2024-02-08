const bars = document.querySelector(".bars");
const leftNavBar = document.querySelector(".leftNavBAr");
const rightVideosCard = document.querySelector(".rightVideosCard");

const search = document.querySelector(".fa-magnifying-glass");
const SearchBar = document.querySelector(".SearchBar");
const searchInput = document.querySelector(".searchInput");
const logoRight = document.querySelector(".logoRight");
const searchBtn = document.querySelector(".searchBtn");
const ProfileRight = document.querySelector(".ProfileRight");
const VideoCardsHolder = document.querySelector(".VideoCardsHolder");
const thumbImg = document.querySelector(".thumbImg");
let videoCard;
const thumbnail = document.querySelector(".thumbnail");

// Hide show Side Navbar Function
bars.addEventListener("click", hideLeftNav);
// let mainScreenFlag;
function hideLeftNav(e) {
  e.preventDefault();
  leftNavBar.classList.toggle("hideNav"); //adding a class to hide side nav

  if (leftNavBar.classList.contains("hideNav")) {
    leftNavBar.style.width = "0";
    rightVideosCard.style.width = "100%"; //making main screen full when nav hidden

    
  } else {
    leftNavBar.style.width = "20%";
    rightVideosCard.style.width = "80%"; //making main screen 80% when nav visible
    // mainScreenFlag = false;
  }
}

// for mobile view only
search.addEventListener("click", function (e) {
  let TargetClass = e.target.classList;
  // console.log(TargetClass);

  if (TargetClass.contains("fa-magnifying-glass") && width <= 600) {
    // console.log("Anuj");
    logoRight.style.display = "none";

    searchInput.style.display = "block";
    searchInput.style.flexGrow = "0";

    ProfileRight.style.marginRight = "20px";

    SearchBar.style.marginLeft = "20px";
    SearchBar.style.width = "330px";

    searchBtn.style.width = "55px";
    searchBtn.style.height = "100%";
    searchBtn.style.transition = "none";
    searchBtn.style.backgroundColor = "#303030";
    searchBtn.style.borderBottomRightRadius = "30px";
    searchBtn.style.borderTopRightRadius = "30px";
  } else {
    // console.log("Outside");
  }
});

// WindowsScreen Width Calculating
let width;
function updateSizeInfo() {
  width = window.innerWidth;
  // document.getElementById('size-info').textContent = `Current window width: ${width}px`;
  // console.log(`Current window width: ${width}px`);
  if (width > 600) {
    // console.log("Bigger Than 600");
  }
}

// Call the function initially and on window resize
window.addEventListener("resize", updateSizeInfo);
updateSizeInfo();



// video cards adding dynamically--------------------
const apiKey = "AIzaSyDZZXYwbbcNDrORLcYJDhwccxIhr2Lxla8";
const baseUrl = "https://www.googleapis.com/youtube/v3";

// THis function will take video id and returns the statics of the video

async function getVideoStatistics(videoId) {
  
  const endpoint = `${baseUrl}/videos?key=${apiKey}&part=statistics&id=${videoId}`;

  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    console.log(result.item[0].statistics, "hello");
    return result.item[0].statistics;
  } catch (error) {
    console.log("failed to load statistics");
  }
}
// Calculating Upload time
function calculateTheTimeGap(publishTime) {
  let publishDate = new Date(publishTime);
  let currentDate = new Date();

  let secondsGap = (currentDate.getTime() - publishDate.getTime()) / 1000;

  const secondsPerDay = 24 * 60 * 60;
  const secondsPerWeek = 7 * secondsPerDay;
  const secondsPerMonth = 30 * secondsPerDay;
  const secondsPerYear = 365 * secondsPerDay;

  if (secondsGap < secondsPerDay) {
    return `${Math.ceil(secondsGap / (60 * 60))}hrs ago`;
  }
  if (secondsGap < secondsPerWeek) {
    return `${Math.ceil(secondsGap / secondsPerWeek)} weeks ago`;
  }
  if (secondsGap < secondsPerMonth) {
    return `${Math.ceil(secondsGap / secondsPerMonth)} months ago`;
  }

  return `${Math.ceil(secondsGap / secondsPerYear)} years ago`;
}



async function fetchSearchResults(searchString) {
  //searcString is the search input user entering
  const endPoint = `${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=60`;
  console.log(`searchValue ${searchString}`);
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    console.log(result);

    renderVideosOntoUI(result.items);
  } catch (error) {
    
  }
}

searchBtn.addEventListener("click", () => {
  const searchValue = searchInput.value;
  console.log(searchValue);
  fetchSearchResults(searchValue);
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchValue = searchInput.value;
    console.log(searchValue);
    fetchSearchResults(searchValue);
  }
});
fetchSearchResults("people are amazing");


function renderVideosOntoUI(videosList) {
  VideoCardsHolder.innerHTML = "";
  //videosList will be an array of videos objects
  videosList.forEach((video) => {
    videoCard = document.createElement("div");
    videoCard.addEventListener("click", (event)=>{
      console.log("clicked")
       event.preventDefault();
       const videoIdToSave = video.id.videoId;
       getVideoStatistics(videoIdToSave);
       
       openVideoPage(videoIdToSave, video.snippet.title, video.snippet.channelTitle);
     },{passive:true})
    videoCard.className = "videoCard";
    
    videoCard.innerHTML = `
    
    <div class="thumbnail">
    <img class="thumbImg" 
    src="${video.snippet.thumbnails.high.url}"
     alt="thumbnail" />
    <p class="timeStamp">5:10</p>
  </div>
  <div class="bottomCard">
    <div class="channelDP">
      <img src="./assets/images/User.svg" alt="channelLogo" />
    </div>
    <div class="titleDisc">
      <p class="vidTitle">
       ${video.snippet.title}
      </p>
      <p class="channelName">${video.snippet.channelTitle}</p>
      <p class="uploadTime">35M views • ${calculateTheTimeGap(video.snippet.publishTime)}</p>
    </div>
  </div>
  `;

    VideoCardsHolder.appendChild(videoCard);
  });
}
const videoCardTiles = document.getElementsByClassName("videoCard");



function openVideoPage(videoId, vidTitle, videoChannelName){
  //localStorage.setItem("selectedVideoTitle",vidTitle);
  localStorage.setItem('selectedVideoTitleAndId', JSON.stringify({ title: vidTitle, id: videoId, channelName: videoChannelName }));

  window.location.href = "videoPage.html";
}

