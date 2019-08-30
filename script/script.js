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
		var body = document.getElementsByTagName("body")[0];
		var nav = document.getElementById("main-nav");
		var header = document.getElementsByClassName("header")[0];
		var navRect = nav.getBoundingClientRect();
		var windowHeight = window.innerHeight || e.clientHeight || g.clientHeight;
		var navTopOffset = (navRect.top <= windowHeight) ? windowHeight : navRect.top;
		var navHeight = nav.offsetHeight;
		var menuButton = document.getElementsByClassName("menu-button")[0];
		var sections = document.getElementsByTagName("section");
		var main = document.getElementsByTagName("main")[0];

		var cookieDiv = document.getElementsByClassName("cookie-div")[0];
		
		var cookieText = decodeURIComponent(document.cookie);
		if (cookieText.search("hasAlreadyVisited=true") != -1) {
			cookieDiv.style.display = "none";
		}

		function preventDefault(e) {
			e = e || window.event;
			if (e.preventDefault)
				e.preventDefault();
			e.returnValue = false;  
		}
		
		scrollDownButton.addEventListener("click", function() {
			var intInnerViewportH = window.innerHeight;
			window.scroll({
				top: intInnerViewportH,
				left: 0,
				behavior: "smooth"
			});
		});
		
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
			body.classList.toggle("open");
			nav.classList.toggle("open");
			header.classList.toggle("open");
			aboveFold.classList.toggle("away");
			if (menuButton.classList.contains("open")) {
				window.setTimeout(function () {
					aboveFold.style.display = "none";
					main.style.display = "none";
				}, 800);
			} else {
				window.setTimeout(function() {
					aboveFold.style.display = "block";
					main.style.display = "block";
				}, 800);
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
		
	}
	
	document.addEventListener("DOMContentLoaded", function() {
		init();
	});

})(window, document)