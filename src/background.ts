chrome.action.onClicked.addListener(async function (tab) {
  if (!tab.id) return;

  chrome.tabs.sendMessage(tab.id, { type: 'click' }, response => {
    if (response?.success) {
      chrome.action.setIcon({ tabId: tab.id, path: 'active.png' });
    }
  });
});
