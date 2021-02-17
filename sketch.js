p5.disableFriendlyErrors=true;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var score;
var state="play";

var die,jump,checkpoint;

var gameover,restart,gameoverImage,restartImage;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  ob1=loadImage("obstacle1.png");
  ob2=loadImage("obstacle2.png");
  ob3=loadImage("obstacle3.png");
  ob4=loadImage("obstacle4.png");
  ob5=loadImage("obstacle5.png");
  ob6=loadImage("obstacle6.png");
  
  gameoverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
  
  jump=loadSound("jump.mp3");
  die=loadSound("die.mp3");
  checkpoint=loadSound("checkPoint.mp3");
 
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collide",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-40,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(width/2,height-30,width,10); 
  invisibleGround.visible = false;
  
  obstacleGroup=new Group();
  cloudGroup=new Group();
  
  gameover=createSprite(width/2,height/2-50,10,10);
  gameover.addImage("over",gameoverImg);
  gameover.scale=0.5;

  restart=createSprite(width/2,height/2,10,10);
  restart.addImage("restart",restartImg);
  restart.scale=0.5;
  
  /*setCollider("rectangle")
  setCollider("rectangle", offsetX, offsetY, width, height)
  setCollider("circle")
  setCollider("circle", offsetX, offsetY, radius)*/
   trex.setCollider("circle",0,0,40);
  //AI
 // trex.setCollider("rectangle",0,0,40, trex.height);
  trex.debug=false;
  
  score=0;
  
}

function draw() {
  background(180);
  
  text("Score:" + score,width-100,50);
  
  /*text("gamestate:"+ state,300,50);
  console.log("gamestate:",state);*/
  
  if(state==="play"){
    ground.velocityX = -(4+3*score/100);
    score=score+Math.round(getFrameRate()/60);
    
    restart.visible=false;
    gameover.visible=false;
    
   /* if(score>0 && score%100===0){
      checkpoint.play();
    }*/
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if((touches.length>0 || keyDown("space")) && trex.y>=height-85) {
      trex.velocityY = -10;
      jump.play();
      touches=[];
    }
    
    trex.velocityY = trex.velocityY + 0.8;
    
    spawnClouds();
  
    spawnObstacles();
    if(obstacleGroup.isTouching(trex)){
      //AI
     /* trex.velocityY=-15;
      jump.play();*/
      state="end";
      die.play();
    }
  }
  else if(state==="end"){
    ground.velocityX = 0;
    
    trex.velocityY=0;
    trex.changeAnimation("collide",trex_collided);
    
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    
    restart.visible=true;
    gameover.visible=true;
    
    if(touches.length>0 || mousePressedOver(restart)) {      
      reset();
      touches=[];
    }
  }

  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  state="play";  
  
  restart.visible=false;
  gameover.visible=false;
  
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score=0;
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(width,height/4,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(50,150))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    
    cloud.lifetime=width/3;
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    cloudGroup.add(cloud);
    }
}

function spawnObstacles(){
  if(frameCount%60===0){
    var obstacle=createSprite(width,height-50,10,40);
    obstacle.velocityX=-(6+score/100);
    
    var rand=Math.round(random(1,6));
    switch(rand){
      case 1:obstacle.addImage(ob1);
            break;
      case 2:obstacle.addImage(ob2);
            break;
      case 3:obstacle.addImage(ob3);
            break;
      case 4:obstacle.addImage(ob4);
            break;
      case 5:obstacle.addImage(ob5);
            break;
      case 6:obstacle.addImage(ob6);
            break;    
      default:break;
      
    }
    obstacle.scale=0.5;
    obstacle.lifetime=width/3;
    obstacleGroup.add(obstacle);
  }
  
}