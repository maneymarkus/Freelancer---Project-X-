function init(window, document, undefined) {

    let CanvasModuleMinigame = (function(window, document, undefined) {

        let canvas = document.getElementById("canvas");
        let stats = document.getElementById("stats");

        let animationReference;
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
            window.setInterval(createFood, 1000);
            render();
        }

        function stopAnimation() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            user = undefined;
            x = canvas.width / 2;
            y = canvas.height / 2;
            cancelAnimationFrame(animationReference);
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

        let canvas = document.getElementById("canvas");

        let x, y;

        CanvasModuleMinigame.startApi();

        canvas.addEventListener("mousemove", function(e) {
            let rect = canvas.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        });
        canvas.addEventListener("touchmove", function(e) {
            e.preventDefault();
            let touch = e.touches[0] || e.changedTouches[0];
            let rect = canvas.getBoundingClientRect();
            x = touch.pageX - rect.left;
            y = touch.pageY - rect.top;
        });

        let keyDown = function(e) {
            e.preventDefault();
            CanvasModuleMinigame.keyApi(e);
        };

        let keyUp = function(e) {
            e.preventDefault();
            CanvasModuleMinigame.keyApi(e);
        };

        canvas.addEventListener("click", addKeyListener);
        document.addEventListener("click", function (e) {
            let target = e.target || window.target;
            if (target !== canvas) {
                removeKeyListener();
            }
        });


        function addKeyListener() {
            document.addEventListener("keydown", keyDown);
            document.addEventListener("keyup", keyUp);
        }

        function removeKeyListener() {
            document.removeEventListener("keydown", keyDown, false);
            document.removeEventListener("keyup", keyUp, false);
        }

        return {
            removeKeyListenerApi : function () {
                removeKeyListener();
            }
        }

    })(window, document);

}

document.addEventListener("DOMContentLoaded", function() {
    init(window, document);
});