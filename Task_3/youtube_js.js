'use strict'
var items = document.querySelector('.items');
var clickSearch = document.querySelector('.submitSearch');

clickSearch.onclick = function() {
	doSearch();
}

function doSearch() {
	var inputString = document.querySelector('input');

    items.innerHTML = '';
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
                         '<div class='+'publishDate'+'>'+'<p>'+'<b>Publication date: </b>'+clipList[i].publishDate+'</p>'+'</div>';                   
        items.appendChild(newDiv);
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

/*for slide items*/
var previousDiffX = 0;
var diffX;
var dragX;
var startX;
var currentPage = 1;
var lastPage = 0;

items.addEventListener('mousedown',dragStart);
items.addEventListener('mouseup',dragEnd);   

function dragStart(e){
    this.style.transition="all 0.0s ease-in-out"
    startX = e.clientX;
    items.addEventListener('mousemove',drag);
}

function drag(e){
    dragX = e.clientX;
    diffX = dragX - startX;
    items.style.webkitTransform="translateX("+(diffX + previousDiffX)+"px)";
}

function dragEnd(e){
    items.removeEventListener('mousemove',drag);   
    items.style.transition = "all 0.5s ease-in-out 0s";

    if (Math.abs(diffX) < 100) {
        items.style.webkitTransform = "translateX("+previousDiffX+"px)";
    }

    if (diffX < -100) {
    	if (currentPage != 5) {
	    	previousDiffX = previousDiffX - document.body.offsetWidth;
	        this.style.webkitTransform = "translateX(" + previousDiffX + "px)"; 
        	currentPage = currentPage + 1;
            changePoint(currentPage);
    	} else  items.style.webkitTransform = "translateX("+previousDiffX+"px)";    
    }

    if (diffX > 100) {
        if(currentPage != 1) {
	        previousDiffX = previousDiffX + document.body.offsetWidth;
	        this.style.webkitTransform = "translateX("+previousDiffX+"px)";
	        currentPage = currentPage - 1;
            changePoint(currentPage);
        } else items.style.webkitTransform = "translateX("+previousDiffX+"px)";
    }
}
/*JS for dots*/
var arrDot = [];
arrDot = document.querySelectorAll('ul > li');

var currentDot;

for (var i = 0; i < 5; ++i) {
    arrDot[i].onclick = onclickEvent;
}
function onclickEvent (e) {
    var visited = 0;
    (function currentD() {
        for (var i = 0; i < 5; ++i) {
            if (arrDot[i].className === 'current') {
                currentDot = arrDot[i];
                visited = i;
            }
        }
    })();
    currentDot.className = 'visited';
    this.className = 'current';
    for (var i = 0; i < 5; ++i) {
        if (arrDot[i].className === 'current') {
            if (i-visited > 0) {
                previousDiffX = previousDiffX - document.body.offsetWidth*(Math.abs(i-visited));
                items.style.webkitTransform = "translateX("+previousDiffX+"px)";
                currentPage = currentPage + (Math.abs(i-visited));
            } else {
                previousDiffX = previousDiffX + document.body.offsetWidth*(Math.abs(i-visited));
                items.style.webkitTransform = "translateX("+previousDiffX+"px)";
                currentPage = currentPage - (Math.abs(i-visited));
            }
        }
    }

}

function changePoint(numPage) {
        for (var i = 0; i < 5; ++i) {
            if (arrDot[i].className === 'current') {
                currentDot = arrDot[i];
            }
        }
    currentDot.className = 'visited';
    arrDot[numPage-1].className = 'current';
}


