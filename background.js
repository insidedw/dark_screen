let connectPort
chrome.runtime.onConnect.addListener((p) => {
    if (p.name === 'popup') {
        connectPort = p
    }

    connectPort.onDisconnect.addListener(() => {
        connectPort = undefined
    })
})


const handleBadge = async (range, isReversed) => {
    const isCurrentlyOn = range > 0;
    const isScrollToZero = !isCurrentlyOn && !isReversed //
    chrome.action.setBadgeText({
        text: isScrollToZero ? "OFF" : isCurrentlyOn && isReversed ? "OFF" : "ON"
    });

    chrome.action.setBadgeBackgroundColor(
        {color: isScrollToZero ? '#000' : isCurrentlyOn && isReversed ? '#000' : '#00FF00'}
    );
}

chrome.commands.onCommand.addListener(async (command) => {
    console.log(command)
    if (command === 'on-off') {

        const {range: currentRangeValue = 0} = await chrome.storage.sync.get(["range"])
        const {range: savedRangeValue = 0} = await chrome.storage.local.get(["range"])

        await handleBadge(currentRangeValue, true)

        const isCurrentlyOn = currentRangeValue > 0;
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {
                "message": "range_gray_cover",
                "range": isCurrentlyOn ? 0 : savedRangeValue
            });
        });

        connectPort?.postMessage({range: isCurrentlyOn ? 0 : savedRangeValue})
        await chrome.storage.sync.set({'range': isCurrentlyOn ? 0 : savedRangeValue});

        // 이전 값 찾기 위해서 임시 저장소
        await chrome.storage.local.set({'range': isCurrentlyOn ? currentRangeValue : savedRangeValue})
    }
});

chrome.runtime.onInstalled.addListener(async () => {
    const {range = 0} = await chrome.storage.sync.get(["range"])
    await handleBadge(range, false)
});


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    const {range = 0} = request
    await handleBadge(range, false)
});