var C8VpaidApi = function () {
    var GoogleIMA3 = document.createElement('script');
    GoogleIMA3.src = '//s0.2mdn.net/instream/html5/ima3.js';
    GoogleIMA3.onload = function () {
        var C8VP = document.createElement('script');
        C8VP.src = '//b.c8.net.ua/b/js/vpaid/c8.vpaid.vp.js';
        C8VP.onload = function () {
            var C8VAPP = document.createElement('script');
            C8VAPP.src = '//b.c8.net.ua/b/js/vpaid/c8.vpaid.app.js';
            C8VAPP.onload = function () {
                var C8VAdSystem = document.createElement('script');
                C8VAdSystem.src = '//b.c8.net.ua/b/js/vpaid/c8.vpaid.ads.js';
                C8VAdSystem.onload = function () {
                    var C8VParser = document.createElement('script');
                    C8VParser.src = '//b.c8.net.ua/b/js/vpaid/c8.vast.parser.js';
                    C8VParser.onload = function () {
                        var player = new C8VpaidPlayer(
                            C8Player.contentPlayerId,
                            C8Player.adContainer,
                            C8Player.videoPlayerContainer,
                            C8Player.playPause,
                            C8Player.fullScreen
                        );
                        player.setVideoHeight(C8Player.playerH);
                        player.setVideoWidth(C8Player.playerW);
                        var C8Application = new C8VpaidApp(player);
                        C8Application.makeAdRequest();
                    };
                    document.head.appendChild(C8VParser);
                };
                document.head.appendChild(C8VAdSystem);
            };
            document.head.appendChild(C8VAPP);
        };
        document.head.appendChild(C8VP);
    };
    document.head.appendChild(GoogleIMA3);
};
