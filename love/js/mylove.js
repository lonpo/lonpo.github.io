	$(document).ready(
			function() {
				$('#fullpage')
						.fullpage(
								{
									'css3' : true,
									'sectionsColor' : [ '#999', '#4BBFC3',
											'#7BAABE', '#f90', '#fc9',
											'#5CDFC3', '#ACAABE', '#f88',
											'#C91' ],
									'verticalCentered' : false,
									'navigation' : true,
									'navigationTooltips' : [ '我们', '情人节', '生活',
											'POPO', 'Jiking', '爱情时钟', '一生相伴',
											'我们结婚吧', '写下祝福' ],
									'menu' : '#menu',
									'afterLoad' : function(anchorLink, index){
										if(index == 9){

											$(".page1_yun1").css("opacity","0");
											$(".page1_yun2").css("opacity","0");
											$(".page1_yun3").css("opacity","0");
										}else{
											$(".page1_yun1").css("opacity","1");
											$(".page1_yun2").css("opacity","1");
											$(".page1_yun3").css("opacity","1");
										}
										
										if(index != 1){
											$("#back").show().mouseover(function(){
												$(this).animate({
													bottom : "30"
												}, 200)
											}).mouseout(function() {
												$(this).animate({
													bottom : "20"
												}, 200)
											}).stop().animate({
												borderRadius : "50%",
												opacity : 1
											}, 1000).click(function() {
												$('#fullpage').fullpage.moveTo(1);
											});	
																					
										}else{
											$("#back").stop().animate({
												opacity : 0
											}, 500, function() {
												$("#back").css({
													borderRadius : 0
												}).hide();
											});										
										}					
									}
								});
			});
			
	
	
		var yun1 = setInterval(function() {
			$(function() {
				$(".page1_yun1").fadeIn('1000').animate({
					left : '860'
				}, 20000, 'linear').animate({
					left : '0'
				}, 20000, 'linear')
		
			})
		}, 0);
		var yun2 = setInterval(function() {
			$(function() {
				$(".page1_yun2").fadeIn('1000').animate({
					right : '750'
				}, 20000, 'linear').animate({
					right : '0'
				}, 20000, 'linear')
			})
		}, 0);
		var yun3 = setInterval(function() {
			$(function() {
				$(".page1_yun3").fadeIn('1000').animate({
					left : '660'
				}, 15000, 'linear').animate({
					left : '0'
				}, 15000, 'linear')
			})
		}, 0);	
		
		
		