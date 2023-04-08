// Making constant variable for canvas
const canvas = document.querySelector('canvas');

// Setting canvas to 2d
const c = canvas.getContext('2d');

// Setting canvas size (Game size)
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.2

// Used for showing background IMG------------------------------------------------------------------------------------------------------------------------------------

class Characters {
    constructor({position, imageSrc, scale = 1, frame = 1 , timeframe = 15}){
        this.position = position;
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.frame = frame
        this.framecount = 0
        this.count = 0
        this.timeframe = timeframe
    }

    draw(){
        c.drawImage(
            this.image,

            this.framecount * (this.image.width / this.frame),
            0,this.image.width/this.frame , this.image.height,
            
            this.position.x, this.position.y, (this.image.width/this.frame) * this.scale, this.image.height * this.scale)
    }

    update(){
        this.draw()
        this.count++
        if (this.count % this.timeframe == 0){
            if (this.framecount<this.frame-1){
                this.framecount++
            }else{
                this.framecount=0
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------

class Sprite {
    constructor({position, velocity, color = 'red', offset = {x:0, y:0}, imageSrc, scale = 1, frame = 1 , timeframe = 15, 
    framecount = 0, frameheight = 1, framecountheight = 0, xx = 1, yy = 1, LastKey, difference = {x:0,y:0} }){
        this.position = position;
        this.velocity = velocity;
        this.width = 50
        this.height = 150
        this.Attackbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            difference:{
                x: difference.x,
                y: difference.y
            },
            width: 100, 
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health=100
        this.offset=offset

        //Variables used in drawing characters in Canvas
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.frame = frame // ada berapa X
        this.framecount = framecount // Berapa udh ke X
        this.frameheight = frameheight // ada berapa Y
        this.framecountheight  = framecountheight // Udah berapa Y
        this.count = 0 // buat itung berapa looping
        this.timeframe = timeframe // itung berapa kali looping buat 1 ganti
        this.tempx = framecount // Simpen awal dari x
        this.tempy = framecountheight
        this.framex = xx
        this.framey = yy

        //JumpCount is used to make sure the max jump is 2 and the other variable used to make sure that the animation frame is done. Therefore when it is "True" it means the frame still going on
        this.jumpCount=0
        this.check_attack=false
        this.check_jump=false
        this.check_hit=false

        // "Check" variable is used to make sure that the same animation frame doesn't get called for the same action.
        this.check=0

        this.LastKey = LastKey
    }

    draw(){
        c.drawImage(
            this.image,

            //Cropping
            this.framecount * (this.image.width / this.frame), // X
            this.framecountheight * (this.image.height/ this.frameheight), // Y
            this.image.width/this.frame , 
            this.image.height/this.frameheight,
            
            //offset
            this.position.x-this.offset.x, 
            this.position.y-this.offset.y, 
            (this.image.width/this.frame) * this.scale, 
            (this.image.height/this.frameheight) * this.scale)
    }

    update(){
        this.draw()

        //Check apakah attack atau Jump sudah selesai (Khusus Buat Player)
        if((this.check_attack==true || this.check_jump==true || this.check_hit==true)
        &&(this.framecount==this.framex-1 && this.framecountheight==this.framey-1)){
            player.offset.x=50
            this.check_attack=false
            this.check_jump=false
            this.check_hit=false
        }

        //Attack box position [Following Characters Position]
        this.Attackbox.position.x = this.position.x + this.Attackbox.difference.x
        this.Attackbox.position.y = this.position.y + 30

        // Player Y Axis Movement
        this.position.y = this.position.y + this.velocity.y;
        //Checking the floor position
        if (this.position.y + this.height + this.velocity.y >= canvas.height-100){
            this.velocity.y=0
            this.jumpCount=0
        }
        //Checking the left platform
        else if(this.check_jump==false
            &&this.position.y + this.height + this.velocity.y >= canvas.height-293
            && this.position.y + this.height + this.velocity.y <= canvas.height-283
            && this.position.x <= 50){
                this.velocity.y=0
                this.jumpCount=0
        }
        // Platform on the middle
        else if(this.check_jump==false
            &&this.position.y + this.height + this.velocity.y >= canvas.height-287
            && this.position.y + this.height + this.velocity.y <= canvas.height-277
            && this.position.x <=570
            && this.position.x >=350){
                this.velocity.y=0
                this.jumpCount=0
        }
        // Platform on the right
        else if(this.check_jump==false
            &&this.position.y + this.height + this.velocity.y >= canvas.height-320
            && this.position.y + this.height + this.velocity.y <= canvas.height-310
            && this.position.x <=835
            && this.position.x >=610){
                this.velocity.y=0
                this.jumpCount=0
        }
        // Character in mid air then velocity of Y axis will be gradually added by gravity
        else{ 
            this.velocity.y += gravity
        }

        // Player X axis movement
        if (this.position.x + this.width + this.velocity.x >= canvas.width || this.position.x + this.velocity.x <= 0){ // Check tembok kiri & kanan
            this.velocity.x=0
        }else{
            this.position.x += this.velocity.x
        }

        // Count variable is used to count so the frame doesn't run every 1 milisecond but will be run if count%[int] = 0. So we can conclude that count is used to delay the frame changes
        this.count++

        // Looping for the frame change OR Looping for running the animation
        if (this.count % this.timeframe == 0){
            if(this.framecount<this.tempx && this.framecountheight<this.tempy){
                this.framecountheight=this.tempy
                this.framecount=this.tempx
            }else if (this.framecount<this.frame-1 && this.framecountheight<this.framey-1){
                this.framecount++
            }else{
                if(this.framecountheight==this.framey-1){
                    if (this.framecount<this.framex-1){
                        this.framecount++
                    }else{
                        this.framecountheight=this.tempy
                        this.framecount=this.tempx
                    }
                }else if (this.framecount==this.frame-1){
                    this.framecountheight++
                    this.framecount=0
                }else{
                    this.framecountheight=this.tempy
                    this.framecount=this.tempx
                }
            }
        }

    }
    attack(){
        console.log(this.framecount, this.tempx, this.framecountheight, this.tempy)
        this.check_attack = true
        this.check=5
        this.isAttacking = true
        setTimeout(() =>{
            this.isAttacking=false
        }, 100)
    }
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------

const background_img = new Characters({
    position : {
        x:0,
        y:0
    }, 
    imageSrc: 'img/environment.png'
})

const player = new Sprite({
    position : {x : 0, y : 0},
    velocity : {x : 0, y : 0}, 
    offset :{x: 50  , y: -60},
    color : "blue",     
    imageSrc : 'img/Warrior_Sheet-Effect1.png',
    scale: 2.8,
    frame: 6, // The length of the frame in X position
    timeframe: 20, 
    framecount: 0, // The start of frame in X position [Start From 0]
    frameheight : 17, // The height of the frame in Y position
    framecountheight : 0, // The start of frame in Y position [Start From 0]
    xx: 6, // The end of the frame animation in X position [Start From 1]
    yy: 1, // The end of the frame animation in Y position [Start From 1]
    LastKey : 'd',
    difference: {x:50,y:0},
})
player.draw()
console.log(player)

const enemy = new Sprite({
    position : {x : 974, y : 0},
    velocity : {x : 0, y : 0},
    offset :{x: 380, y: 160},
    color : "red",
    imageSrc : 'img/Enemy111.png',
    scale: 2.7,
    frame: 30, // The length of the frame in X position
    timeframe: 20, 
    framecount: 0, // The start of frame in X position [Start From 0]
    frameheight : 13, // The height of the frame in Y position
    framecountheight : 5, // The start of frame in Y position [Start From 0]
    xx: 8, // The end of the frame animation in X position [Start From 1]
    yy: 6, // The end of the frame animation in Y position [Start From 1]
    LastKey : 'ArrowLeft',
    difference: {x:-100,y:0},
})
enemy.draw()

const keys = {
    a: {
        pressed: false
    }, 
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }, 
    ArrowRight: {
        pressed: false
    }, 
    ArrowUp: {
        pressed: false
    }
}

function winner(player, enemy, timerId){
    clearTimeout(timerId)
    document.querySelector('#displaytext').style.display = 'flex'
    document.querySelector('#Start').style.display = 'flex'
    if (player.health==enemy.health){
        document.querySelector('#displaytext').innerHTML = 'Tie'
    }else if (player.health>enemy.health){
        document.querySelector('#displaytext').innerHTML = 'Player 1 Win'
    }else if (player.health<enemy.health){
        document.querySelector('#displaytext').innerHTML = 'Player 2 Win'
    }
}
let Timer_status = "Play"
let game_status = "Playing"
let timer = 60
let timerId
function decreasetimer(){
    if (timer>0 && game_status == "Playing" && Timer_status == "Play"){
        timerId = setTimeout(decreasetimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer==0){
        winner(player, enemy, timerId)
    }
}

animate()
setTimeout(() =>{
    Timer_status = "Pause"
    game_status = "Done"
}, 1000)
function animate(){
    if(timer!=0 && game_status != "Done" && Timer_status != "Pause"){
        window.requestAnimationFrame(animate)
    }   
    background_img.update()
    enemy.update()
    player.update()

    //Player Movement conditions
    player.velocity.x = 0 // Player idle velocity set to ZERO
    if(player.check_attack==false && player.check_jump==false && player.check_hit==false){
        if(keys.a.pressed == true){
            // Run velocity or Movement Speed
            player.velocity.x = -1
            if(player.check!=1 && player.velocity.y == 0){
                // Run animation
                player.framecount=player.tempx = 0
                player.framecountheight=player.tempy = 9
                player.framex = 6
                player.framey = 10
                player.check=1
            }
        }else if(keys.d.pressed == true){
            // Run velocity or Movement Speed
            player.velocity.x = 1
            if(player.check!=2 && player.velocity.y == 0){
                //Run animation
                player.framecount=player.tempx = 1
                player.framecountheight=player.tempy = 1
                player.framex = 2
                player.framey = 3
                player.check=2
            }
        }else{
            if (player.check!=3 && player.velocity.y == 0){
                console.log(player.check)
                // Idle Movement Animation
                if(player.LastKey == 'd'){
                    player.framecount=player.tempx = 0 
                    player.framecountheight=player.tempy = 0
                    player.framex = 6 
                    player.framey = 1
                }else if (player.LastKey=='a'){
                    player.framecount=player.tempx = 0 
                    player.framecountheight=player.tempy = 10
                    player.framex = 6 
                    player.framey = 11 
                }
                player.check=3
            }
        }
    }
    // Checking if Player is mid air. If Player mid air then run falling animation
    if(player.check_attack==false && player.check_jump==false){
        // Checking if player falling
        if (player.velocity.y!=0){
            if(player.check!=6){
                // Falling animation
                if (player.LastKey=='d'){
                    player.framecount=player.tempx = 3
                    player.framecountheight=player.tempy = 7
                    player.framex = 1
                    player.framey = 8
                }else if(player.LastKey=='a'){
                    player.framecount=player.tempx = 0
                    player.framecountheight=player.tempy = 14
                    player.framex = 3
                    player.framey = 15
                }
                player.check=6
            }
        }
    }

    //Enemy movement
    enemy.velocity.x = 0
    if(enemy.check_attack==false && enemy.check_jump==false && enemy.check_hit==false){
        if(keys.ArrowLeft.pressed == true){
            // Run velocity or Movement Speed
            enemy.velocity.x = -1
            if(enemy.check!=1 && enemy.velocity.y == 0){
                // Run animation
                enemy.framecount=enemy.tempx = 3
                enemy.framecountheight=enemy.tempy = 2
                enemy.framex = 11
                enemy.framey = 3
                enemy.check=1
            }
        }else if(keys.ArrowRight.pressed == true){
            // Run velocity or Movement Speed
            enemy.velocity.x = 1
            if(enemy.check!=2 && enemy.velocity.y == 0){
                //Run animation
                enemy.framecount=enemy.tempx = 0
                enemy.framecountheight=enemy.tempy = 1
                enemy.framex = 8
                enemy.framey = 2
                enemy.check=2
            }
        }else{
            if (enemy.check!=3 && enemy.velocity.y == 0){
                // Idle Movement Animation
                if (enemy.LastKey == 'ArrowLeft'){
                    enemy.framecount=enemy.tempx = 0 
                    enemy.framecountheight=enemy.tempy = 5
                    enemy.framex = 8 
                    enemy.framey = 6 
                }else if (enemy.LastKey == 'ArrowRight'){
                    enemy.framecount=enemy.tempx = 0 
                    enemy.framecountheight=enemy.tempy = 0 
                    enemy.framex = 8 
                    enemy.framey = 1 
                }
                enemy.check=3
            }
        }
    }
    // Checking if Enemy is mid air. If enemy mid air then run falling animation
    if(enemy.check_attack==false && enemy.check_jump==false){
        // Checking if enemy falling
        if (enemy.velocity.y!=0){
            if(enemy.check!=6){
                // Falling animation
                enemy.framecount=enemy.tempx = 0
                enemy.framecountheight=enemy.tempy = 3
                enemy.framex = 3
                enemy.framey = 4
                enemy.check=6
            }
        }
    }

    // Player Attacking Enemy [Detecting collision]
    if (player.Attackbox.position.x+player.Attackbox.width>=enemy.position.x 
        && player.Attackbox.position.x<=enemy.position.x+enemy.width
        && player.Attackbox.position.y + player.Attackbox.height>= enemy.position.y
        &&player.Attackbox.position.y <= enemy.position.y + enemy.height
        &&player.isAttacking){

        // Animation Enemy Get Hit By Player
        enemy.check=7
        if (enemy.LastKey=='ArrowLeft'){
            enemy.framecount=enemy.tempx = 0
            enemy.framecountheight=enemy.tempy = 11
            enemy.framex = 6
            enemy.framey = 12
        }else if (enemy.LastKey == 'ArrowRight'){
            enemy.framecount=enemy.tempx = 0
            enemy.framecountheight=enemy.tempy = 12
            enemy.framex = 6
            enemy.framey = 13
        }
        enemy.check_hit = true // While true it means the 'Taking damage frame' is not done animated
        
        // Decrease Enemy Health
        enemy.health-=10
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        player.isAttacking = false
    }

    // Enemy Attacking Player [Detecting collision]
    if (enemy.Attackbox.position.x+enemy.Attackbox.width>=player.position.x 
        &&enemy.Attackbox.position.x<=player.position.x+player.width
        &&enemy.Attackbox.position.y + enemy.Attackbox.height>= player.position.y
        &&enemy.Attackbox.position.y <= player.position.y + player.height
        &&enemy.isAttacking){

        // Animation Player Get Hit By Enemy
        player.check=7
        player.framecount=player.tempx = 1
        player.framecountheight=player.tempy = 6
        player.framex = 5
        player.framey = 7
        player.check_hit = true // While true it means the 'Taking damage frame' is not done animated
        
        // Decrease Player Health
        player.health-=10
        document.querySelector('#playerHealth').style.width = player.health + '%'
        enemy.isAttacking = false
    }

    // Checking Health
    if (enemy.health<=0 || player.health <= 0){
        winner(player, enemy, timerId)
        setTimeout(() =>{
            game_status = "Done"
        }, 1000)
    }
}

// When user push key DOWN
window.addEventListener('keydown', (event) => {
    switch (event.key){
        // First Player
        case 'd':
            keys.d.pressed = true;
            player.Attackbox.difference.x = 40
            player.LastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true;
            player.Attackbox.difference.x = -90
            player.LastKey = 'a'
            break
        case 'w':
            if (player.jumpCount<2){

                // Jump Height
                player.velocity.y = -8

                // Jump Animation
                if (player.LastKey == 'd'){
                    player.framecount=player.tempx = 5
                    player.framecountheight=player.tempy = 6
                    player.framex = 2
                    player.framey = 8
                }else if (player.LastKey == 'a'){
                    player.framecount=player.tempx = 3
                    player.framecountheight=player.tempy = 14
                    player.framex = 6
                    player.framey = 15
                }
                player.check=4
                player.check_jump = true
                player.jumpCount++
            }
            break
        case ' ':
            //Attack animation
            if (player.check_attack==false){
                if (player.LastKey == 'd'){
                    player.framecount =player.tempx = 1
                    player.framecountheight =player.tempy = 3
                    player.framex = 2
                    player.framey = 5
                }else if(player.LastKey=='a'){
                    player.offset.x = 76
                    player.framecount =player.tempx = 0
                    player.framecountheight =player.tempy = 15
                    player.framex = 2
                    player.framey = 17
                }
                player.attack()
            }
            break
        
        // Enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.Attackbox.difference.x = 40
            enemy.LastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.Attackbox.difference.x = -90
            enemy.LastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            if (enemy.jumpCount<2){

                // Jump Height
                enemy.velocity.y = -8

                // Jump Animation
                enemy.check=4
                enemy.framecount=enemy.tempx = 0
                enemy.framecountheight=enemy.tempy = 2
                enemy.framex = 3
                enemy.framey = 3
                enemy.check_jump = true
                enemy.jumpCount++
            }
            break
        case 'Enter':
            //Attack animation
            if (enemy.check_attack==false){
                if (enemy.LastKey=="ArrowLeft"){
                    enemy.framecount = enemy.tempx = 0
                    enemy.framecountheight = enemy.tempy = 7
                    enemy.framex = 8
                    enemy.framey = 8
                }else if(enemy.LastKey == "ArrowRight"){
                    enemy.framecount = enemy.tempx = 0
                    enemy.framecountheight = enemy.tempy = 6
                    enemy.framex = 8
                    enemy.framey = 7
                }
                enemy.attack()
            }
    }
    console.log(event.key)
})

// If the user lift key UP
window.addEventListener('keyup', (event) => {
    switch (event.key){
        // First Player
        case 'd':
            keys.d.pressed = false;
            break
        case 'a':
            keys.a.pressed = false;
            break
        case 'w':
            keys.w.pressed = false;
            break
        
        // Enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break
    }
    console.log(event.key)
})

// Make arrow key doesnt scroll the web page
function disableArrowKeys(event) {
    // Array of key codes for arrow keys
    var arrowKeys = [37, 38, 39, 40];
    
    // Check if the pressed key is an arrow key
    if (arrowKeys.indexOf(event.keyCode) > -1) {
      event.preventDefault(); // Prevent default behavior
    }
}

document.addEventListener("keydown", disableArrowKeys);



// Hide Game Div
function HideGame() {
    var GameDiv = document.getElementById("Game"); // Get the div element by ID
    var HowToPlayDiv = document.getElementById("Howtoplay"); // Get the div element by ID
    if (GameDiv.style.display != "none") {
        GameDiv.style.display = "none"; // Hide the div if it's displayed
        Timer_status = "Pause"
    }
    if(HowToPlayDiv.style.display == "none"){
        HowToPlayDiv.style.display = "inline-block"; // Display the game if it is hide
    }
}


// Display Game Div
function DisplayGame() {
    var GameDiv = document.getElementById("Game"); // Get the div element by ID
    var HowToPlayDiv = document.getElementById("Howtoplay"); // Get the div element by ID
    if(GameDiv.style.display == "none"){
        GameDiv.style.display = "inline-block"; // Display the game if it is hide
        if(game_status == "Playing"){
            Timer_status = "Play"
            animate()
            decreasetimer()
        }
    }
    if(HowToPlayDiv.style.display != "none"){ // Hide the div if it's displayed
        HowToPlayDiv.style.display = "none"
    }
}

function StartGame(){
    document.querySelector('#Start').style.display = 'none'
    document.querySelector('#displaytext').style.display = 'none'

    //Reset Game Status && Timer
    timer=60
    Timer_status = "Play"
    game_status = "Playing"

    // Reset Enemy Health & Position
    enemy.health=100
    enemy.position.x=974
    enemy.position.y=0
    enemy.check_attack=false
    enemy.check_hit=false
    enemy.check_jump=false
    enemy.check=-1
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'

    //Reset Player Health & Position
    player.health=100
    player.position.x=0
    player.position.y=0
    player.check_attack=false
    player.check_hit=false
    player.check_jump=false
    player.check=-1
    document.querySelector('#playerHealth').style.width = player.health + '%'

    decreasetimer()
    animate()
}