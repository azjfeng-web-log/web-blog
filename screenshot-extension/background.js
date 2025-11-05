// Service Worker for Chrome Extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('页面截图插件已安装');
});

// 处理来自 popup 的消息，转发到 content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background 收到消息:', request.action);
  
  if (request.action === 'captureFullPage' || request.action === 'captureSelect') {
    // 获取当前活跃标签页
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ error: '没有找到活跃标签页' });
        return;
      }
      
      const tabId = tabs[0].id;
      console.log('目标标签页 ID:', tabId);
      
      // 先尝试注入 content script（即使已存在也不会重复注入）
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.error('注入失败:', chrome.runtime.lastError);
          sendResponse({ error: '无法注入脚本: ' + chrome.runtime.lastError.message });
          return;
        }
        
        console.log('脚本注入成功，发送消息...');
        
        // 注入后发送消息
        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, request, (response) => {
            if (chrome.runtime.lastError) {
              console.error('消息发送失败:', chrome.runtime.lastError);
              sendResponse({ error: chrome.runtime.lastError.message });
            } else {
              console.log('消息发送成功');
              sendResponse(response);
            }
          });
        }, 50);
      });
    });
    
    return true;
  }
  
  if (request.action === 'screenshotReady') {
    console.log('Background 收到截图数据，转发到 popup');
    // 转发截图数据到 popup
    chrome.runtime.sendMessage(request, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Popup 已关闭，截图数据已保存');
      }
    });
  }
});
