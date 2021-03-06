// Copyright 2013 Google Inc. All Rights Reserved.
// You may study, modify, and use this example for any purpose.
// Note that this example is provided "as is", WITHOUT WARRANTY
// of any kind either expressed or implied.

/**
 * Handles user interaction and creates the player and ads controllers.
 */
var C8VpaidApp = function(player) {
    this.xmlBox_ = '';
    this.playButton_ = document.getElementById(player.playPause_);
    this.vastParser = new C8VastParser();
    this.playButton_.addEventListener(
        'click',
        this.bind_(this, this.onClick_),
        false);
    this.fullscreenButton_ = document.getElementById(player.fullscreen_);
    this.fullscreenButton_.addEventListener(
        'click',
        this.bind_(this, this.onFullscreenClick_),
        false);

    this.fullscreenWidth = null;
    this.fullscreenHeight = null;

    var fullScreenEvents = [
        'fullscreenchange',
        'mozfullscreenchange',
        'webkitfullscreenchange'];
    for (key in fullScreenEvents) {
        document.addEventListener(
            fullScreenEvents[key],
            this.bind_(this, this.onFullscreenChange_),
            false);
    }

    this.playing_ = false;
    this.adsActive_ = false;
    this.adsDone_ = false;
    this.fullscreen = false;

    this.videoPlayer_ = player;
    this.ads_ = new C8VpaidAds(this, this.videoPlayer_);
    this.adXml_ = '';

    this.videoPlayer_.registerVideoEndedCallback(
        this.bind_(this, this.onContentEnded_));
    this.httpRequest_ = null;
};

C8VpaidApp.prototype.log = function(message) {
    console.log(message);
};

C8VpaidApp.prototype.resumeAfterAd = function() {
    this.videoPlayer_.play();
    this.adsActive_ = false;
    this.updateChrome_();
};

C8VpaidApp.prototype.pauseForAd = function() {
    this.adsActive_ = true;
    this.playing_ = true;
    this.videoPlayer_.pause();
    this.updateChrome_();
};

C8VpaidApp.prototype.adClicked = function() {
    this.updateChrome_();
};

C8VpaidApp.prototype.bind_ = function(thisObj, fn) {
    return function() {
        fn.apply(thisObj, arguments);
    };
};

C8VpaidApp.prototype.makeAdRequest = function() {
    //this.makeRequest_('http://192.168.1.153:84/getvast.php');
    this.makeRequest_('http://ssp.c8.net.ua/getcode.php?key=d41de446ec0ef54335f36466c0a2cb72&ssp_id=3634&pid=6&site_id=f5399&format_id=8&ct=xml&device_id=&app_id=&version=3');
};

C8VpaidApp.prototype.makeRequest_ = function(url) {
    if (window.XMLHttpRequest) {
        this.httpRequest_ = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            this.httpRequest_ = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            this.httpRequest_ = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    this.httpRequest_.onreadystatechange = this.bind_(this, this.setVastParseXml);
    this.httpRequest_.onreadystatechange = this.bind_(this, this.setXml_);
    this.httpRequest_.open('GET', url);
    this.httpRequest_.withCredentials = true;
    this.httpRequest_.send();
};

C8VpaidApp.prototype.setVastParseXml = function () {
    if(this.httpRequest_.responseXML != null)
        this.vastParser.setAdXml_(this.httpRequest_.responseXML);
};

C8VpaidApp.prototype.setXml_ = function() {
    this.xmlBox_ = this.httpRequest_.responseText;
};

C8VpaidApp.prototype.onClick_ = function() {
    if (!this.adsDone_) {
        this.log('Click event.');
        if (this.xmlBox_ == '') {
            this.log("Error: please fill in xml");
            return;
        } else {
            this.adXml_ = this.xmlBox_;
        }
        // The user clicked/tapped - inform the ads controller that this code
        // is being run in a user action thread.
        this.ads_.initialUserAction();
        // At the same time, initialize the content player as well.
        // When content is loaded, we'll issue the ad request to prevent it
        // from interfering with the initialization. See
        // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/ads#iosvideo
        // for more information.
        this.videoPlayer_.preloadContent(this.bind_(this, this.loadAds_));
        this.adsDone_ = true;
        return;
    }

    if (this.adsActive_) {
        if (this.playing_) {
            this.ads_.pause();
        } else {
            this.ads_.resume();
        }
    } else {
        if (this.playing_) {
            this.videoPlayer_.pause();
        } else {
            this.videoPlayer_.play();
        }
    }

    this.playing_ = !this.playing_;

    this.updateChrome_();
};

C8VpaidApp.prototype.onFullscreenClick_ = function() {
    if (this.fullscreen) {
        // The video is currently in fullscreen mode
        var cancelFullscreen = document.exitFullScreen ||
            document.webkitCancelFullScreen ||
            document.mozCancelFullScreen;
        if (cancelFullscreen) {
            cancelFullscreen.call(document);
        } else {
            this.onFullscreenChange_();
        }
    } else {
        // Try to enter fullscreen mode in the browser
        var requestFullscreen = this.videoPlayer_.videoPlayerContainer_.requestFullScreen ||
            this.videoPlayer_.videoPlayerContainer_.webkitRequestFullScreen ||
            this.videoPlayer_.videoPlayerContainer_.mozRequestFullScreen;
        if (requestFullscreen) {
            this.fullscreenWidth = screen.width;
            this.fullscreenHeight = screen.height;
            requestFullscreen.call(this.videoPlayer_.videoPlayerContainer_);
        } else {
            this.fullscreenWidth = window.innerWidth;
            this.fullscreenHeight = window.innerHeight;
            this.onFullscreenChange_();
        }
        requestFullscreen.call(this.videoPlayer_.videoPlayerContainer_);
    }
};

C8VpaidApp.prototype.updateChrome_ = function() {
    if (this.playing_) {
        this.playButton_.style.backgroundImage = 'url(//b.c8.net.ua/b/img/vpaid/pause.png)';
    } else {
        // Unicode play symbol.
        this.playButton_.style.backgroundImage = 'url(//b.c8.net.ua/b/img/vpaid/play.png)';
    }
};

C8VpaidApp.prototype.loadAds_ = function() {
    this.ads_.requestXml(this.adXml_);
};

C8VpaidApp.prototype.onFullscreenChange_ = function() {
    if (this.fullscreen) {
        // The user just exited fullscreen
        // Resize the ad container
        this.ads_.resize(
            this.videoPlayer_.width,
            this.videoPlayer_.height);
        // Return the video to its original size and position
        this.videoPlayer_.resize(
            'relative',
            '',
            '',
            this.videoPlayer_.width,
            this.videoPlayer_.height);
        this.fullscreen = false;
    } else {
        // The fullscreen button was just clicked
        // Resize the ad container
        var width = this.fullscreenWidth;
        var height = this.fullscreenHeight;
        this.makeAdsFullscreen_();
        // Make the video take up the entire screen
        this.videoPlayer_.resize('absolute', 0, 0, width, height);
        this.fullscreen = true;
    }
};

C8VpaidApp.prototype.makeAdsFullscreen_ = function() {
    this.ads_.resize(
        this.fullscreenWidth,
        this.fullscreenHeight);
};

C8VpaidApp.prototype.onContentEnded_ = function() {
    this.ads_.contentEnded();
};
