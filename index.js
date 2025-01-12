(function () {
  const grayViewDom = document.createElement("div");
  grayViewDom.style.backgroundColor = "black";
  grayViewDom.style.position = "fixed";
  grayViewDom.style.top = "0";
  grayViewDom.style.width = "100%";
  grayViewDom.style.height = "100%";
  grayViewDom.style.opacity = "0.0";
  grayViewDom.style.zIndex = "99999";
  grayViewDom.style.pointerEvents = "none";
  grayViewDom.id = "grayViewDom";

  const darkViewBody = document.getElementsByTagName("body");
  darkViewBody[0].appendChild(grayViewDom);

  const setOpacity = (result) => {
    if (!result || result.range < 0) {
      return;
    }
    grayViewDom.style.opacity = result.range / 100;
  };

  // sync when refresh page. it fires first when initialized
  chrome.storage.sync.get(["range"]).then((result) => {
    setOpacity(result);
  });

  //from popup.js
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    chrome.storage.local.get(["savedDomains"]).then((result) => {
      console.log("savedDomains", result);
      const savedDomains = result.savedDomains || [];

      if (request.message === "range_gray_cover") {
        const contains = savedDomains.includes(request.currentHostname);
        if (contains) {
          setOpacity({ range: 0 }); //always bright
          return;
        }
        setOpacity(request);
      }
    });
  });
})();
