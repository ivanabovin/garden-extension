function isSite(tab: chrome.tabs.Tab | undefined): boolean {
  return tab?.url?.startsWith('http') ?? false;
}

function updateIcon(tab: chrome.tabs.Tab, show: boolean) {
  const icon = !isSite(tab) ? 'none.png' : show ? 'color.png' : 'gray.png';
  chrome.action.setIcon({ tabId: tab.id, path: icon });
}

chrome.tabs.onUpdated.addListener((tabId, changes, tab) => {
  const complete = changes.status === 'complete';
  if (complete) {
    updateIcon(tab, false);
  }
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (sender.tab && message.type === 'show') {
    updateIcon(sender.tab, message.show);
  }
});

chrome.action.onClicked.addListener(async function (tab) {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'click' });
  }
});
