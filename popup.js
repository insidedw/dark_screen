(function () {
  // sync when popup is open. it fires first when initialized
  chrome.storage.sync.get(["range"]).then((result) => {
    if (result.range >= 0) {
      document.getElementById("grayCoverRange").value = result.range;
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
          message: "range_gray_cover",
          range: result.range,
        });
      });
    }
  });

  const connectPort = chrome.runtime.connect({ name: "popup" });
  connectPort.onMessage.addListener((message) => {
    if (message.range >= 0) {
      document.getElementById("grayCoverRange").value = message.range;
    }
  });

  document
    .getElementById("grayCoverRange")
    .addEventListener("change", async function (e) {
      chrome.tabs.query(
        { currentWindow: true, active: true },
        async function (tabs) {
          var activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, {
            message: "range_gray_cover",
            range: e.target.value,
          });
          chrome.runtime.sendMessage({ range: e.target.value });
          await chrome.storage.sync.set({ range: e.target.value });
        }
      );
    });

  let currentHostname = "";
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const currentTab = tabs[0]; // 현재 활성 탭
      console.log("currentTab", currentTab);
      const currentUrl = currentTab.url; // 활성 탭의 URL
      const url = new URL(currentUrl);
      currentHostname = url.hostname;
    } else {
      console.log("No active tab found.");
    }
  });

  document
    .getElementById("switchDomain")
    .addEventListener("change", async function (e) {
      chrome.storage.local.get(["savedDomains"], (result) => {
        const savedDomains = result.savedDomains || [];
        const contains = savedDomains.includes(currentHostname);
        if (contains) {
          chrome.storage.local.set(
            { savedDomains: savedDomains.filter((e) => e !== currentHostname) },
            () => {
              console.log(`${currentHostname} removed successfully!`);
            }
          );
        } else {
          chrome.storage.local.set(
            { savedDomains: [...savedDomains, currentHostname] },
            () => {
              console.log(`${currentHostname} saved successfully!`);
            }
          );
        }
      });
    });
})();
