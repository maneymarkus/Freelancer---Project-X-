// written by me

function init() {

	let Module = (function (window, document, undefined) {

		let w = window,
			d = document,
			el = d.documentElement,
			g = d.getElementsByTagName('body')[0];

		let scrollDownButton = document.getElementById("content-below");
		let backToTop = document.getElementById("back-to-top");
		let cookieDiv = document.getElementsByClassName("cookie-div")[0];

		let intInnerViewportH = window.innerHeight;

		let cookieText = decodeURIComponent(document.cookie);
		if (cookieText.search("hasAlreadyVisited=true") != -1) {
			cookieDiv.style.display = "none";
		}

		cookieDiv.getElementsByClassName("got-it")[0].addEventListener("click", function () {
			cookieDiv.style.display = "none";
			let now = new Date();
			let time = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);
			document.cookie = "hasAlreadyVisited=true; expires=" + time.toGMTString() + ";";
		});

		scrollDownButton.addEventListener("click", function () {
			intInnerViewportH = window.innerHeight;
			window.scroll({
				top: intInnerViewportH,
				left: 0,
				behavior: "smooth"
			});
		});

		backToTop.addEventListener("click", function () {
			window.scroll({top: 0, left: 0, behavior: "smooth"});
		});

		window.addEventListener("resize", function () {
			NavModule.resizeApi();
		});

	})(window, document);




	let NavModule = (function(window, document, undefined) {

		let w = window,
			d = document,
			el = d.documentElement,
			g = d.getElementsByTagName('body')[0];

		let wrapper = document.getElementsByClassName("wrapper")[0];
		let aboveFold = document.getElementById("above-fold");
		let nav = document.getElementById("main-nav");
		let header = document.getElementsByClassName("header")[0];
		let menuButton = document.getElementsByClassName("menu-button")[0];
		let lis = nav.getElementsByTagName("li");
		let sections = document.getElementsByTagName("section");

		let scrollVar = document.scrollTop;
		let navRect = nav.getBoundingClientRect();
		let windowHeight = window.innerHeight || el.clientHeight || g.clientHeight;
		let windowWidth = w.innerWidth || el.clientWidth || g.clientWidth;
		let navTopOffset = (navRect.top <= windowHeight) ? windowHeight : navRect.top;
		let navHeight = nav.offsetHeight;

		function scrollFunc() {
			windowWidth = w.innerWidth || el.clientWidth || g.clientWidth;
			let intInnerViewportH = window.innerHeight;
			scrollVar = wrapper.scrollTop;
			for (let i = 0; i < lis.length; i++) {
				lis[i].classList.remove("view");
			}
			menuButton.classList.remove("white");
			nav.classList.remove("bright");
			if (scrollVar < (scrollVar - sections[0].getBoundingClientRect().top)) {
				for (let i = 0; i < sections.length; i++) {
					sections[i].classList.remove("in-view");
					let sectionRect = sections[i].getBoundingClientRect();
					let sectionTopOffset = scrollVar + sectionRect.top - 100;
					if (scrollVar > sectionTopOffset - (intInnerViewportH - 300)) {
						sections[i].classList.add("in-view");
					}
					if (scrollVar > sectionTopOffset) {
						if (nav.querySelector('a[href="#' + sections[i].id + '"]') != null) {
							var li = nav.querySelector('a[href="#' + sections[i].id + '"]').parentNode;
						}
					}
				}
				//li.classList.add("view");
			}
			navHeight = nav.offsetHeight;
			if (windowWidth >= 960) {
				scrollVar = wrapper.scrollTop;
				if (scrollVar >= navTopOffset) {
					header.classList.add("scroll-nav");
				} else {
					header.classList.remove("scroll-nav");
				}
			}
		}

		wrapper.addEventListener("scroll", scrollFunc);

		nav.addEventListener("click", function(e) {
			//e.preventDefault();
			let target = e.target || window.target;
			windowWidth = w.innerWidth || el.clientWidth || g.clientWidth;
			let scrollVar = wrapper.scrollTop;
			if (target.getAttribute("href") == null) {
				return;
			}
			let hrefAttribute = target.getAttribute("href").replace("#", "");
			let scrollTarget = document.getElementById(hrefAttribute);
			if (scrollTarget === undefined) {
				return;
			}
			let elementRect = scrollTarget.getBoundingClientRect();
			let elementRelativeOffset = elementRect.top;
			let elementTopOffset = scrollVar + elementRelativeOffset;
			if (windowWidth < 960) {
				window.setTimeout(function() {wrapper.scroll({top: elementTopOffset, left: 0, behavior: "smooth"})}, 500);
			} else {
				wrapper.scroll({top: elementTopOffset, left: 0, behavior: "smooth"});
			}
			menuButton.classList.remove("open");
			nav.classList.remove("open");
			header.classList.remove("open");
			aboveFold.classList.remove("away");
		});

		menuButton.addEventListener("click", function() {
			menuButton.classList.toggle("open");
			header.classList.toggle("open");
		});

		function checkNav() {
			let windowWidth = w.innerWidth || el.clientWidth || g.clientWidth;
			if (windowWidth >= 960) {
				wrapper.insertBefore(header, wrapper.firstChild.nextSibling.nextSibling);
			} else {
				g.insertBefore(header, g.firstChild);
			}
		}

		checkNav();

		function resizeNav() {
			navRect = nav.getBoundingClientRect();
			navTopOffset = window.innerHeight || el.clientHeight || g.clientHeight;
			navHeight = nav.offsetHeight;
			let newWindowWidth = w.innerWidth || el.clientWidth || g.clientWidth;
			if (windowWidth !== newWindowWidth) {
				windowWidth = newWindowWidth;
			}
			checkNav();
		}

		return {
			resizeApi : function() {
				resizeNav();
			}
		}

	})(window, document);

}

document.addEventListener("DOMContentLoaded", function() {
	init();
});
