const statusEl = document.getElementById('status');

function showStatus(message, type = 'info') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  
  if (type !== 'loading') {
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = 'status';
    }, 3000);
  }
}

async function captureScreenshot(type) {
  try {
    showStatus('正在截图...', 'loading');
    
    if (type === 'fullPage') {
      chrome.runtime.sendMessage({ action: 'captureFullPage' }, (response) => {
        // 必须检查 lastError
        if (chrome.runtime.lastError) {
          console.error('消息发送失败:', chrome.runtime.lastError);
          showStatus('截图失败: ' + chrome.runtime.lastError.message, 'error');
          return;
        }
        
        if (response && response.error) {
          console.error('截图错误:', response.error);
          showStatus('截图失败: ' + response.error, 'error');
        } else {
          console.log('截图命令已发送');
        }
      });
    } else if (type === 'visible') {
      try {
        const canvas = await chrome.tabs.captureVisibleTab();
        downloadScreenshot(canvas, 'visible');
      } catch (error) {
        showStatus('截图失败: ' + error.message, 'error');
      }
    } else if (type === 'select') {
      chrome.runtime.sendMessage({ action: 'captureSelect' }, (response) => {
        // 必须检查 lastError
        if (chrome.runtime.lastError) {
          console.error('消息发送失败:', chrome.runtime.lastError);
          showStatus('截图失败: ' + chrome.runtime.lastError.message, 'error');
          return;
        }
        
        if (response && response.error) {
          console.error('截图错误:', response.error);
          showStatus('截图失败: ' + response.error, 'error');
        } else {
          console.log('截图命令已发送');
        }
      });
    }
  } catch (error) {
    console.error('截图失败:', error);
    showStatus('截图失败: ' + error.message, 'error');
  }
}

function downloadScreenshot(dataUrl, type) {
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  link.href = dataUrl;
  link.download = `screenshot-${type}-${timestamp}.png`;
  link.click();
  showStatus('✓ 截图已保存', 'success');
}

document.getElementById('fullPageBtn').addEventListener('click', () => {
  captureScreenshot('fullPage');
});

document.getElementById('visibleBtn').addEventListener('click', () => {
  captureScreenshot('visible');
});

document.getElementById('selectBtn').addEventListener('click', () => {
  captureScreenshot('select');
});

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'screenshotReady') {
    downloadScreenshot(request.dataUrl, request.type);
    sendResponse({ success: true });
  }
  return true;
});
