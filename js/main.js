// 获取相关DOM
const container = document.getElementById('container');
const list = document.getElementById('list');
const buttons = document.getElementById('buttons').getElementsByTagName('span');
const left = document.getElementById('left');
const right = document.getElementById('right');
// 变量存储当前存放的第几张图片或显示第几个小圆点
let index = 1;  

function showButton() {
	// 将列表点亮的buttons熄灭
	for (const button of buttons) {
		if (button.className == 'on') {
			button.className = '';
			// 退出循环
			break;
		}
	}
	// 只亮buttons数组中当前图片的小圆点
	buttons[index - 1].className = 'on';
}

// 第一张图 -600px; 第五张图 -3000px; 无限滚动
// 解决问题 一直左击右击出现空白
function animate(offset) {
	const newLeft = parseInt(list.style.left) + offset;
	list.style.left = newLeft + 'px';
	// 再点击左按钮，图片调到第五张
	if (newLeft > -600) {
		list.style.left = '-3000' + 'px';
	} else if (newLeft < -3000) {
		// 再点击右按钮， 图片调到第一张
		list.style.left = '-600' + 'px';
	}
}

// 已经第一张图时再点击左按钮，图片调到第五张，
// 解决问题 buttons对应图片，且只亮一个小圆点
left.addEventListener('click',function() {
	if (index == 1) {
		index = 5;
	} else {
		index -= 1;
	}
	showButton();
	animate(600);
});
// 第五张图时再点击右按钮，图片调到第一张
right.addEventListener('click', function() {
	// index 对应第几张图片
	if(index == 5){
		index = 1;
	}else {
		index += 1;
	}
	showButton();
	animate(-600);
});

// 点击按钮,出现对应图片,计算当前图片与第一张图片的偏移量
for (const button of buttons) {
	button.addEventListener('click', () => {
		// 如果此时小圆点已亮，不执行以下代码
		if(button.className == 'on'){
			// 终止以下代码执行
			return;
		}
		// 获取自定义的span 里的 index
		const myIndex = parseInt(button.getAttribute('index'));
		// 计算偏移量  index 设置的存储当前存放的第几张图片的变量
		const offset = -600 * (myIndex - index);
		// 显示第几张图
		animate(offset);
		// 归位 确保 index 与图片对应
		index = myIndex;
		// 点亮对应图片的小圆点
		showButton();
	})
}