$(document).ready(
		function() {					
			$.fn.fullpage({

//				// 绑定菜单，设定的相关属性与 anchors 的值对应后，菜单可以控制滚动
//				//'menu' : '.nav',
//				// 字体是否随着窗口缩放而缩放
//				'resize' : true,
//				// 滚动速度，单位为毫秒,默认为700
//				'scrollingSpeed' : 800,
//				// 设置每一屏的背景颜色
				'slidesColor' : [ '#999', '#4BBFC3', '#7BAABE', '#f90', '#fc9', '#5CDFC3', '#ACAABE', '#f88', '#C91' ],
//				// 是否使用 CSS3 transforms 滚动,设置为true自定义导航栏才能显示
				'css3' : true,
				verticalCentered : false,
				// 定义锚链接
				'anchors' : [ 'page1', 'page2', 'page3', 'page4', 'page5',
						'page6', 'page7', 'page8', 'page9'],
				navigation : true,
				navigationTooltips : [ '我们', '情人节', '生活', 'POPO', 'Jiking', '爱情时钟', '一生相伴', '我们结婚吧',
										'写下祝福' ]
				
			});
});