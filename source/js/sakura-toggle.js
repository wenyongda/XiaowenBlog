// 樱花特效切换按钮 - 添加到 rightside 设置区域
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

  // 点击切换
  sakuraBtn.addEventListener('click', function() {
    const sakuraEffect = document.getElementById('canvas_sakura');
    if (sakuraEffect) {
      const isHidden = window.getComputedStyle(sakuraEffect).display === 'none';
      sakuraEffect.style.display = isHidden ? 'block' : 'none';
    }
  });
}

// 首次加载
document.addEventListener('DOMContentLoaded', createSakuraBtn);

// PJAX 页面切换后重新创建
document.addEventListener('pjax:complete', createSakuraBtn);