//Create variables here
var dog, happydog;
var foods,foodStock;
var database;
var Dog;
var feedFood,addFood, fedTime, lastFed;
var FOOD;
var Bedroom, Garden, Washroom;
var milk2;
function preload()
{
  dog = loadImage("images/Dog.png");
  happydog = loadImage("images/happydog.png");
  Bedroom = loadImage("images/virtual pet images/Bed Room.png");
  Garden = loadImage("images/virtual pet images/Garden.png");
  Washroom = loadImage("images/virtual pet images/Wash Room.png")
  milk2 = loadImage("images/Milk.png")
}


function setup() {
  database = firebase.database();
	createCanvas(500,500);

readState = database.ref("gameState");
readState.on("value",function(data){
  gameState = data.val();
});

  FOOD = new Food();

  foodStock = database.ref("food");
  foodStock.on("value",readStock);

  Dog = createSprite(250,380,0,0);
  Dog.addImage(dog)
  Dog.scale=0.3;

  feedFood=createButton("Feed the dog");
  feedFood.position(750,200);
  feedFood.mousePressed(feedDog);
  addFood=createButton("Add Food");
  addFood.position(750,220);
  addFood.mousePressed(addFoods);

  
}


function draw() {  
background(46,139,87)
FOOD.display();

fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
  lastFed=data.val();


  if(foods == 0){
Dog.addImage(happydog)
milk2.visible = false;
  }
else{
  Dog.addImage(dog)
milk2.visible = true;
}

if(gameState === 1){
Dog.addImage(happydog);
Dog.scale= 0.175;
Dog.y = 250;
}



if(gameState === 2){
  Dog.addImage(dog);
Dog.scale= 0.175;
milk2.visible = false;
Dog.y = 250;
}

var Bath = createButton("I want to take a BATH");
Bath.position(580,125);
if(Bath.mousePressed(function(){
gameState = 3;
database.ref("/").update({
  "gameState":gameState
})
}))
if(gameState === 3){
  Dog.addImage(Washroom)
  Dog.scale = 1;
  milk2.visible = false;
}


var Sleep = createButton("I am very TIRED");
Sleep.position(710,125);
if(Sleep.mousePressed(function(){
gameState = 4;
database.ref("/").update({
  "gameState":gameState
})
}))
if(gameState === 4){
  Dog.addImage(Bedroom)
  Dog.scale = 1;
  milk2.visible = false;
}


var Playg = createButton("LETS PLAY!!!!!");
Playg.position(580,125);
if(Playg.mousePressed(function(){
gameState = 3;
database.ref("/").update({
  "gameState":gameState
})
}))
if(gameState === 5){
Dog.addImage(Garden);
Dog.scale = 1;
milk2.visible = false;
}



  if(gameState!="Hungry"){
feedFood.hide();
addFood.hide();
Dog.remove();
  }else{
    feedFood.show();
    addFood.show();
Dog.addImage(dog);
  }




});
fill(255,255,254);
textSize(15);
if(lastFed>=12){
  text("Last Feed : "+ lastFed%12 + " PM", 350,30);
 }else if(lastFed==0){
   text("Last Feed : 12 AM",350,30);
 }else{
   text("Last Feed : "+ lastFed + " AM", 350,30);
 }

  drawSprites();
  textSize(20)
fill("white");
stroke("black");
text("Food:"+foods,230,100);
text("Note: Press up arrow to feed the dog milk!",75,50)


currentTime = hour();
if(currentTime==(lastFed+1)){
update("playing")
Dog.garden()
}
else if(currentTime==(lastFed+2)){
  update("sleeping")
  Dog.bedroom()
}else if(currentTime==(lastFed+2) && currentTime<=(lastFed+4)){
  update("bathing")
  Dog.washroom()
}else{
  update("Hungry")
  Dog.display();
}
}
function readStock(data){
foods=data.val()
FOOD.updateFoodStock(foods);
}
function writeStock(x){
database.ref("/").update({
  food:x
})
}

function feedDog(){
  Dog.addImage(happydog);
  FOOD.updateFoodStock(FOOD.getFoodStock()-1);
  database.ref('/').update({
    food:FOOD.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  foods++;
  database.ref('/').update({
    food:foods
  })
}
function update(state){
database.ref("/").update({
  gameState: state
})
}
