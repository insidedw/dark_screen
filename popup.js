(function () {
  let currentHostname = "";
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const currentTab = tabs[0]; // 현재 활성 탭
      const currentUrl = currentTab.url; // 활성 탭의 URL
      try {
        const url = new URL(currentUrl);
        currentHostname = url.hostname;
      } catch (e) {}
    } else {
      console.log("No active tab found.");
    }
  });

  const connectPort = chrome.runtime.connect({ name: "popup" });
  connectPort.onMessage.addListener((message) => {
    if (message.range >= 0) {
      document.getElementById("grayCoverRange").value = message.range;
    }
  });

  const saveRange = (range) => {
    chrome.tabs.query(
      { currentWindow: true, active: true },
      async function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
          message: "range_gray_cover",
          range,
          currentHostname,
        });
        chrome.runtime.sendMessage({ range });
        await chrome.storage.sync.set({ range });
      }
    );
  };

  document
    .getElementById("grayCoverRange")
    .addEventListener("change", async function (e) {
      saveRange(e.target.value);
    });

  chrome.storage.local.get(["savedDomains"], (result) => {
    const savedDomains = result.savedDomains || [];
    const contains = savedDomains.includes(currentHostname);
    document.getElementById("switchDomain").checked = contains;
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
              saveRange(0); //reset 0
              document.getElementById("grayCoverRange").value = 0;
              document.getElementById("grayCoverRange").disabled = false;
            }
          );
        } else {
          chrome.storage.local.set(
            { savedDomains: [...savedDomains, currentHostname] },
            () => {
              console.log(`${currentHostname} saved successfully!`);
              saveRange(0); //reset 0
              document.getElementById("grayCoverRange").value = 0;
              document.getElementById("grayCoverRange").disabled = true;
            }
          );
        }
      });
    });
})();
