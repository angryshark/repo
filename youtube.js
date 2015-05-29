'use strict'
var videoItems = document.querySelector('.videoItems');
var clickSearch = document.querySelector('.submitSearch');
var inputString = document.querySelector('.inputSearch');

clickSearch.onclick = function() {
	doSearch();
}

inputString.onkeydown = enterDown;

function enterDown(e) {
    e = e || window.event;
    if(e.keyCode === 13) {
        clickSearch.click();
    }
}

function doSearch() {
    videoItems.innerHTML = '';
	if (inputString.value === '') {
		return;
	} else {
        getResponse(inputString.value);
    }
}


function getResponse(searchString) {
    var APIkey = 'AIzaSyBtEdPEv4Diqrkyg9mRT2M-KjLfu_0qjCk';
    var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + searchString + '&maxResults=20&key=' + APIkey;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var clipList = convertYouTubeResponseToClipList(JSON.parse(xhr.responseText));
            doInnerContent(clipList);
        }
    }
    xhr.open("GET", url, true);
    xhr.send(null);
}

function doInnerContent (clipList) {
    for (var i = 0; i < 20; ++i) {
        var newDiv = document.createElement('div');
        newDiv.className = 'v' + (i+1) + ' ' + 'video';
        newDiv.innerHTML = '<div class='+'youtubeLink'+'><a href='+clipList[i].youtubeLink+'>'+clipList[i].title+'</a></div>'+
                         '<div class='+'thumbnail'+' style='+'background-image:url('+clipList[i].thumbnail+')></div>'+
                         '<div class='+'author'+'>'+'<p>'+'<b>Author: </b>'+clipList[i].author+'</p>'+'</div>'+
                         '<div class='+'description'+'>'+'<p>'+'<b>Description: </b>'+clipList[i].description+'</p>'+'</div>'+
                         '<div class='+'publishDate'+'>'+'<p>'+'<b>Publication date: </b><br>'+clipList[i].publishDate+'</p>'+'</div>';                   
        videoItems.appendChild(newDiv);
    }
}

function convertYouTubeResponseToClipList(rawYouTubeData) {
	var clipList = [];
    var items = rawYouTubeData.items;
    for (var i = 0; i < items.length; i++) {
    	var date = new Date(Date.parse(items[i].snippet.publishedAt));
        var shortId = items[i].id.videoId;
        clipList.push({
           	 id: shortId,    
             youtubeLink: "http://www.youtube.com/watch?v=" + shortId,
             title: items[i].snippet.title,
             thumbnail: items[i].snippet.thumbnails.medium.url,
             description: items[i].snippet.description,
             author: items[i].snippet.channelTitle,
             publishDate: date.toUTCString()
        });
    }
   	return clipList;
}