// 获取相关DOM元素
const container = document.getElementById('container');
const list = document.getElementById('list');
const buttons = document.getElementById('buttons').getElementsByTagName('span');
const left = document.getElementById('left');
const right = document.getElementById('right');
let index = 1; // index 变量存储当前存放的第几张图片 或 显示第几个小圆点
let animated = false; // 动画状态:没有运行 当动画还在继续时，点击按钮无效
let intervalID; // 存放定时器

// 点亮原点函数
function showButton() {
	// html 中一开始设置了一个button的class为'on'; 将列表点亮的buttons熄灭
	for (const button of buttons) {
		if (button.className == 'on') {
			button.className = '';
			// 当buttons熄灭,退出循环
			break;
		}
	}
	// 只亮buttons数组中当前图片的小圆点
	buttons[index - 1].className = 'on';
}

// 第一张图 -600px; 第五张图 -3000px; 实现无限滚动
// 解决问题 一直左点击 或 右点击图片超出图片张数之后出现空白界面
// animated 解决问题 等水平移动图片动画结束之后再点击下一张> 或 上一张< 按钮才有效
function animate(offset) {
	// 动画运行
	animated = true;
	const newLeft = parseInt(list.style.left) + offset;
	const time = 300; // 总的位移时间
	const interval = 10; // 移动间隔时间
	const speed = offset / (time/interval); // (移动速度)移动量 = 移动距离 / 移动次数(移动总时间/移动间隔时间)	

	// 动画水平缓慢移动图片
	function go() {
		// 第一张图片left -600px,越往左移(下一张按钮)left越小; 第五张图片left -3000px,越往右移(上一张按钮)left越大;
		// 左移(下一张按钮):offset < 0, speed < 0 且 移动后left < 移动前left; 右移(上一张按钮):speed > 0 且 移动后left > 移动前left
		if ((speed < 0 && parseInt(list.style.left) > newLeft) || (speed > 0 && parseInt(list.style.left) < newLeft)) {
			// 每次移动后left = 当前left + speed（移动量）
			list.style.left = parseInt(list.style.left) + speed + 'px';
			// 设置定时器循环10毫秒后调用自身，以确保达到图片位置offset偏移量
			// 一个函数不停的在一定时间条件调用自身，这个方法叫递归。
			// 10ms 只执行一次go(); setTimeout 只执行一次
			setTimeout(go, interval);
		}else {
			// 此时动画结束
			animated = false;
			// 图片已经移动到偏移量offset大小时
			list.style.left = newLeft + 'px';
			// 如果图片在第一张；再点击左按钮(即上一张按钮，图片跳到第五张图片位置
			if (newLeft > -600) {
				list.style.left = '-3000' + 'px';
			} else if (newLeft < -3000) {
				// 如果图片在第五张；再点击右按钮(即下一张按钮)， 图片跳到第一张图片位置
				list.style.left = '-600' + 'px';
			}
		}
	}
	// 调用go函数运行
	go();
}

// 自动下一张播放
// 这个函数自动触发下一张按钮的点击事件
function playAnimate(){
	intervalID = setInterval(rightClick, 2000);
}

// 清除定时器
function stopAnimate() {
	clearInterval(intervalID);
}

// 已经第一张图时再点击左按钮，图片跳到第五张，
// 解决问题 buttons 对应图片，且只亮一个小圆点
left.addEventListener('click',function leftClick() {
	if (index == 1) {
		index = 5;
	} else {
		index -= 1;
	}
	showButton();
	if (!animated) { // animated == false
		animate(600);
	}
});

function rightClick() {
	// index 对应第几张图片
	if (index == 5) {
		index = 1;
	} else {
		index += 1;
	}
	showButton();
	if (!animated) { // animated == false
		animate(-600);
	}
}
// 当图片在第五张图时，再点击右按钮，图片跳到第一张
right.addEventListener('click', rightClick);

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
		if(!animated){
			animate(offset);
		}
		// 归位 确保 index 与图片对应
		index = myIndex;
		// 点亮对应图片的小圆点
		showButton();
	})
}

// 鼠标移动到图片时，停止自动播放图片动画；鼠标移开，恢复自动播放功能
container.addEventListener('mouseover', stopAnimate);
container.addEventListener('mouseout', playAnimate);
// 打开页面，一开始自动播放
playAnimate();