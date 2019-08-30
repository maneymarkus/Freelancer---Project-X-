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
	
	var activePager = pager.getElementsByClassName("active")[0];
	var activePagerNumber = activePager.getAttribute("href").replace("piece", "");
	var countPager = pagers.length;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {
		targetPager = activePager;
		e.preventDefault();
		if (xDiff > 0) {
			//alert("swipe left");
			if (xDiff > (slideLimit) && activePagerNumber != countPager) {
				targetPager = activePager.nextSibling;
				//slideTo(targetPager);
			}
		} else {
			//alert("swipe right");
			if (xDiff < -(slideLimit) && activePagerNumber != 1) {
				targetPager = activePager.previousSibling;
				//slideTo(targetPager);
			}
		}                       
	}
	
	var additional = numberMarginLeft * pieces * firstGalleryDiv.offsetWidth + numberMarginLeft * pieces * (firstGalleryDiv.offsetWidth * 0.02);
	
	//console.log(additional);
	
	firstGalleryDiv.style.marginLeft = -(additional + xDiff) + "px";
	
}

function handleTouchEnd() {
	
	firstGalleryDiv.classList.remove("drag");
	
	if (!targetPager) {
		return;
	}
	
	slideTo(targetPager);
	
	xDown = null;
	yDown = null;
}