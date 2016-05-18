// Copyright 2013 Google Inc. All Rights Reserved.
// You may study, modify, and use this example for any purpose.
// Note that this example is provided "as is", WITHOUT WARRANTY
// of any kind either expressed or implied.

/**
 * Handles video player functionality.
 */
var C8VpaidPlayer = function(contentPlayerId, adContainer, videoPlayerContainer, PlayPause, FullScreen) {
    this.playPause_ = PlayPause;
    this.fullscreen_ = FullScreen;
    this.contentPlayer = document.getElementById(contentPlayerId);
    this.adContainer = document.getElementById(adContainer);
    this.videoPlayerContainer_ = document.getElementById(videoPlayerContainer);
};

C8VpaidPlayer.prototype.setVideoWidth = function (w) {
    this.width = w;
    this.contentPlayer.style.width = w;
};

C8VpaidPlayer.prototype.setVideoHeight = function (h) {
    this.height = h;
    this.contentPlayer.style.height = h;
};

C8VpaidPlayer.prototype.preloadContent = function(contentLoadedAction) {
    // If this is the initial user action on iOS or Android device,
    // simulate playback to enable the video element for later program-triggered
    // playback.
    if (this.isMobilePlatform()) {
        this.contentPlayer.addEventListener(
            'loadedmetadata',
            contentLoadedAction,
            false);
        this.contentPlayer.load();
    } else {
        contentLoadedAction();
    }
};

C8VpaidPlayer.prototype.play = function() {
    this.contentPlayer.play();
};

C8VpaidPlayer.prototype.pause = function() {
    this.contentPlayer.pause();
};

C8VpaidPlayer.prototype.isMobilePlatform = function() {
    return this.contentPlayer.paused &&
        (navigator.userAgent.match(/(iPod|iPhone|iPad)/) ||
        navigator.userAgent.toLowerCase().indexOf('android') > -1);
};

C8VpaidPlayer.prototype.resize = function(
    position, top, left, width, height) {
    this.videoPlayerContainer_.style.position = position;
    this.videoPlayerContainer_.style.top = top + 'px';
    this.videoPlayerContainer_.style.left = left + 'px';
    this.videoPlayerContainer_.style.width = width + 'px';
    this.videoPlayerContainer_.style.height = height + 'px';
    this.contentPlayer.style.width = width + 'px';
    this.contentPlayer.style.height = height + 'px';
};

C8VpaidPlayer.prototype.registerVideoEndedCallback = function(callback) {
    this.contentPlayer.addEventListener(
        'ended',
        callback,
        false);
};