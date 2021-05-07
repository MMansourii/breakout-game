const rules =document.getElementById('rules');
const rulesBtn =document.getElementById('rules-btn');
const closeBtn =document.getElementById('close-btn');
const canvas =document.getElementById('canvas');


const ctx = canvas.getContext('2d');
let score = 0;

const brickRowCount=9;
const brickColumnCount=5;

// Create ball propertis
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size:10,
    speed: 4,
    dx:4,
    dy:-4
};

//Craete paddle propertis
const paddle = {
    x:canvas.width /2 -40,
    y:canvas.height - 20,
    w:80,
    h:10,
    speed:8,
    dx:0
};

//Create bricks properity
const brickInfo ={
    w:70,
    h:20,
    padding:10,
    offsetY:60,
    offsetX:45,
    visible: true
}
//put brick in array
let bricks =[];
for(let i =0 ; i < brickRowCount; i++){
    bricks[i] = [];
    for(let j =0; j < brickColumnCount ; j++){
        const x = i *(brickInfo.w + brickInfo.padding )+  brickInfo.offsetX;
        const y = j *(brickInfo.h +brickInfo.padding )+   brickInfo.offsetY;
        bricks[i][j]= {x,y, ...brickInfo};
    }
}
console.log(bricks);
//draw all of bricks 
function drawBricks(){
    bricks.forEach( column => {
        column.forEach( brick =>{
                ctx.beginPath();
                ctx.rect(brick.x, brick.y , brick.w ,brick.h);
                ctx.fillStyle=brick.visible ? 'tomato' : 'transparent';
                ctx.fill();
                ctx.closePath();
        });
    });
}

//draw score
function drawScore(){
    ctx.font = ' 20px Arial';
    ctx.fillText(`Score : ${score}` , canvas.width -100 , 30);
}

//Draw paddle
function drawPaddle(){
    ctx.beginPath()
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

//Draw ball on canavs
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.size,0 , Math.PI*2);
    ctx.fillStyle = '#0095dd';
    ctx.fill()
    ctx.closePath();
}

//draw Paddle And Ball
function draw(){
    //clear canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);
drawPaddle();
drawBall();
drawScore();
drawBricks();
}
//seting the movements
function paddleMove(){
    paddle.x   += paddle.dx;

    //set wall for keeping paddle in canavs
    if(paddle.x + paddle.w > canvas.width){
        paddle.x= canvas.width - paddle.w;
    }

    if (paddle.x < 0){
        paddle.x = 0;
    }
}
//Ball movement 
function ballMove(){
    ball.x += ball.dx ;
    ball.y += ball.dy ;

    //setting wall colission on X
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0 ){
        ball.dx *=-1;
    }

    //setting wall colission on Y
    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0 ){
        ball.dy *=-1;
    }
    //paddle colission 
    if(ball.x - ball.size > paddle.x &&
        ball.x +ball.size < paddle.x + paddle.w &&
        ball.y +ball.size > paddle.y
         ){
            ball.dy = -ball.speed ;
         }

         //bricks collision 
         bricks.forEach(column => {
             column.forEach( brick =>{
                if (brick.visible) {
                    if (
                      ball.x - ball.size > brick.x && // left brick side check
                      ball.x + ball.size < brick.x + brick.w && // right brick side check
                      ball.y + ball.size > brick.y && // top brick side check
                      ball.y - ball.size < brick.y + brick.h // bottom brick side check
                    ) {
                      ball.dy *= -1;
                      brick.visible = false ;

                      increaseScore();
                    }
                  }
             });
         });

    //if we hit the bottom of the canvas
    if(ball.y +ball.size > canvas.height){
        showAllBricks();
        score = 0; 
    }

}

//increasing the store 
function increaseScore(){
    score ++;

    if(score % (brickRowCount * brickRowCount) === 0){
        showAllBricks();
    }
}

//Show and draw allo of the bricks 
function showAllBricks(){
    bricks.forEach( column => {
        column.forEach( brick => brick.visible = true);
    });
}
//init drawing
function update(){
    paddleMove();
    ballMove();
    draw();
    requestAnimationFrame(update);
}
update();

//movement functional orders 
function keyDown(event){
    if (event.key === 'Right' || event.key === 'ArrowRight'){
        paddle.dx =  paddle.speed;

    }else if (event.key === 'Left' || event.key === 'ArrowLeft'){
        paddle.dx = -paddle.speed;
    }
}
function keyUp(event){
    if 
    (event.key === 'Right' || 
    event.key === 'ArrowRight' ||
    event.key === 'Left' || 
    event.key === 'ArrowLeft'
    ){
        paddle.dx = 0 ;
    }
}

//Rules and close button event
rulesBtn.addEventListener('click',() => 
rules.classList.add('show'));

closeBtn.addEventListener('click', ()=> 
rules.classList.remove('show'));

//movement event
document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);