// 樱花特效切换按钮 - 添加到 rightside 设置区域
document.addEventListener('DOMContentLoaded', function() {
  // 创建按钮
  const sakuraBtn = document.createElement('button');
  sakuraBtn.id = 'toggle_sakura_btn';
  sakuraBtn.type = 'button';
  sakuraBtn.title = '樱花特效切换';
  sakuraBtn.innerHTML = '<i class="fas fa-leaf"></i>';

  // 插入到 rightside-config-hide 区域
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
});