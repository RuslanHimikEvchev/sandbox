var C8VastParser = function () {
    
    this.adXml_ = '';
    this.skipable = false;
    this.vast = {
        nobanner: false,
        impressions: [],
        events: [],
        clicks: {
            clickThrough: '',
            clickTracking: []
        },
        adSystem: '',
        adTitle: '',
        media: {
            files: [],
            duration: '',
            skipOffSet: 0
        }
    };

    this.parser = function (xmlDocument, callback) {

        var parser = {

            callback: {},

            xmlDocument: {},

            initialize: function (xmlDocument, callback) {
                this.callback = callback;
                this.xmlDocument = xmlDocument;
                this.run();
            },
            
            run: function () {
                this.callback.nobanner = this.parseNobanner();
                this.callback.impressions = this.parseImpression();
                this.callback.events = this.parseEvents();
                this.callback.clicks.clickThrough = this.parseClick();
                this.callback.clicks.clickTracking = this.parseClickAudit();
                this.callback.media = this.parseMedia();

            },

            parseNobanner: function () {
                return typeof this.xmlDocument.getElementsByTagName('nobanner')[0] != 'undefined' && this.xmlDocument.getElementsByTagName('nobanner')[0] != null;
            },

            parseImpression: function () {
                var impressions = [];
                if(typeof this.xmlDocument.getElementsByTagName('Impression')[0] != 'undefined' && this.xmlDocument.getElementsByTagName('Impression')[0] != null)
                {
                    for(var i = 0; i < this.xmlDocument.getElementsByTagName('Impression').length; i++)
                        impressions.push(this.xmlDocument.getElementsByTagName('Impression')[i].textContent.trim());
                }
                return impressions;
            },

            parseEvents: function () {
                var events = [];
                if(typeof this.xmlDocument.getElementsByTagName('TrackingEvents')[0] != 'undefined' && this.xmlDocument.getElementsByTagName('TrackingEvents')[0] != null)
                {
                    for(var i = 0; i < this.xmlDocument.getElementsByTagName('TrackingEvents').length; i++){
                        events[i] = {};
                        if(this.xmlDocument.getElementsByTagName('TrackingEvents')[i].children != undefined)
                            for(var j = 0; j < this.xmlDocument.getElementsByTagName('TrackingEvents')[i].children.length; j++){
                                events[i][this.xmlDocument.getElementsByTagName('TrackingEvents')[i].children[j].attributes.event.nodeValue] =
                                    this.xmlDocument.getElementsByTagName('TrackingEvents')[i].children[j].textContent.trim();
                            }
                    }
                }
                return events;
            },

            parseClick: function () {
                var clickThrough = '';
                if(typeof this.xmlDocument.getElementsByTagName('ClickThrough')[0] != 'undefined' && this.xmlDocument.getElementsByTagName('ClickThrough')[0] != null)
                {
                    clickThrough = this.xmlDocument.getElementsByTagName('ClickThrough')[0].textContent.trim();
                }
                return clickThrough;
            },

            parseClickAudit: function () {
                var clickTracking = [];
                if(typeof this.xmlDocument.getElementsByTagName('ClickTracking')[0] != 'undefined' && this.xmlDocument.getElementsByTagName('ClickTracking')[0] != null)
                {
                    for(var i = 0; i < this.xmlDocument.getElementsByTagName('ClickTracking').length; i++)
                        clickTracking[i] = this.xmlDocument.getElementsByTagName('ClickTracking')[i].textContent.trim();
                }
                return clickTracking;
            },

            parseMedia: function () {
                var media = {};
                if(typeof this.xmlDocument.getElementsByTagName('MediaFile')[0] != 'undefined' && this.xmlDocument.getElementsByTagName('MediaFile')[0] != null)
                {
                    media['skipOffSet'] = 0;
                    media['files'] = [];

                    var skipOffSet = this.xmlDocument.getElementsByTagName('Linear');
                    skipOffSet = skipOffSet[0].attributes.skipoffset.nodeValue.split(':');
                    var offSetToSeconds = function (time) {
                        var h = parseInt(time[0]);
                        var m = parseInt(time[1]);
                        var s = parseInt(time[2]);
                        return s + (m * 60) + (h * 60 * 60);
                    };
                    media['skipOffSet'] = offSetToSeconds(skipOffSet);
                    if(media['skipOffSet'] > 0) this.callback.skipable = true;
                    for(var i = 0; i < this.xmlDocument.getElementsByTagName('MediaFile').length; i++) {
                        media['files'].push(this.xmlDocument.getElementsByTagName('MediaFile')[i].textContent.trim());
                    }
                }
                return media;
            }
            
        };
        parser.initialize(xmlDocument, callback);
    };

    return this;
};

C8VastParser.prototype.setAdXml_ = function (adXml) {
    this.adXml_ = adXml;
    this.parseVast();
};

C8VastParser.prototype.parseVast = function () {
    this.parser(this.adXml_, this.vast);
    console.log(JSON.stringify(this.vast));
};

C8VastParser.prototype.initialize = function () {
    
};

C8VastParser.prototype.getImpressions = function () {
    return this.vast.impressions;
};

C8VastParser.prototype.getEvents = function () {
    return this.vast.events;
};

C8VastParser.prototype.getEventLink = function (event) {
    return this.vast.events[event];
};

C8VastParser.prototype.getClickThrough = function () {
    return this.vast.clicks.clickThrough;
};

C8VastParser.prototype.getClickTracking = function () {
    return this.vast.clicks.clickTracking;
};

C8VastParser.prototype.getAdSystem = function () {
    return this.vast.adSystem;
};

C8VastParser.prototype.getAdTitle = function () {
    return this.vast.adTitle;
};

C8VastParser.prototype.getMediaFiles = function () {
    return this.vast.media.files;
};

C8VastParser.prototype.getDuration = function () {
    return this.vast.media.duration;
};

C8VastParser.prototype.getSkipOffSet = function () {
    return this.vast.media.skipOffSet;
};

C8VastParser.prototype.isSkipable = function () {
    return this.skipable;
};



