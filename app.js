"use strict";

function Creature(species, weight, height, diet){
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.tileWrapper = ['<div class="grid-item">', '</div>'];
}

// Create Dino Constructor
function Dinosaur(species, weight, height, diet, where, when, fact){
    Creature.call(this, species, weight, height, diet);
    this.where = where;
    this.when = when;
    this.fact = fact;
    this.info = fact;

}

Dinosaur.prototype = Object.create(Creature.prototype);

// Create Dino Compare Method 1
Dinosaur.prototype.compare_weight = function(human){
    let diff = Math.abs(this.weight - human.weight);
    if (this.weight > human.weight){
        this.info = this.species +  " weighs " + diff + " lbs more than " + human.name; 

    }else if (this.weight < human.weight){
        this.info = this.species + " weighs " + diff + " lbs less than " + human.name; 
    }else if (this.weight === human.weight) {
        this.info = "Both weighs the same";
    }

};

// Create Dino Compare Method 2
Dinosaur.prototype.compare_height = function(human){
    let diff = Math.abs(this.height - human.height);
    if (this.height > human.height){
        this.info = this.species +  " is " + diff + " inches taller than " + human.name; 

    }else if (this.height < human.height){
        this.info = this.species + " is " + diff + " inches shorter than " + human.name; 
    }else if (this.height === human.height) {
        this.info = "Both heights the same";
    }
};

// Create Dino Compare Method 3
Dinosaur.prototype.compare_diet = function(human){

    if(this.diet.toLowerCase() === human.diet.toLowerCase()){
        this.info = "Same diet with " + human.name + " as " + this.diet
    }else{
        this.info = this.species + " is a " + this.diet;
    }
};

// Generate DOM tile
Dinosaur.prototype.generate_tile = function(){
    let tileStr = this.tileWrapper[0];
    tileStr += '<h3>' + this.species + '</h3>';
    tileStr += '<img src="images/' + this.species.toLowerCase() +'.png" alt=""></img>';
    tileStr += ' <p>' + this.info + '</p>';

    tileStr += this.tileWrapper[1];

    return tileStr;

};


function Human(name, weight, height, diet){
    Creature.call(this, "human", weight, height, diet);
    this.name = name;
}

Human.prototype = Object.create(Creature.prototype);

Human.prototype.generate_tile = function(){
    let tileStr = this.tileWrapper[0];
    tileStr += '<h3>' + this.name + '</h3>';
    tileStr += '<img src="images/human.png" alt=""></img>';
    tileStr += this.tileWrapper[1];
    return tileStr;
};

// On button click, prepare and display infographic
let App = {
    loadDinos: function () {
        let self = this;
        self.animals = [];
        fetch('dino.json')
            .catch(function(err){
                console.error("Error: ", err);
            })        
            .then(function(response){
                return response.json();
            })
            .then(function (data){
                let dinos = data.Dinos;
                dinos.forEach(function (item) {
                // Create Dino Objects
                let dino = new Dinosaur(item.species, item.weight, item.height, item.diet, item.where, item.when, item.fact);
                self.animals.push(dino);

                });
                self.generateInfo();
                self.generateTiles();
            });

    },
    generateInfo: function(){ //generate dino info
        let randomIdx = [];

        while(true){
            let idx = Math.floor(Math.random() * 7); 
            if(randomIdx.includes(idx)){
                continue;
            }else{
                randomIdx.push(idx);
            }

            if(randomIdx.length === 3){
                break;
            }
        }

        this.animals[randomIdx[0]].compare_height(this.human);
        this.animals[randomIdx[1]].compare_weight(this.human);
        this.animals[randomIdx[2]].compare_diet(this.human);

    },
    generateTiles: function () {

    // Generate Tiles for each Dino in Array

    let tiles = "";
    for (let x = 0; x < this.animals.length; x++){ //9x9 tiles
        tiles += this.animals[x].generate_tile();
        //insert human card on center
        if (x === 3){
            tiles += this.human.generate_tile();
        }
    }
    // Add tiles to DOM
    let grid = document.getElementById("grid");
    grid.innerHTML = tiles;
    grid.classList.remove("show");
    grid.classList.remove("hide");
    // Remove form from screen
        let dinocompare = document.getElementById('dino-compare');
        dinocompare.classList.add("hide");
        setTimeout(function(){
            dinocompare.style.display = "none";
        },400);
    },
    btnClick: function(){

        let name = document.getElementById('name').value;
        let feet = parseFloat(document.getElementById('feet').value);
        let inches = parseFloat(document.getElementById('inches').value);
        let weight = parseFloat(document.getElementById('weight').value);
        let diet = document.getElementById('diet').value;
        //super basic validation
        if(name === "" || feet === "" || inches === "" || weight === "" || diet === ""){
            alert("Incomplete fields");
            return false;
        }
        let height = (feet * 12) + inches;

        // Create Human Object
        this.human = new Human(name, weight, height, diet);

        this.loadDinos();

    },
    init: function () {
        this.animals = [];
    }
}



App.init();


// Use IIFE to get human data from form
let btn = document.getElementById('btn');
btn.addEventListener("click", function (){
    App.btnClick();

});