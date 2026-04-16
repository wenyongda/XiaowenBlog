// 樱花特效切换按钮 - 添加到 rightside 设置区域
const SAKURA_STORAGE_KEY = 'sakura_effect_enabled';

// 获取保存的状态，默认为 false（关闭）
function getSakuraState() {
  const saved = localStorage.getItem(SAKURA_STORAGE_KEY);
  // 如果没有保存过，默认关闭
  return saved === null ? false : saved === 'true';
}

// 保存状态到 localStorage
function saveSakuraState(enabled) {
  localStorage.setItem(SAKURA_STORAGE_KEY, enabled.toString());
}

// 应用樱花特效状态
function applySakuraState() {
  const sakuraEffect = document.getElementById('canvas_sakura');
  if (sakuraEffect) {
    const enabled = getSakuraState();
    sakuraEffect.style.display = enabled ? 'block' : 'none';
  }
}

function createSakuraBtn() {
  // 检查按钮是否已存在
  if (document.getElementById('toggle_sakura_btn')) return;

  const sakuraBtn = document.createElement('button');
  sakuraBtn.id = 'toggle_sakura_btn';
  sakuraBtn.type = 'button';
  sakuraBtn.title = '樱花特效切换';
  sakuraBtn.innerHTML = '<i class="fas fa-leaf"></i>';

  const hideArea = document.getElementById('rightside-config-hide');
  if (hideArea) {
    hideArea.appendChild(sakuraBtn);
  }

  // 应用保存的状态
  applySakuraState();

  // 点击切换
  sakuraBtn.addEventListener('click', function() {
    const sakuraEffect = document.getElementById('canvas_sakura');
    if (sakuraEffect) {
      const isHidden = window.getComputedStyle(sakuraEffect).display === 'none';
      const newState = isHidden ? true : false;
      sakuraEffect.style.display = newState ? 'block' : 'none';
      // 保存状态到 localStorage
      saveSakuraState(newState);
    }
  });
}

// 首次加载
document.addEventListener('DOMContentLoaded', function() {
  createSakuraBtn();
  // 确保 sakura.js 加载完成后应用状态
  setTimeout(applySakuraState, 100);
});

// PJAX 页面切换后重新创建
document.addEventListener('pjax:complete', function() {
  createSakuraBtn();
  applySakuraState();
});