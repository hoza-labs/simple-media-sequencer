// class for mediaList array
function image(url, optionList)
{
    this.url = url;
    parse(this, optionList);
}

// class for mediaList array
function audio(url, optionList)
{
    this.url = url;
    parse(this, optionList);
}

// class for mediaList array
function video(url, optionList)
{
    this.url = url;
    this.volume = 0.0; // default volume for video
    parse(this, optionList);
}

// parse the options as described in medalist.js
function parse(media, optionList)
{
    if (!optionList) optionList = '';
    var options = optionList.split(';');
    
    // init style
    media.style = '';
    
    for(var i in options)
    {
        var option = options[i].trim();
        if (option)
        {
            var parts = option.split(':');
            if (parts.length != 2) alert('invalid option ' + option);
            var name = parts[0].trim().toLowerCase();
            var value = parts[1].trim();
            
            media[name]=value;
            
            // add to styles but exclude specific options
            switch(name)
            {
                case 'start':
                case 'stop':
                case 'volume':
                    break; // exclude
                default:
                    media.style += ' ' + option + ';';
                    break;
            } // end switch
        } // end if
    } // next option
    
    // add default width to style if the option was explicitly specified
    if (!media.width) media.style += ' width: 60%;';
}


var CONTENT = '.content';
var NOWPLAYING = '.now-playing';
var DEBUG = '.debug';
var MEDIA = '.media';

// index refers to mediaList array, but increments twice for each array index
// even numbers are for 'ready' state; odd numbers are for when media is presented.
var index = null;
var hDelayPlayTimeout = null;
var hInterruptTimeout = null;
var hDurationTimeout = null;
var halt = false;
var playingElement = null;

// main
$(document).ready(function()
{
    $(document).on('keydown', document_keydown);
    
    index = 0;
    setTitle();
    
    $(CONTENT).text('');
});


// keydown handler
function document_keydown(event)
{
    // event.Key == 'Left' when event.keyCode == 37
    // var left = 37, up = 38, right= 39, down = 40;

    $(DEBUG).text(event.key);

    switch (event.key)
    {
        case 'Enter':
        case 'ArrowRight':
            goforward();
            break;
            
        case 'ArrowLeft':
            gobackward();
            break;
    }
    
}

function goforward()
{
    stopMedia();
    index++;
    if (index >= mediaList.length*2) index = 0;
    setTitle();
    presentMedia();
}

function gobackward()
{
    index--;
    stopMedia();
    if (index<0) index=0;
    if (index % 2) index--;
    setTitle();
}

// sets title according to global variable index
function setTitle()
{
    var media = getMedia();
    
    var title = (index % 2 ? 'presenting ' :  'ready for ');

    title += '#' + (mediaIndex() + 1) + ' ';
    title += media.url;

    title += ' (' + (
                (media instanceof image) ? 'image' :
                (media instanceof audio) ? 'audio' : 
                (media instanceof video) ? 'video' :
                'unknown format'
                ) + ')';

    $(NOWPLAYING).text(title);
}

function getMedia()
{
    return mediaList[ mediaIndex() ];
}

function mediaIndex()
{
    return Math.floor(index/2);
}

function presentMedia()
{
    if (index % 2 == 0) return; // -------- note early exit -----------
    
    var media = getMedia();
    if (media instanceof image) presentImage(media);
    else if (media instanceof audio) presentAudio(media);
    else if (media instanceof video) presentVideo(media);
}

function stopMedia()
{
    halt = true;
    playingElement = null;
    if (hDelayPlayTimeout) { clearTimeout(hDelayPlayTimeout); hDelayPlayTimeout = null; }
    if (hInterruptTimeout) { clearTimeout(hInterruptTimeout); hInterruptTimeout = null; }
    if (hDurationTimeout) { clearTimeout(hDurationTimeout); hDurationTimeout = null; }
    stop($(MEDIA)[0]);
    $(CONTENT).text('');
    $(DEBUG).text('stop');
}

function presentImage(media)
{
    halt = false;
    playingElement = media; // in this case 'playingElement' is a media object; for audio and video it will be the DOM element
    
    // delay showing the image
    $(DEBUG).text('imageDelay');
    hDelayPlayTimeout = setTimeout(function()
    {
        hDelayPlayTimeout = null;
        if (halt || playingElement != media) return; // --------- note early exit --------
        
        $(CONTENT).html('<img style="' + media.style + '" />');
        $(DEBUG).text('image');
        var img = $('img')[0];
        img.src = media.url;
    }, mediaDelay_ms);
    
    // ensure image is hidden after the specified duration
    hDurationTimeout = setTimeout(function() { hDurationTimeout = null; goforward(); }, mediaDelay_ms + mediaDuration_ms);
}

function presentAudio(media)
{
    $(DEBUG).text('audio');
    $(CONTENT).html('<audio class="media" style="' + media.style + '" />');

    var audio = $('audio')[0];
    hide(audio);
    audio.src = media.url;
    $('audio').ready(new function() { startLoop(audio, media.start, media.stop) });
}

function presentVideo(media)
{
    $(DEBUG).text('video');
    $(CONTENT).html('<video class="media" style="' + media.style + '" />');

    var video = $('video')[0];
    hide(video);

    video.volume = media.volume;
    video.src = media.url + (media.start ? '#t=' + media.start : '');
    
    $('video').ready(new function() { startLoop(video, media.start, media.stop) });
}

function stop(element)
{
    if (element && element.pause) { element.pause(); $(DEBUG).text('interrupted'); }
}

function startLoop(element, start, stop)
{
    // green light
    halt = false;
    playingElement = element;

    if (start)
    {
        element.addEventListener('loadedmetadata', function() { element.currentTime = start; });
    }
    
    // set up loop
    if (!stop) // playing to end
    {
        element.addEventListener('ended', function() { delayPlay(element, start, stop); });
    }
    else // stopping after a specified number of seconds
    {
        if (!start) start = 0;
        hInterruptTimeout = setTimeout(function() { delayPlay(element, start, stop); }, mediaDelay_ms + (stop-start)*1000);
    }
    
    // start it going after a delay
    delayPlay(element, start, stop);
    
    // ensure media stops after the max duration
    hDurationTimeout = setTimeout(function() { hDurationTimeout = null; goforward(); }, mediaDelay_ms + mediaDuration_ms);
}

function delayPlay(element, start, stop)
{
    if (halt || playingElement != element) return; // ------- note early exit ---------

    $(DEBUG).text('delayPlay');
    var delay = mediaDelay_ms; // from medialist.js
    
    if (start && element.readyState == 4) try { element.pause(); element.currentTime = start; } catch(ex) { }
    hide(element);
    
    if (stop) // stopping after a specified number of seconds
    {
        if (!start) start = 0;
        hInterruptTimeout = setTimeout(function() { delayPlay(element, start, stop); }, mediaDelay_ms + (stop-start)*1000);
    }
    
    hDelayPlayTimeout = setTimeout(function()
    {
        $(DEBUG).text('playing');
        hDelayPlayTimeout = null;
        if (!halt && playingElement == element)
        {
            if (start) 
            {
            	$(DEBUG).text('buffering');
            	var buffering = true;
            	element.addEventListener('timeupdate', function() 
            	{
            		if( element.currentTime > start )
            		{ 
            			if (buffering) 
            			{ 
            				buffering = false; 
            				element.style.marginTop = '0px'; 
            			}
            			$(DEBUG).text(Math.floor(element.currentTime)); 
            		}
            	});
    		element.style.marginTop = '5000px';
    		show(element);
    		element.play();
    		element.currentTime = start; 
            }
            else
            {
            	element.addEventListener('timeupdate', function()
            	{
            		$(DEBUG).text('('+Math.floor(element.currentTime)+')');
            	});
            	show(element);
            	element.play();
            }
        }
    }, delay);
}

function hide(element)
{
    if( !element.savedDisplayMode ) element.savedDisplayMode = element.style.display ? element.style.display : 'inline';
    element.style.display = 'none';
}

function show(element)
{
    element.style.display = element.savedDisplayMode;
}

// audio/video: controls autoplay loop