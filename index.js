(function () {
    const grayViewDom = document.createElement('div');
    grayViewDom.style.backgroundColor = 'black';
    grayViewDom.style.position = 'fixed';
    grayViewDom.style.top = '0';
    grayViewDom.style.width = '100%';
    grayViewDom.style.height = '100%';
    grayViewDom.style.opacity = '0.2';
    grayViewDom.style.zIndex = '99999';
    grayViewDom.style.pointerEvents = 'none';
    grayViewDom.id = 'grayViewDom';

    const darkViewBody = document.getElementsByTagName('body');
    darkViewBody[0].appendChild(grayViewDom);


    chrome.storage.sync.get(["range"]).then((result) => {
        if (result.range) {
            grayViewDom.style.opacity = result.range / 100;
        } else {
            grayViewDom.style.opacity = 0.2;
        }
    });

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.message === "range_gray_cover") {
                grayViewDom.style.opacity = request.range / 100;
            }
        }
    );
})();
