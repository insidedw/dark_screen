(function () {
    chrome.storage.sync.get(["range"]).then((result) => {
        if (result.range) {
            document.getElementById("grayCoverRange").value = result.range;
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, {"message": "range_gray_cover", "range": result.range});
            });

        } else {
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                var activeTab = tabs[0];
                document.getElementById("grayCoverRange").value = 20;
                chrome.tabs.sendMessage(activeTab.id, {"message": "range_gray_cover", "range": 0});
            });
        }
    });

})();

document.getElementById("grayCoverRange").addEventListener("change", function (e) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "range_gray_cover", "range": e.target.value});

        chrome.storage.sync.set({'range': e.target.value}).then(() => {});
    });
});