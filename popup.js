(function () {
    // sync when popup is open. it fires first when initialized
    chrome.storage.sync.get(["range"]).then((result) => {
        if (result.range >= 0) {
            document.getElementById("grayCoverRange").value = result.range;
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, {"message": "range_gray_cover", "range": result.range});
            });
        }
    });

    const connectPort = chrome.runtime.connect({name: 'popup'});
    connectPort.onMessage.addListener((message) => {
        if (message.range >= 0) {
            document.getElementById("grayCoverRange").value = message.range;
        }
    })

    document.getElementById("grayCoverRange").addEventListener("change", async function (e) {
        chrome.tabs.query({currentWindow: true, active: true}, async function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "range_gray_cover", range: e.target.value});
            chrome.runtime.sendMessage({range: e.target.value});
            await chrome.storage.sync.set({range: e.target.value});
        });
    });
})();
