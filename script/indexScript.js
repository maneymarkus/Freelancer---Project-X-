// written by me

function init(window, document, LoadingModule, undefined) {

	window.setTimeout(function () {
		let loadingContainer = document.getElementsByClassName("loading-container")[0];
		LoadingModule.stopApi(loadingContainer);
	}, 300);

	let header = document.getElementsByClassName("header")[0];
	let overlay = document.getElementsByClassName("playground-overlay")[0];
	let wrapper = document.getElementsByClassName("wrapper")[0];
	let backToTop = document.getElementById("back-to-top");
	let menuButton = document.getElementsByClassName("menu-button")[0];
	let cookieDiv = document.getElementsByClassName("cookie-div")[0];
	let bodyElems = [header, overlay, wrapper, backToTop, menuButton, cookieDiv];

	for (let i = 0; i < bodyElems.length; i++) {
		bodyElems[i].classList.remove("hide");
	}

	let Module = (function(window, document, undefined) {

		let intInnerViewportH = window.innerHeight;

		let wrapper = document.getElementsByClassName("wrapper")[0];
		let scrollDownButton = document.getElementById("content-below");
		let backToTop = document.getElementById("back-to-top");
		let cookieDiv = document.getElementsByClassName("cookie-div")[0];

		let cookieText = decodeURIComponent(document.cookie);
		if (cookieText.search("hasAlreadyVisited=true") != -1) {
			cookieDiv.style.display = "none";
		}

		cookieDiv.getElementsByClassName("got-it")[0].addEventListener("click", function() {
			cookieDiv.style.display="none";
			let now = new Date();
			let time = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);
			document.cookie = "hasAlreadyVisited=true; expires=" + time.toGMTString() + ";";
		});

		scrollDownButton.addEventListener("click", function() {
			intInnerViewportH = window.innerHeight;
			wrapper.scroll({
				top: intInnerViewportH,
				left: 0,
				behavior: "smooth"
			});
		});

		backToTop.addEventListener("click", function() {
			wrapper.scroll({top: 0, left: 0, behavior: "smooth"});
		});

		window.addEventListener("resize", function() {
			NavModule.resizeApi();
			CanvasModule.resizeApi();
			GalleryModule.resizeApi();
			ReferenceModule.resizeApi();
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
		let contactSection = document.getElementById("contact");
		let qualitySection = document.getElementById("qualities");
		let qualityDivs = qualitySection.getElementsByClassName("part");

		let scrollVar = wrapper.scrollTop;
		let navRect = nav.getBoundingClientRect();
		let windowHeight = window.innerHeight || el.clientHeight || g.clientHeight;
		let windowWidth = w.innerWidth || el.clientWidth || g.clientWidth;
		let navTopOffset = (navRect.top <= windowHeight) ? windowHeight : navRect.top;
		let navHeight = nav.offsetHeight;

		let fadeArray = [];

		function FadeDiv (reference, fadeInLimit) {
			this.reference = reference;
			this.fadeInLimit = fadeInLimit;
			this.faded = false;
		}

		let lastOffset;

		for (let i = 0; i < qualityDivs.length; i++) {
			let div = qualityDivs[i];
			let divRect = div.getBoundingClientRect();
			let divTopOffset = divRect.top + scrollVar;
			let fadeInLimit = Math.round(divTopOffset - (windowHeight * (3/4)));
			if (lastOffset >= (divTopOffset - 10)) {
				fadeInLimit += 100;
			}
			fadeArray[i] = new FadeDiv(div, fadeInLimit);
			lastOffset = divTopOffset;
		}

		function getContactTopOffset () {
			let rect = contactSection.getBoundingClientRect();
			let scrollTop = wrapper.scrollTop;
			let clientTop = document.documentElement.clientTop || document.body.clientTop || 0;
			let topOffset = (scrollTop + rect.top) - clientTop - 30;
			return Math.round(topOffset);
		}

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
				li.classList.add("view");
			}
			let contactSectionOffset = getContactTopOffset();
			if (scrollVar >= contactSectionOffset) {
				if (windowWidth <= 960) {
					menuButton.classList.add("white");
				} else {
					nav.classList.add("bright");
				}
			}
			for (let i = 0; i < fadeArray.length; i++) {
				let div = fadeArray[i];
				if (scrollVar >= div.fadeInLimit) {
					div.reference.style.left = "0px";
					div.reference.style.opacity = "1";
				}
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
			//window.requestAnimationFrame(scrollFunc);
		}

		//scrollFunc();

		//window.setInterval(scrollFunc, 10);

		wrapper.addEventListener("scroll", scrollFunc);

		nav.addEventListener("click", function(e) {
			e.preventDefault();
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




	let CanvasModulePaint = (function (window, document, undefined) {

		let mouseActionSec = document.getElementById("mouse-action");
		let mouseCanvas = mouseActionSec.getElementsByTagName("canvas")[0];

		let animationReference;
		let particleReference;
		let ctx = mouseCanvas.getContext("2d");
		let colors = ["#717DFF", "#8FB0FF", "#449EFF", "#3C43FF", "#8F87FF"];
		let particles = [];
		let x = mouseCanvas.width / 2;
		let y = mouseCanvas.height / 2;

		function Particle(x, y, vy, size, counter, color, opacity) {

			let _this = this;

			(function(_this) {
				_this.x = x || undefined;
				_this.y = y || undefined;
				_this.vy = vy || undefined;
				_this.counter = counter || undefined;
				_this.size = size || undefined;
				_this.color = color || undefined;
				_this.opacity = opacity || undefined;
			})(_this);

			this.update = function() {
				if (opacity <= 0.05) {
					particles.shift();
				} else {
					opacity -= 0.01;
					counter += 1;
					if (counter > 50) {
						y += vy;
					}
				}
			};

			this.draw = function() {
				ctx.globalAlpha = opacity;
				ctx.fillStyle = color;
				ctx.fillRect(x, y, size, size);
			}

		}

		function createParticle(xPos, yPos) {
			let size = 5 + Math.random() * 5;
			let color = colors[(Math.ceil(Math.random() * 10) % colors.length)];
			let vy = 5;
			let counter = 0;
			let p = new Particle(xPos, yPos, vy, size, counter, color, 1);
			particles.push(p);
		}

		function render() {
			ctx.clearRect(0, 0, mouseCanvas.width, mouseCanvas.height);
			for (let i = 0; i < particles.length; i++) {
				particles[i].draw();
				particles[i].update();
			}
			animationReference = requestAnimationFrame(render);
		}

		function createParticles() {
			for (let i = 0; i < 15; i++) {
				let xPos = x + Math.floor(Math.random() * 100) - 50;
				let yPos = y + Math.floor(Math.random() * 100) - 50;
				if (Math.sqrt(Math.pow((xPos - x),2) + Math.pow((yPos - y), 2)) < 30) {
					createParticle(xPos, yPos);
				}
			}
			particleReference = requestAnimationFrame(createParticles);
		}

		function startAnimation() {
			createParticles();
			render();
		}

		startAnimation();

		function stopAnimation() {
			ctx.clearRect(0, 0, mouseCanvas.width, mouseCanvas.height);
			particles = [];
			x = mouseCanvas.width / 2;
			y = mouseCanvas.height / 2;
			cancelAnimationFrame(animationReference);
			cancelAnimationFrame(particleReference);
		}

		return {
			resizeApi : function() {
				x = mouseCanvas.width / 2;
				y = mouseCanvas.height / 2;
			},
			mouseHandlerApi : function(ex, ey) {
				x = ex;
				y = ey;
			},
			touchHandlerApi : function(ex, ey) {
				x = ex;
				y = ey;
			},
			startApi : function() {
				startAnimation();
			},
			stopApi : function() {
				stopAnimation();
			}
		}

	})(window, document);




	let CanvasModuleMinigame = (function(window, document, undefined) {

		let canvas = document.getElementById("mouse-canvas");
		let stats = document.getElementById("stats");

		let animationReference;
		let createFoodIntervalId;
		let ctx = canvas.getContext("2d");
		let colors = ["#717DFF", "#8FB0FF", "#449EFF", "#3C43FF", "#8F87FF"];
		let foodColors = ["#ffee7b", "#ffb0fa", "#99ff90", "#ff5b67", "#7EAEFF"];
		let x = canvas.width / 2;
		let y = canvas.height / 2;
		let user;
		let enemy;
		let foods = [];
		let players = [];
		let velocity = 15;
		let maxVelocity = 3;
		let minVelocity = 0.35;
		//let startTime = new Date().getTime();

		function Player(x, y, vx, vy, radius, color) {

			this.x = x;
			this.y = y;
			this.vx = vx;
			this.vy = vy;
			this.radius = radius;
			this.color = color;
		}

		Player.prototype = {
			grow : function(added) {
				this.radius += added;
			},

			draw : function() {
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, 7, false);
				ctx.fillStyle = this.color;
				ctx.fill();
			},
		};

		function User(x, y, vx, vy, radius, color) {
			Player.call(this, x, y, vx, vy, radius, color);

			this.update = function() {

				let threshold = this.radius * 0.25;

				let normalVelocity = velocity / threshold;
				let maxV = Math.min(maxVelocity, normalVelocity);

				if (this.controls.up) {
					this.vy -= 0.2;
					if (this.vy < 0 && this.vy > (minVelocity * -1)) {
						this.vy = minVelocity * -1;
					}
					if (this.vy <= maxV * -1) {
						this.vy = maxV * -1;
					}
				}
				if (this.controls.right) {
					this.vx += 0.2;
					if (this.vx > 0 && this.vx < minVelocity) {
						this.vx = minVelocity;
					}
					if (this.vx >= maxV) {
						this.vx = maxV;
					}
				}
				if (this.controls.bottom) {
					this.vy += 0.2;
					if (this.vy > 0 && this.vy < minVelocity) {
						this.vy = minVelocity;
					}
					if (this.vy >= maxV) {
						this.vy = maxV;
					}
				}
				if (this.controls.left) {
					this.vx -= 0.2;
					if (this.vx < 0 && this.vx > (minVelocity * -1)) {
						this.vx = minVelocity * -1;
					}
					if (this.vx <= maxV * -1) {
						this.vx = maxV * -1;
					}
				}
				if (!this.controls.up && this.vy < 0) {
					this.vy += 0.1;
				}
				if (!this.controls.right && this.vx > 0) {
					this.vx -= 0.1;
				}
				if (!this.controls.bottom && this.vy > 0) {
					this.vy -= 0.1;
				}
				if (!this.controls.left && this.vx < 0) {
					this.vx += 0.1;
				}
				if ((this.x + 0.5 * this.radius >= canvas.width) && this.vx > 0) {
					this.vx = 0;
				} else if ((this.x - 0.5 * this.radius <= 0) && this.vx < 0) {
					this.vx = 0;
				}
				if ((this.y + 0.5 * this.radius >= canvas.height) && this.vy > 0) {
					this.vy = 0;
				} else if ((this.y - 0.5 * this.radius <= 0) && this.vy < 0) {
					this.vy = 0;
				}
				this.vx = Math.round(this.vx * 10) / 10;
				this.vy = Math.round(this.vy * 10) / 10;
				//console.log(this.vx + " : " + this.vy);
				this.x += this.vx;
				this.y += this.vy;
				if (enemy) {
					this.eat();
				}
				this.stats();
			};

			this.eat = function() {
				let dist = Math.sqrt((Math.pow((enemy.x - this.x), 2) + Math.pow((enemy.y - this.y), 2)));
				let difRad = (this.radius - enemy.radius);
				if (dist < (this.radius - enemy.radius * 0.75) && difRad > 5) {
					let player1Area = 3.1415 * Math.pow(enemy.radius, 2);
					let player2Area = 3.1415 * Math.pow(this.radius, 2);
					let mergedArea = player1Area + player2Area;
					let newRadius = Math.sqrt(mergedArea/3.1415);
					let growBy = newRadius - this.radius;
					this.grow(growBy);
					enemy = undefined;
					window.setTimeout(function () {
						enemy = createEnemy();
					}, ((Math.random() * 5000) + 1000));
				}
			};

			this.stats = function() {
				stats.innerHTML = "" + Math.floor(this.radius * 4);
			};

			this.controls = {
				up: false,
				right: false,
				bottom: false,
				left: false
			};

		}

		User.prototype = Object.create(Player.prototype, {

		});
		User.prototype.constructor = User;

		function createUser(x, y) {
			let color = colors[(Math.floor(Math.random() * 100)) % 5];
			let radius = 18;
			return new User(Math.floor(x), Math.floor(y), 0, 0, radius, color);
		}

		function Enemy(x, y, vx, vy, radius, color) {

			Player.call(this, x, y, vx, vy, radius, color);

			let newDestination = {
				x,
				y,
			};

			let waitingCounter = 0;

			this.update = function() {
				if (user) {
					if ((user.radius - this.radius) > 5) {
						let dist = Math.sqrt((Math.pow((user.x - this.x), 2) + Math.pow((user.y - this.y), 2)));
						if (dist < (user.radius + this.radius + 5)) {
							this.runAway(dist);
						}
					}
				}
				if (waitingCounter === 0) {
					if (user) {
						if (this.radius - 8 > user.radius) {
							this.tryToEatUser();
						} else {
							if (foods.length > 0) {
								this.searchForFood();
							}
						}
					} else {
						if (foods.length > 0) {
							this.searchForFood();
						}
					}
					waitingCounter = Math.round((Math.random() * 200));
				}
				waitingCounter -= 1;
				this.go();
				if (user) {
					this.eat();
				}
			};

			this.eat = function() {
				let dist = Math.sqrt((Math.pow((user.x - this.x), 2) + Math.pow((user.y - this.y), 2)));
				let difRad = (this.radius - user.radius);
				if (dist < (this.radius - user.radius * 0.75) && difRad > 5) {
					let player1Area = 3.1415 * Math.pow(user.radius, 2);
					let player2Area = 3.1415 * Math.pow(this.radius, 2);
					let mergedArea = player1Area + player2Area;
					let newRadius = Math.sqrt(mergedArea / 3.1415);
					let growBy = newRadius - this.radius;
					this.grow(growBy);
					user = undefined;
					window.setTimeout(function () {
						let ux = Math.floor((Math.random() * (canvas.width - 15)) + 15);
						let uy = Math.floor((Math.random() * (canvas.height - 15)) + 15);
						let dist = Math.sqrt((Math.pow((ux - this.x), 2) + (Math.pow((uy - this.y), 2))));
						while (dist < 100) {
							ux = Math.floor((Math.random() * (canvas.width - 15)) + 15);
							uy = Math.floor((Math.random() * (canvas.height - 15)) + 15);
							dist = Math.sqrt((Math.pow((ux - user.x), 2) + (Math.pow((uy - user.y), 2))));
						}
						user = createUser(ux, uy);
					}, ((Math.random() * 5000) + 1000));
				}
			};

			this.runAway = function(dist) {
				let m = (this.y - user.y) / (this.x - user.x);
				let b = this.y - m * this.x;
				newDestination.y = m * (this.x + 10) + b;
				newDestination.x = (newDestination.y - b) / m;
				let newDist = Math.sqrt((Math.pow((newDestination.x - user.x), 2) + Math.pow((user.y - newDestination.y), 2)));
				if (newDist < dist) {
					newDestination.y = m * (this.x - 10) + b;
					newDestination.x = (newDestination.y - b) / m;
				}
			};

			this.go = function () {

				let threshold = this.radius * 0.25;

				let normalVelocity = velocity / threshold;
				let maxV = Math.min(maxVelocity, normalVelocity);
				let vel = Math.max(maxV, minVelocity);

				this.vx = 0;
				this.vy = 0;
				if (Math.sqrt(Math.pow((this.x - newDestination.x), 2)) > 5) {
					if (newDestination.x - this.x >= 0) {
						this.vx = vel;
					} else {
						this.vx = vel * -1;
					}
				}
				if (Math.sqrt(Math.pow((this.y - newDestination.y), 2)) > 5) {
					if (newDestination.y - this.y >= 0) {
						this.vy = vel;
					} else {
						this.vy = vel * -1;
					}
				}
				if ((this.x + 0.5 * this.radius >= canvas.width) && this.vx > 0) {
					this.vx = 0;
				} else if ((this.x - 0.5 * this.radius <= 0) && this.vx < 0) {
					this.vx = 0;
				}
				if ((this.y + 0.5 * this.radius >= canvas.height) && this.vy > 0) {
					this.vy = 0;
				} else if ((this.y - 0.5 * this.radius <= 0) && this.vy < 0) {
					this.vy = 0;
				}
				this.x += this.vx;
				this.y += this.vy;
			};

			this.searchForFood = function() {
				let minDist = Math.sqrt((Math.pow((this.x - foods[0].x), 2) + Math.pow((this.y - foods[0].y), 2)));
				newDestination = {
					x : foods[0].x,
					y : foods[0].y,
				};
				for (let i = 1; i < foods.length; i++) {
					let dist = Math.sqrt((Math.pow((this.x - foods[i].x), 2) + Math.pow((this.y - foods[i].y), 2)));
					if (dist < minDist) {
						minDist = dist;
						newDestination = {
							x : foods[i].x,
							y : foods[i].y,
						}
					}
				}
			};

			this.tryToEatUser = function() {
				newDestination = {
					x : user.x,
					y : user.y,
				};
			};
		}

		Enemy.prototype = Object.create(Player.prototype, {

		});
		Enemy.prototype.constructor = Enemy;

		function createEnemy() {
			let color = colors[(Math.floor(Math.random() * 100)) % 5];
			while (color === user.color) {
				color = colors[(Math.floor(Math.random() * 100)) % 5];
			}
			let radius = 15;
			let ex = Math.floor((Math.random() * (canvas.width - 15)) + 15);
			let ey = Math.floor((Math.random() * (canvas.height - 15)) + 15);
			let dist = Math.sqrt((Math.pow((ex - user.x), 2) + (Math.pow((ey - user.y), 2))));
			while (dist < 100) {
				ex = Math.floor((Math.random() * (canvas.width - 15)) + 15);
				ey = Math.floor((Math.random() * (canvas.height - 15)) + 15);
				dist = Math.sqrt((Math.pow((ex - user.x), 2) + (Math.pow((ey - user.y), 2))));
			}
			return new Enemy(ex, ey, 0, 0, radius, color);
		}

		function Food(x, y, radius, color) {

			this.x = x;
			this.y = y;
			this.radius = radius;
			this.color = color;

			this.update = function() {

				if (user) {
					this.ateByUser();
				}
				if (enemy) {
					this.ateByEnemy();
				}
			};

			this.ateByUser = function() {
				let deltaX = this.x - user.x;
				let deltaY = this.y - user.y;
				let dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

				if (dist < user.radius) {
					let fIndex = foods.indexOf(this);
					foods.splice(fIndex, 1);
					user.grow(0.25);
				}
			};

			this.ateByEnemy = function() {
				let deltaX = this.x - enemy.x;
				let deltaY = this.y - enemy.y;
				let dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

				if (dist < enemy.radius) {
					let fIndex = foods.indexOf(this);
					foods.splice(fIndex, 1);
					enemy.grow(0.25);
				}
			};

			this.draw = function() {
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, 7, false);
				ctx.fillStyle = this.color;
				ctx.fill();
			};

		}

		function createFood() {
			let fx = Math.floor((Math.random() * (canvas.width - 5)) + 5);
			let fy = Math.floor((Math.random() * (canvas.height - 5)) + 5);
			let color = foodColors[Math.floor((Math.random() * 100) % 5)];
			let radius = 3;
			let f = new Food(fx, fy, radius, color);
			foods.push(f);
		}

		function render() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (user) {
				user.draw();
				user.update();
			}
			if (enemy) {
				enemy.draw();
				enemy.update();
			}
			if (foods.length !== 0) {
				for (let i = 0; i < foods.length; i++) {
					foods[i].draw();
					foods[i].update();
				}
			}
			animationReference = requestAnimationFrame(render);
		}

		function handleKey(e) {
			let keyNum = e.which;
			if (user) {
				switch (keyNum) {
					case 9:
						CanvasModule.removeKeyListenerApi();
						break;
					case 37:
						user.controls.left = e.type == "keydown";
						break;
					case 38:
						user.controls.up = e.type == "keydown";
						break;
					case 39:
						user.controls.right = e.type == "keydown";
						break;
					case 40:
						user.controls.bottom = e.type == "keydown";
						break;
				}
			}
		}

		function startAnimation() {
			user = createUser(canvas.width / 2, canvas.height / 2);
			enemy = createEnemy();
			players.push(user, enemy);
			createFoodIntervalId = window.setInterval(createFood, 1000);
			render();
			stats.style.display = "inline-block";
		}

		function stopAnimation() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			user = undefined;
			enemy = undefined;
			foods = [];
			x = canvas.width / 2;
			y = canvas.height / 2;
			cancelAnimationFrame(animationReference);
			clearInterval(createFoodIntervalId);
			stats.style.display = "none";
		}

		return {
			resizeApi : function() {
				x = canvas.width / 2;
				y = canvas.height / 2;
			},
			keyApi : function(e) {
				handleKey(e);
			},
			touchHandlerApi : function(ex, ey) {
				x = ex;
				y = ey;
			},
			startApi : function() {
				startAnimation();
			},
			stopApi : function() {
				stopAnimation();
			}
		}

	})(window, document);




	let CanvasModule = (function (window, document, undefined) {

		let mouseActionSec = document.getElementById("mouse-action");
		let mouseCanvas = mouseActionSec.getElementsByTagName("canvas")[0];
		let modalWin = document.getElementsByClassName("playground-overlay")[0];
		let closeBtn = modalWin.getElementsByClassName("close")[0];
		let switchDiv = document.getElementsByClassName("switch")[0];
		let playgroundHeading = document.getElementById("mouse-action").getElementsByTagName("h2")[0];
		let r1 = document.getElementById("paint");
		let activeCanvas = "paint";
		let listenForKeys = false;

		let x, y;
		let create = true;

		function styleHeading() {
			let colors = ["#ff4558", "#64FFC6", "#ffa53e", "#6CFF69", "#6C7AFF"];

			if (create) {
				create = false;
				let txt = playgroundHeading.innerText;
				playgroundHeading.innerHTML = "";
				for (let i = 0; i < txt.length; i++) {
					let color = colors[Math.floor((Math.random() * 100) % 5)];
					let rotation = Math.floor((Math.random() * 30)) - 15;
					let size = Math.floor((Math.random() * 35) + 25);
					let el = document.createElement("span");
					el.innerHTML = txt.charAt(i);
					el.style.transform = "rotate(" + rotation + "deg)";
					el.style.color = color;
					el.style.fontSize = size + "px";
					playgroundHeading.appendChild(el);
				}
			} else {
				let ch = playgroundHeading.children;
				for (let i = 0; i < ch.length; i++) {
					let span = ch[i];
					let color = colors[Math.floor((Math.random() * 100) % 5)];
					let rotation = Math.floor((Math.random() * 30)) - 15;
					let size = Math.floor((Math.random() * 35) + 25);
					span.style.transform = "rotate(" + rotation + "deg)";
					span.style.color = color;
					span.style.fontSize = size + "px";
				}
			}
		}

		styleHeading();

		playgroundHeading.addEventListener("mouseenter", styleHeading);

		switchDiv.addEventListener("click", canvasHandler);

		function canvasHandler() {
			if (r1.checked && activeCanvas !== "paint") {
				activeCanvas = "paint";
				startPaint();
			} else if (!r1.checked && activeCanvas !== "minigame"){
				activeCanvas = "minigame";
				startMinigame();
			}
		}

		function startPaint() {
			removeKeyListener();
			CanvasModuleMinigame.stopApi();
			CanvasModulePaint.startApi();
		}

		function startMinigame() {
			addKeyListener();
			CanvasModulePaint.stopApi();
			CanvasModuleMinigame.startApi();
		}

		function resizeCanvas() {
			mouseCanvas.width = mouseActionSec.clientWidth;
			CanvasModulePaint.resizeApi();
			CanvasModuleMinigame.resizeApi();
		}

		resizeCanvas();

		function handleCanvasClick() {
			mouseActionSec.classList.add("clicked");
			modalWin.classList.add("visible");
			mouseCanvas.addEventListener("mousemove", function(e) {
				let rect = mouseCanvas.getBoundingClientRect();
				x = e.clientX - rect.left;
				y = e.clientY - rect.top;
				CanvasModulePaint.mouseHandlerApi(x, y);
			});
			mouseCanvas.addEventListener("touchmove", function(e) {
				e.preventDefault();
				let touch = e.touches[0] || e.changedTouches[0];
				let rect = mouseCanvas.getBoundingClientRect();
				x = touch.pageX - rect.left;
				y = touch.pageY - rect.top;
				CanvasModulePaint.touchHandlerApi(x, y);
			});
			addKeyListener();
			mouseActionSec.removeEventListener("click", handleCanvasClick, false);
		}

		let keyDown = function(e) {
			e.preventDefault();
			CanvasModuleMinigame.keyApi(e);
		};

		let keyUp = function(e) {
			e.preventDefault();
			CanvasModuleMinigame.keyApi(e);
		};

		mouseCanvas.addEventListener("click", addKeyListener);

		document.addEventListener("click", function (e) {
			let target = e.target || window.target;
			if (target !== mouseCanvas) {
				removeKeyListener();
			}
		});

		function addKeyListener() {
			if (!listenForKeys) {
				document.addEventListener("keydown", keyDown);
				document.addEventListener("keyup", keyUp);
				listenForKeys = true;
			}
		}

		function removeKeyListener() {
			if (listenForKeys) {
				document.removeEventListener("keydown", keyDown, false);
				document.removeEventListener("keyup", keyUp, false);
				listenForKeys = false;
			}
		}

		closeBtn.addEventListener("click", function () {
			modalWin.classList.remove("visible");
		});

		mouseActionSec.addEventListener("click", handleCanvasClick);

		return {
			resizeApi : function() {
				resizeCanvas();
			},
			removeKeyListenerApi : function () {
				removeKeyListener();
			}
		}

	})(window, document);




	let GalleryModule = (function(window, document, undefined) {

		let w = window,
			d = document,
			el = d.documentElement,
			g = d.getElementsByTagName('body')[0];

		let windowWidth = w.innerWidth || el.clientWidth || g.clientWidth;

		let galleryWrapper = document.getElementsByClassName("gallery")[0].getElementsByClassName("wrapper")[0];

		galleryWrapper.addEventListener("touchstart", handleTouchStart, false);
		galleryWrapper.addEventListener("mousedown", handleTouchStart, false);
		galleryWrapper.addEventListener("touchmove", handleTouchMove, false);
		galleryWrapper.addEventListener("mousemove", handleTouchMove, false);
		galleryWrapper.addEventListener("touchend", handleTouchEnd, false);
		galleryWrapper.addEventListener("mouseup", handleTouchEnd, false);

		let xDown = null;
		let yDown = null;
		let numberMarginLeft = 0;
		let pieces = 0;

		let firstGalleryDiv = galleryWrapper.getElementsByTagName("div")[0];
		let pager = galleryWrapper.parentNode.getElementsByClassName("pager")[0];
		let pagers = pager.getElementsByTagName("a");
		let targetPager;

		pager.addEventListener("click", function(e) {
			e.preventDefault();
			let target = e.target || window.target;
			if (target.getAttribute("href") == null || target.classList.contains("active")) {
				return;
			}
			targetPager = target;
			slideTo(target);
		});

		function checkGallery() {
			let galleryDivs = galleryWrapper.getElementsByTagName("div");
			windowWidth = w.innerWidth || el.clientWidth || g.clientWidth;
			if (windowWidth > 1200) {
				pieces = 3;
				width = Math.round(100/pieces) - 1;
			} else if (windowWidth > 960) {
				pieces = 2;
				width = Math.round(100/pieces) - 1;
			} else {
				pieces = 1;
				width = Math.round(100/pieces);
			}
			let countPager = Math.ceil(galleryDivs.length/pieces);
			galleryDivs[0].style.marginLeft = "0";
			for (let i = 0; i < galleryDivs.length; i++) {
				galleryDivs[i].style.width = width + "%";
			}
			while (pager.firstChild) {
				pager.removeChild(pager.firstChild);
			}
			for (let i = 0; i < countPager; i++) {
				let newPager = document.createElement("a");
				if (i === 0) {
					newPager.classList.add("active");
				}
				let hrefAttribute = "piece" + (i + 1);
				newPager.setAttribute("href", hrefAttribute);
				pager.appendChild(newPager);
			}
			numberMarginLeft = 0;
		}

		checkGallery();

		function slideTo(targetPager) {
			numberMarginLeft = targetPager.getAttribute("href").replace("piece", "") - 1;
			let marginLeft = "-" + 102 * numberMarginLeft + "%";
			firstGalleryDiv.style.marginLeft = marginLeft;
			for (let i = 0; i < pagers.length; i++) {
				pagers[i].classList.remove("active");
			}
			targetPager.classList.add("active");
		}

		function handleTouchStart(e) {
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
			windowWidth = w.innerWidth || el.clientWidth || g.clientWidth;
			let slideLimit = 25;
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

			let xDiff = xDown - xUp;
			let yDiff = yDown - yUp;

			let activePager = pager.getElementsByClassName("active")[0];
			let activePagerNumber = activePager.getAttribute("href").replace("piece", "");
			let countPager = pagers.length;

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

			let additional = numberMarginLeft * pieces * firstGalleryDiv.offsetWidth + numberMarginLeft * pieces * (galleryWrapper.offsetWidth * 0.02);

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

		function resizeGallery() {
			let newWindowWidth = w.innerWidth || el.clientWidth || g.clientWidth;
			if (windowWidth !== newWindowWidth) {
				checkGallery();
			}
			windowWidth = newWindowWidth;
		}

		return {
			resizeApi : function() {
				resizeGallery();
			}
		}

	})(window, document);




	let ReferenceModule = (function(window, document, undefined) {

		let w = window,
			d = document,
			el = d.documentElement,
			g = d.getElementsByTagName('body')[0];

		let windowWidth = w.innerWidth || el.clientWidth || g.clientWidth;

		let reference = document.getElementById("references");

		reference.addEventListener("mousedown", referenceSwipeStart, false);
		reference.addEventListener("touchstart", referenceSwipeStart, false);

		let xTDown = null;
		let yTDown = null;
		let xTMove = null;
		let yTMove = null;
		//var dragOffsetTop;
		//var dragOffsetLeft;

		let dragElement;

		function referenceSwipeStart(e) {
			if (windowWidth >= 960) {
				return;
			}

			dragElement = e.target || window.target;
			if (!dragElement.classList.contains("draggable")) {
				dragElement = dragElement.parentNode;
			}
			if (dragElement.classList.contains("draggable")) {
				e.preventDefault();
				if (typeof(e.touches) != "undefined") {
					xTDown = e.touches[0].clientX;
					yTDown = e.touches[0].clientY;
					dragElement.addEventListener("touchmove", referenceSwipeMove, false);
					dragElement.addEventListener("touchend", referenceSwipeEnd, false);
				} else {
					xTDown = e.clientX;
					yTDown = e.clientY;
					reference.addEventListener("mousemove", referenceSwipeMove, false);
					reference.addEventListener("mouseup", referenceSwipeEnd, false);
				}
				dragElement.classList.add("drag");
				//dragOffsetTop = dragElement.offsetTop;
				//dragOffsetLeft = dragElement.offsetLeft;
			}
		}

		function referenceSwipeMove(e) {
			if (!xTDown || !yTDown) {
				return;
			}

			if (typeof(e.touches) != "undefined") {
				xTMove = xTDown - e.touches[0].clientX;
				yTMove = yTDown - e.touches[0].clientY;
			} else {
				xTMove = xTDown - e.clientX;
				yTMove = yTDown - e.clientY;
			}

			let deg = (dragElement.offsetLeft / windowWidth) * 20;

			dragElement.style.top = (-yTMove) * 0.4 + "px";
			dragElement.style.left = -xTMove + "px";
			dragElement.style.transform = "rotate(" + deg + "deg)";
		}

		function referenceSwipeEnd(e) {

			e.preventDefault();

			let otherElement;

			if (dragElement.nextSibling.nextSibling != null) { //comment and white space count as siblings
				otherElement = dragElement.nextSibling.nextSibling;
			} else {
				otherElement = dragElement.previousSibling.previousSibling;
			}

			let limit = (windowWidth > 150) ? 150 : windowWidth;

			dragElement.classList.remove("drag");

			if (dragElement.offsetLeft < -limit || dragElement.offsetLeft > limit) {
				dragElement.style.top = "0";
				if (dragElement.offsetLeft < 0) {
					dragElement.style.left = -(dragElement.offsetWidth + 50) + "px";
				} else {
					dragElement.style.left = (dragElement.offsetWidth + 50) + "px";
				}
				dragElement.style.zIndex = 0;
				otherElement.style.zIndex = 1;
				window.setTimeout(function() {
					if (dragElement.classList.contains("overlay")) {
						dragElement.style.left = "10%";
					} else {
						dragElement.style.left = "0";
					}
				}, 300);
				dragElement.style.transform = "rotate(0deg)";
			} else {
				if (dragElement.classList.contains("overlay")) {
					dragElement.style.left = "10%";
				} else {
					dragElement.style.left = "0";
				}
				dragElement.style.transform = "rotate(0deg)";
				dragElement.style.top = "0";
			}

			xTDown = null;
			yTDown = null;
			xTMove = null;
			yTMove = null;

			dragElement.removeEventListener("touchmove", referenceSwipeMove, false);
			dragElement.removeEventListener("touchend", referenceSwipeEnd, false);

		}

		function resizeReference() {
			let newWindowWidth = w.innerWidth || el.clientWidth || g.clientWidth;
			windowWidth = newWindowWidth;
			let draggables = reference.getElementsByClassName("draggable");
			if (windowWidth >= 960) {
				for (let i = 0; i < draggables.length; i++) {
					draggables[i].removeAttribute("style");
				}
			}
		}

		return {
			resizeApi : function() {
				resizeReference();
			}
		}

	})(window, document);




	let ContactModule = (function(window, document, undefined) {

		let w = window,
			d = document,
			el = d.documentElement,
			g = d.getElementsByTagName('body')[0];

		let contactSection = document.getElementById("contact");
		let contactForm = contactSection.getElementsByTagName("form")[0];
		let inputs = contactSection.getElementsByTagName("input");
		let submitButton = contactSection.getElementsByTagName("button")[0];
		let textArea = contactSection.getElementsByTagName("textarea")[0];
		let openContact = document.getElementsByClassName("open-contact")[0];
		let moving = document.getElementsByClassName("moving")[0];

		openContact.addEventListener("click", handleContact);

		function handleContact() {
			let h = moving.offsetHeight;
			let contact = contactSection.getElementsByClassName("contact")[0];
			contact.style.height = h + "px";
			window.setTimeout(function() {
				contact.style.height = "auto";
				moving.style.position = "relative";
			}, 1000);
			openContact.removeEventListener("click", handleContact);
			openContact.classList.add("clicked");
		}

		contactForm.addEventListener("focusout", function(e) {
			let target = e.target || window.target;
			let userInput = target.value;
			if (userInput !== "") {
				target.classList.add("filled");
			} else {
				target.classList.remove("filled");
			}
			isReady();
		});

		function checkInput() {
			let userInput;
			for (let i = 0; i < inputs.length; i++) {
				userInput = inputs[i].value;
				if (userInput !== "") {
					inputs[i].classList.add("filled");
				} else {
					inputs[i].classList.remove("filled");
				}
			}
			userInput = textArea.value;
			if (userInput !== "") {
				textArea.classList.add("filled");
			} else {
				textArea.classList.remove("filled");
			}
		}

		checkInput();

		submitButton.addEventListener("mouseenter", isReady);

		function isReady () {
			let ready = true;
			let regex;
			let errorDiv;
			let userInput;
			for (let i = 0; i < inputs.length; i++) {
				errorDiv = inputs[i].parentNode.getElementsByClassName("error")[0];
				userInput = inputs[i].value;
				if (userInput !== "") {
					if (inputs[i].getAttribute("name") === "name") {
						regex = new RegExp("^[a-zA-ZäÄöÖüÜß ]{2,}$");
					}
					if (inputs[i].getAttribute("name") === "email") {
						regex = new RegExp("^[a-zA-Z_0-9][a-zA-Z_0-9\.]+[a-zA-Z0-9][@][a-zA-Z0-9][a-zA-Z_0-9\.\-]+[a-zA-Z0-9][\.][a-zA-Z]{2,3}$");
					}
					if (inputs[i].getAttribute("name") === "subject") {
						regex = new RegExp("^[0-9a-zA-ZäÄöÖüÜß\;\:\.\, ]{3,}$");
					}
					if (!regex.test(userInput)) {
						ready = false;
						console.log(errorDiv);
						errorDiv.classList.add("visible");
					} else {
						errorDiv.classList.remove("visible");
					}
				} else {
					ready = false;
				}
			}
			errorDiv = textArea.parentNode.getElementsByClassName("error")[0];
			userInput = textArea.value;
			if (userInput !== "") {
				regex = new RegExp("^[0-9a-zA-ZäÄöÖüÜß\;\:\.\,\t\f\e\n\r ]"); /* "^[0-9a-zA-ZäÄöÖüÜß\;\:\.\,\t\f\e\n\r ]{5, 1500}$" */
				if (!regex.test(userInput)) {
					ready = false;
					errorDiv.classList.add("visible");
				} else {
					errorDiv.classList.remove("visible");
				}
			} else {
				ready = false;
			}
			if (ready) {
				submitButton.classList.remove("missing");
				submitButton.classList.add("ready");
			} else {
				submitButton.classList.add("missing");
				submitButton.classList.remove("ready");
			}
		}

		isReady();

		submitButton.addEventListener("click", function (e) {
			if (submitButton.classList.contains("missing")) {
				e.preventDefault();
				alert("Es fehlt noch mindestens eine Eingabe. Bitte vergewissern Sie sich, dass alle Eingabe-Felder einen validen Input enthalten. Unter Umständen sorgen Sonderzeichen für Probleme. Falls Sie Sonderzeichen (z.B. $, %, ´, `, \", oder ähnliches) genutzt haben, entfernen Sie diese bitte.");
			}
		});

	})(window, document);

}


let LoadingModule = (function(window, document, undefined) {

	function stopLoadingAnimation(lc) {
		lc.classList.add("fade-out");
		window.setTimeout(function () {
			lc.style.display = "none";
		}, 1001);
	}

	return {
		stopApi : function (lc) {
			stopLoadingAnimation(lc);
		}
	}

})(window, document);


document.addEventListener("DOMContentLoaded", function() {
	window.setTimeout(function() {
		init(window, document, LoadingModule);
	}, ((Math.random() * 2000) + 500));
});
