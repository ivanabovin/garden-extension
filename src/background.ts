chrome.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab?.id;
  if (message.type === 'show') {
    const icon = message.show ? 'active.png' : 'icon.png';
    chrome.action.setIcon({ tabId, path: icon });
  }
  return true;
});

chrome.action.onClicked.addListener(async function (tab) {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'click' });
  }
});
