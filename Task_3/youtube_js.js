var items = document.querySelector('.items');
var clickSearch = document.querySelector('.submitSearch');
clickSearch.onclick = function() {
	doSearch();
}

function doSearch() {
	items.innerHTML = '';
	var inputString = document.querySelector('input');
	if (inputString.value === '') {
		return;
	}
	var clipList = getResponse(inputString.value);
	for (var i = 0; i < 20; ++i) {
		var newDiv = document.createElement('div');
		newDiv.className = 'v' + (i+1) + ' ' + 'video';
		newDiv.innerHTML = '<div class='+'youtubeLink'+'><a href='+clipList[i].youtubeLink+'>'+clipList[i].title+'</a></div>'+
                         '<div class='+'thumbnail'+' style='+'background-image:url('+clipList[i].thumbnail+')></div>'+
                         '<div class='+'author'+'>'+'<p>'+'<b>Author: </b>'+clipList[i].author+'</p>'+'</div>'+
                         '<div class='+'description'+'>'+'<p>'+'<b>Description: </b>'+clipList[i].description+'</p>'+'</div>'+
                         '<div class='+'publishDate'+'>'+'<p>'+'<b>Publication date: </b>'+clipList[i].publishDate+'</p>'+'</div>'+
                         '<div class='+'viewCount'+'>'+'<p>'+'<b>View count: </b>'+clipList[i].viewCount+'</p>'+'</div>';                         
		items.appendChild(newDiv);
	}
}


function getResponse(searchString) {
    var xml = new XMLHttpRequest();
    var url = 'http://gdata.youtube.com/feeds/api/videos/?&v=2&alt=json&max-results=20&start-index=1&q=' + searchString;
    xml.open("GET", url, false);
    xml.send(null);
    var clipList = convertYouTubeResponseToClipList(JSON.parse(xml.responseText));
    return clipList;
}

function convertYouTubeResponseToClipList(rawYouTubeData) {
	var clipList = [];
    var entries = rawYouTubeData.feed.entry;
    if (entries) {
    	for (var i = 0, l = entries.length; i < l; i++) {
    		var entry = entries[i];
    		var date = new Date(Date.parse(entry.updated.$t));
            var shortId = entry.id.$t.match(/video:.*/).toString().split(":")[1];
           	clipList.push({
           		id: shortId,
                youtubeLink: "http://www.youtube.com/watch?v=" + shortId,
                title: entry.title.$t,
                thumbnail: entry.media$group.media$thumbnail[1].url,
                description: entry.media$group.media$description.$t,
                author: entry.author[0].name.$t,
                publishDate: date.toUTCString(),
                viewCount: entry.yt$statistics.viewCount
            });
        }
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


