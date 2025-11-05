// Content script 初始化
console.log('[Screenshot Extension] Content script 已加载');

// 全页面截图
async function captureFullPage() {
  const canvas = await html2canvas(document.documentElement, {
    allowTaint: true,
    useCORS: true,
    scale: window.devicePixelRatio,
    backgroundColor: '#ffffff'
  });
  
  const dataUrl = canvas.toDataURL('image/png');
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'screenshotReady',
      dataUrl: dataUrl,
      type: 'fullpage'
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('消息发送失败:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        console.log('截图已发送');
        resolve();
      }
    });
  });
}

// 选定区域截图
async function captureSelect() {
  return new Promise((resolve, reject) => {
    // 创建选择工具
    const overlay = document.createElement('div');
    overlay.id = 'screenshot-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      cursor: crosshair;
      z-index: 999999;
    `;
    
    const selection = document.createElement('div');
    selection.id = 'screenshot-selection';
    selection.style.cssText = `
      position: fixed;
      border: 2px dashed #667eea;
      background: rgba(102, 126, 234, 0.1);
      z-index: 1000000;
      display: none;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(selection);
    
    let isDrawing = false;
    let startX, startY;
    
    const cleanup = () => {
      overlay.remove();
      selection.remove();
    };
    
    overlay.addEventListener('mousedown', (e) => {
      isDrawing = true;
      startX = e.clientX;
      startY = e.clientY;
      selection.style.display = 'block';
      selection.style.left = startX + 'px';
      selection.style.top = startY + 'px';
      selection.style.width = '0px';
      selection.style.height = '0px';
    });
    
    overlay.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      
      const currentX = e.clientX;
      const currentY = e.clientY;
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);
      
      selection.style.left = Math.min(startX, currentX) + 'px';
      selection.style.top = Math.min(startY, currentY) + 'px';
      selection.style.width = width + 'px';
      selection.style.height = height + 'px';
    });
    
    overlay.addEventListener('mouseup', async (e) => {
      if (!isDrawing) return;
      isDrawing = false;
      
      const rect = selection.getBoundingClientRect();
      cleanup();
      
      if (rect.width > 0 && rect.height > 0) {
        try {
          const canvas = await html2canvas(document.documentElement, {
            allowTaint: true,
            useCORS: true,
            scale: window.devicePixelRatio,
            backgroundColor: '#ffffff',
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
          });
          
          const dataUrl = canvas.toDataURL('image/png');
          chrome.runtime.sendMessage({
            action: 'screenshotReady',
            dataUrl: dataUrl,
            type: 'select'
          }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('消息发送失败:', chrome.runtime.lastError);
              reject(chrome.runtime.lastError);
            } else {
              console.log('截图已发送');
              resolve();
            }
          });
        } catch (error) {
          console.error('选定区域截图失败:', error);
          reject(error);
        }
      } else {
        reject(new Error('选择区域过小'));
      }
    });
    
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        cleanup();
        reject(new Error('用户取消'));
      }
    });
  });
}

// 加载 html2canvas 库
function loadHtml2Canvas() {
  return new Promise((resolve, reject) => {
    if (window.html2canvas) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onerror = () => {
      console.error('html2canvas 库加载失败');
      reject(new Error('html2canvas 库加载失败'));
    };
    script.onload = () => {
      console.log('html2canvas 库加载成功');
      resolve();
    };
    document.head.appendChild(script);
  });
}

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script 收到消息:', request.action);
  
  if (request.action === 'ping') {
    sendResponse({ pong: true });
    return true;
  }
  
  if (request.action === 'captureFullPage') {
    loadHtml2Canvas()
      .then(() => captureFullPage())
      .then(() => sendResponse({ success: true }))
      .catch((error) => {
        console.error('截图失败:', error);
        sendResponse({ error: error.message });
      });
    return true;
  }
  
  if (request.action === 'captureSelect') {
    loadHtml2Canvas()
      .then(() => captureSelect())
      .then(() => sendResponse({ success: true }))
      .catch((error) => {
        console.error('截图失败:', error);
        sendResponse({ error: error.message });
      });
    return true;
  }
});
