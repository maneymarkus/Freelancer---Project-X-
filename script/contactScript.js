var Module = (function(window, document, undefined) {

	function init() {
		
		var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0];
			
		var scrollVar = window.pageYOffset || document.documentElement.scrollTop;
		
		var aboveFold = document.getElementById("above-fold");
		var scrollDownButton = document.getElementById("content-below");
		var backToTop = document.getElementById("back-to-top");
		var nav = document.getElementById("main-nav");
		var header = document.getElementsByClassName("header")[0];
		var navRect = nav.getBoundingClientRect();
		var windowHeight = window.innerHeight || e.clientHeight || g.clientHeight;
		var navTopOffset = (navRect.top <= windowHeight) ? windowHeight : navRect.top;
		var navHeight = nav.offsetHeight;
		var menuButton = document.getElementsByClassName("menu-button")[0];
		var sections = document.getElementsByTagName("section");
		var gallery = document.getElementsByClassName("gallery")[0];
		var galleryWrapper = gallery.getElementsByClassName("wrapper")[0];

		var cookieDiv = document.getElementsByClassName("cookie-div")[0];
		
		var cookieText = decodeURIComponent(document.cookie);
		if (cookieText.search("hasAlreadyVisited=true") != -1) {
			cookieDiv.style.display = "none";
		}
		
		var keys = {37: 1, 38: 1, 39: 1, 40: 1};

		function preventDefault(e) {
			e = e || window.event;
			if (e.preventDefault)
				e.preventDefault();
			e.returnValue = false;  
		}

		function preventDefaultForScrollKeys(e) {
			if (keys[e.keyCode]) {
				preventDefault(e);
				return false;
			}
		}

		function disableScroll() {
			if (window.addEventListener) // older FF
				window.addEventListener('DOMMouseScroll', preventDefault, false);
			window.onwheel = preventDefault; // modern standard
			window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
			window.ontouchmove  = preventDefault; // mobile
			document.onkeydown  = preventDefaultForScrollKeys;
		}

		function enableScroll() {
			if (window.removeEventListener)
				window.removeEventListener('DOMMouseScroll', preventDefault, false);
			window.onmousewheel = document.onmousewheel = null; 
			window.onwheel = null; 
			window.ontouchmove = null;  
			document.onkeydown = null;  
		}
		
		scrollDownButton.addEventListener("click", function() {
			var intInnerViewportH = window.innerHeight;
			window.scroll({
				top: intInnerViewportH,
				left: 0,
				behavior: "smooth"
			});
		});
		
		window.setTimeout(function () {scrollDownButton.click()}, 500);
		
		document.addEventListener("scroll", function() {
			windowWidth = w.innerWidth || e.clientWidth || g.clientWidth;
			var intInnerViewportH = window.innerHeight;
			scrollVar = window.pageYOffset || document.documentElement.scrollTop;
			if (scrollVar < (scrollVar - sections[0].getBoundingClientRect().top)) {
				for (i = 0; i < sections.length; i++) {
					var sectionRect = sections[i].getBoundingClientRect();
					var sectionTopOffset = scrollVar + sectionRect.top - 100;
					if (scrollVar > sectionTopOffset - (intInnerViewportH - 300)) {
						var h2 = sections[i].getElementsByTagName("h2")[0];
						//h2.classList.add("in-view");
						sections[i].classList.add("in-view");
					}
				}
			}
			if (windowWidth > 960) {
				scrollVar = window.pageYOffset || document.documentElement.scrollTop;
				if (scrollVar >= navTopOffset) {
					nav.classList.add("scroll-nav");
					aboveFold.style.marginBottom = navHeight + "px";
				} else {
					nav.classList.remove("scroll-nav");
					aboveFold.style.marginBottom = "0";
				}
			}  
		});
		
		menuButton.addEventListener("click", function() {
			menuButton.classList.toggle("open");
			nav.classList.toggle("open");
			header.classList.toggle("open");
			aboveFold.classList.toggle("away");
			if (menuButton.classList.contains("open")) {
				disableScroll();
			} else {
				enableScroll();
			}
		});
		
		window.addEventListener("resize", function() {
			navRect = nav.getBoundingClientRect();
			navTopOffset = window.innerHeight || e.clientHeight || g.clientHeight;
			navHeight = nav.offsetHeight;
			windowWidth = w.innerWidth || e.clientWidth || g.clientWidth;
		});
		
		backToTop.addEventListener("click", function() {
			window.scroll({top: 0, left: 0, behavior: "smooth"});
		});
		
		cookieDiv.getElementsByClassName("got-it")[0].addEventListener("click", function() {
			cookieDiv.style.display="none";
			var now = new Date();
			var time = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);
			document.cookie = "hasAlreadyVisited=true; expires=" + time.toGMTString() + ";";
		});
		
		// gallery start
		
		galleryWrapper.addEventListener("touchstart", handleTouchStart, false); 
		galleryWrapper.addEventListener("touchmove", handleTouchMove, false);
		galleryWrapper.addEventListener("touchend", handleTouchEnd, false);

		var xDown = null; 
		var yDown = null;
		var numberMarginLeft = 0;
		
		var firstGalleryDiv = galleryWrapper.getElementsByTagName("div")[0];
		var toLeft = gallery.getElementsByClassName("left")[0];
		var toRight = gallery.getElementsByClassName("right")[0];
		var activeDiv = galleryWrapper.getElementsByClassName("active")[0];
		var countDivs = galleryWrapper.getElementsByTagName("div").length;
		var targetDiv;
		
		toLeft.addEventListener("click", function(e) {
			var e = e || window.event;
			var target = e.target || window.target;
			activeDiv = galleryWrapper.getElementsByClassName("active")[0];
			if (activeDiv.id == "div1") {
				return;
			} else {
				var newActiveDiv = activeDiv.previousSibling.previousSibling;
				newActiveDiv.classList.add("active");
				activeDiv.classList.remove("active");
				targetDiv = newActiveDiv;
			}
			slideTo();
		});
		
		toRight.addEventListener("click", function(e) {
			var e = e || window.event;
			var target = e.target || window.target;
			activeDiv = galleryWrapper.getElementsByClassName("active")[0];
			if (activeDiv.id == "div6") {
				return;
			} else {
				var newActiveDiv = activeDiv.nextSibling.nextSibling;
				newActiveDiv.classList.add("active");
				activeDiv.classList.remove("active");
				targetDiv = newActiveDiv;
			}
			slideTo();
		});
		
		function slideTo() {
			if (typeof(targetDiv) == "undefined") {
				return;
			}
			//console.log(targetDiv.id);
			numberMarginLeft = targetDiv.id.replace("div", "") - 1;
			var marginLeft = "-" + 102 * numberMarginLeft + "%";
			firstGalleryDiv.style.marginLeft = marginLeft;
			galleryWrapper.getElementsByClassName("active")[0].classList.remove("active");
			targetDiv.classList.add("active");
		}

		function handleTouchStart(e) { 
			var e = e || window.event;
			if (typeof(e.touches) != "undefined") {
				xDown = e.touches[0].clientX;                                    
				yDown = e.touches[0].clientY;
			} else {
				xDown = e.clientX;                                    
				yDown = e.clientY;
			}
			firstGalleryDiv.classList.add("drag");
		}                                               

		function handleTouchMove(e) {
			var e = e || window.event;
			windowWidth = w.innerWidth || e.clientWidth || g.clientWidth;
			var slideLimit = 25;
			if (windowWidth > 960) {
				slideLimit = 200;
			}
			
			if (!xDown || !yDown) {
				return;
			}

			if (typeof(e.touches) != "undefined") {
				xUp = e.touches[0].clientX;                                    
				yUp = e.touches[0].clientY;
			} else {
				xUp = e.clientX;                                    
				yUp = e.clientY;
			}

			var xDiff = xDown - xUp;
			var yDiff = yDown - yUp;
			
			var activeDiv = galleryWrapper.getElementsByClassName("active")[0];
			var activeDivNumber = activeDiv.id.replace("div", "");

			if (Math.abs(xDiff) > Math.abs(yDiff)) {
				e.preventDefault();
				if (xDiff > 0) {
					//alert("swipe left");
					if (xDiff > (slideLimit) && activeDivNumber != countDivs) {
						targetDiv = activeDiv.nextSibling.nextSibling;
					}
				} else {
					//alert("swipe right");
					if (xDiff < -(slideLimit) && activeDivNumber != 1) {
						targetDiv = activeDiv.previousSibling.previousSibling;
					}
				}
			}
			
			var additional = numberMarginLeft * firstGalleryDiv.offsetWidth + numberMarginLeft * (firstGalleryDiv.offsetWidth * 0.02);
			
			//console.log(additional);
			
			firstGalleryDiv.style.marginLeft = -(additional + xDiff) + "px";
			
		}
		
		function handleTouchEnd() {
			
			firstGalleryDiv.classList.remove("drag");
			
			xDown = null;
			yDown = null;
			xUp = null;
			yUp = null;
			
			if (!targetDiv) {
				return;
			}
			
			slideTo();
		}
		
		// gallery end
		
	}
	
	document.addEventListener("DOMContentLoaded", function() {
		init();
	});

})(window, document)