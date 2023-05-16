//declaring semi-constants
let canvas = document.getElementById("canvas");
let c = canvas.getContext('2d');
let nextcanvas = document.getElementById("nextcanvas");
let btx = nextcanvas.getContext('2d');

///////////////Declaration of useful variables//////////////
let degree = 0;
let backgroundPixelNumber = 0;
let inactive = [];
let cell = [];
let layers = 0;
let points = 0;
let over = false;
let ghost = [];
let held = 0;
let updated = false;

canvas.width = window.innerWidth * 0.447;
nextcanvas.width = window.innerWidth * 0.18;

//settings
    //horizontal cell count
    const width = 19;
    //vertical cell count
    const height = 20;

    //Cell lengths of the different canvases
    let length = canvas.width / width;
    let smollength = nextcanvas.width / 7;
    
    //Cell heights of the different canvases (Useful variable)
    canvas.height = length * height;
    nextcanvas.height = nextcanvas.width;
///////////////////////////////////////////////////////////

//Retrieve scoreboard from local storage
let player = [];
player[0] = localStorage.getItem("player1");
player[1] = localStorage.getItem("player2");
player[2] = localStorage.getItem("player3");
player[3] = localStorage.getItem("player4");
player[4] = localStorage.getItem("player5");

let score = [];
for (i=0; i<5; i++) {
    if (isNaN(Number(localStorage.getItem('score' + i.toString()))) == true) {
        score[i] = 0;
    }
    else {
        score[i] = Number(localStorage.getItem('score' + i.toString()));
    }
}

for (i=1; i<6; i++) {
    document.getElementById("player" + i.toString()).innerHTML = (i.toString() + '. ' + player[i-1]);
    document.getElementById("score" + i.toString()).innerHTML = score[i-1];
}

//Resetting the current game stats
document.getElementById("layers").innerHTML = layers;
document.getElementById("points").innerHTML = points;

//names of pieces that look like particular letters
let pieces = ['f','-f', 'i', 'l', '-l', 'n', '-n', 'p', '-p', 't', 'u', 'v', '-v', 'w', 'x', 'y', '-y', 'z', '-z', 'b', '-b'];
let colors = ['#bf616a', '#d08770', '#ebcb8b', '#a3be8c', '#b48ead', '#81a1c1'];


//Generate current piece
let item = pieces[Math.floor(Math.random()*pieces.length)];
let current = new Current(item);

//Generate the next piece
item = pieces[Math.floor(Math.random()*pieces.length)];
let next = new Current(item);
draw(nextcanvas.width / 2 - smollength, nextcanvas.width / 2 - smollength, next.item, next.turned, next.color, smollength, btx);

function refresh() {
    //Clear Canvas
    c.clearRect(0, 0, innerWidth, innerHeight);
    //Draw The main enlargening blob
    for (i=0; i < inactive.length; i++) {
        drawSquare(inactive[i][0], inactive[i][1], inactive[i][2]);
    }

    //drawing of the ghost shape
    ghost.update();
    //Update current piece
    current.update();

    let rowNum = [];
    rowNum = checkForRow();

    if (rowNum.length > 0) {
        destroy(rowNum); 
        //Update leaderboard
        document.getElementById("layers").innerHTML = layers;
        document.getElementById("points").innerHTML = points;
    } 
    //Draw grid
    update();
}

genGhost();
refresh();

//Draw the grey grid shape
function update() {
    c.strokeStyle = "#2e3440";
    //Horizontal Lines
    for (i=0; i < height; i++) {
        if (i==6) {
            //Drawing of the red line
            c.save();
            c.strokeStyle = '#bf616a';
            c.beginPath();
            c.moveTo(0, length * i);
            c.lineTo(canvas.width, length * i);
            c.stroke();
            c.restore();
        }
        else {
            c.beginPath();
            c.moveTo(0, length * i);
            c.lineTo(canvas.width, length * i);
            c.stroke();
        }
         
    }
    //Vertical Lines
    for(i=0; i < width; i++) {
        c.beginPath();
        c.moveTo((length) * i, 0);
        c.lineTo((length) * i, canvas.height);
        c.stroke(); 
    }
}

// Current Piece being controlled by player
function Current(item) {
    //Setting piece characteristics
    this.item = item;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    
    //Start index
    this.xcount = 9
    this.ycount = 2

    //Start Location
    this.x = length * this.xcount;
    this.y = length * this.ycount;
    
    //Declaration of other variables
    this.turned = 0;
    this.piececounted = false;


    this.update = function() {
            //Pieces can only rotate in 4 ways
            if (this.turned > 3) {
                this.turned = 0;
            }

            //Draw the actual piece
            draw(this.x, this.y, this.item, this.turned, this.color, length, c);
            
            //count the amount of squares in a new object
            if (this.piececounted == false) {
                this.backgroundPixelNumber = countPixels(this.color, current);
                this.piececounted = true;
            }
    }
}

//Hardoded drawing of each of the different shapes
function draw(x, y, item, turned, color, diameter, c) {
    //Drawing of Different Shapes
    switch(item) {
        case 'b':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 3/2, diameter, diameter);
            c.fillRect(diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.restore();
            break;
        case '-b':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 1/2, diameter, diameter);
            c.restore();
            break;
        case 'f':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.restore();
            break;
        case '-f':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.restore();
            break;
        case 'i':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 5/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 3/2, diameter, diameter);
            c.restore();
            break;
        case 'l':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 3/2, diameter, diameter);
            c.fillRect(diameter * 1/2, diameter * 3/2, diameter, diameter);
            c.restore();
            break;
        case '-l':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, diameter * 3/2, diameter, diameter);
            c.restore();
            break;
        case 'n':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, diameter * 3/2, diameter, diameter);
            c.restore();
            break;
        case '-n':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(diameter * 1/2, diameter * 3/2, diameter, diameter);
            c.restore();
            break;
        case 'p':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.restore();
            break;
        case '-p':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 3/2, diameter, diameter);
            c.restore();
            break;
        case 't':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.restore();
            break;
        case 'u':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 3/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.restore();
            break;
        case 'v':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.restore();
            break;
        case '-v':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, diameter * 1/2, diameter, diameter);
            c.fillRect(diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.restore();
            break;
        case 'w':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.restore();
            break;
        case 'x':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.restore();
            break;
        case 'y':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 3/2, diameter, diameter);
            c.restore();
            break;
        case '-y':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 3/2, diameter, diameter);
            c.restore();
            break;
        case 'z':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.restore();
            break;
        case '-z':
            c.save();
            c.fillStyle = color;
            //Rotation of Piece
            degree = turned * 90;
            c.translate(x + diameter / 2, y + diameter / 2);
            c.rotate(degree * Math.PI / 180);

            //Drawing of Shape
            c.fillRect(-diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, -diameter * 1/2, diameter, diameter);
            c.fillRect(diameter * 1/2, -diameter * 3/2, diameter, diameter);
            c.fillRect(-diameter * 1/2, diameter * 1/2, diameter, diameter);
            c.fillRect(-diameter * 3/2, diameter * 1/2, diameter, diameter);
            c.restore();
            break;
    }
}

//Little function to draw each individual cell
function drawSquare(x, y, color) {
    c.save();
    c.fillStyle = color;
    c.translate(x * length + length / 2, y * length + length / 2);
    //Drawing of Square
    c.fillRect(-length * 1/2, -length * 3/2, length, length);
    c.restore();
}

//Overlay ghost to see falling easier
function genGhost () { 
    ghost = Object.assign({},current);
    ghost.color = '#434c5e';
    ghost.update();
    backgroundPixelNumber = countPixels(ghost.color, ghost);
    //While loop to check each fall to see whether it may continue
    while (backgroundPixelNumber == 5) {
        //updating and drawing ghost
        c.clearRect(0, 0, innerWidth, innerHeight);
        ghost.y += length;
        ghost.ycount++; 
        ghost.update();
        
        //Draw The main enlargening blob
        for (i=0; i < inactive.length; i++) {
            drawSquare(inactive[i][0], inactive[i][1], inactive[i][2]);
        }

        //Count number of pixels
        backgroundPixelNumber = countPixels(ghost.color, ghost);
    } 
    //revert back once
    ghost.y -= length;
    ghost.ycount--;
}

//Deleting and moving the squares when a line is cleared
function destroy() {
    //Update the current stats screen
    layers = layers + rowNum.length;
    points = points + (rowNum.length * 10) * rowNum.length;
    
    //Sound when line is cleared.
    let sound = new Audio('Assets/LineClear.wav');
    sound.play();  

    //Delete each completed row
    for (j=0; j<rowNum.length;j++) {
        for (i=0; i<inactive.length;i++) {
            if (inactive[i][1] == rowNum[j]) {
                inactive.splice(i, 1);
                i--;
            }
        }
        //Move each cell down
        for (i=0;i<inactive.length;i++) {
            if (inactive[i][1] < rowNum[j]) {
                inactive[i][1]++;
            }
        }
    }
    refresh();
}

//Checking to see if rows are cleared
function checkForRow() {
    rowNum = [];
    let count = 0;
    //checking to count whether there is the width number of elements within the array
    for (i = 0; i <= height; i++) {
        for(j = 0; j < inactive.length; j++) {
            if (inactive[j][1] == i) {
                count++;
                row = inactive[j][1];
            }
        }
        //adding that row number to the array of completed rows
        if (count == width) {
            rowNum.push(row);
        }
        count = 0;
    }
    return rowNum;
} 

//Counting the amount of coloured pixels to check for collisions
function countPixels(color, piece) {
    //Reset Count
    backgroundPixelNumber = 0;
    let colorData = [];

    //Find color of center pixels within a 5 x 5 area
    for (i=-2; i<3; i++) {
        for (j=-2; j<3; j++) {
            colorData.push.apply(colorData, c.getImageData(piece.x + i * length + length * 1/2, piece.y + j * length + length * 1/2, 1, 1).data);
        }
    }
    //colorData works with RGB not Hex so conversion is required to count pixel number
    switch (color) {
        case '#434c5e': //blueish ghost
            for (i=0; i < colorData.length; i+=4) {
                if(colorData[i] === 67 && colorData[i + 1] === 76 && colorData[i + 2] === 94) {
                    ++backgroundPixelNumber;
                }
            }
            break;
        case '#bf616a': //red
            for (i=0; i < colorData.length; i+=4) {
                if(colorData[i] === 191 && colorData[i + 1] === 97 && colorData[i + 2] === 106) {
                    ++backgroundPixelNumber;
                }
            }
            break;
        case '#d08770': //salmon
            for (i=0; i < colorData.length; i+=4) {
                if(colorData[i] === 208 && colorData[i + 1] === 135 && colorData[i + 2] === 112) {
                    ++backgroundPixelNumber;
                }
            }
            break;
        case '#ebcb8b': //yellow
            for (i=0; i < colorData.length; i+=4) {
                if(colorData[i] === 235 && colorData[i + 1] === 203 && colorData[i + 2] === 139) {
                    ++backgroundPixelNumber;
                }
            }
            break;
        case '#a3be8c': //light green
            for (i=0; i < colorData.length; i+=4) {
                if(colorData[i] === 163 && colorData[i + 1] === 190 && colorData[i + 2] === 140) {
                    ++backgroundPixelNumber;
                }
            }
            break;
        case '#b48ead': //Purple
            for (i=0; i < colorData.length; i+=4) {
                if(colorData[i] === 180 && colorData[i + 1] === 142 && colorData[i + 2] === 173) {
                    ++backgroundPixelNumber;
                }
            }
            break;
        case '#81a1c1': //Blue
            for (i=0; i < colorData.length; i+=4) {
                if(colorData[i] === 129 && colorData[i + 1] === 161 && colorData[i + 2] === 193) {
                    ++backgroundPixelNumber;
                }
            }
            break;
    }
    return backgroundPixelNumber;
}

//Turning all the pieces in the current shape into the square array of inactive pieces
function inactify(color) {
    //Play sound when the block is placed.
    let sound = new Audio('Assets/place.wav');
    sound.play(); 
    //Reset Count
    let colorData = [];
    let rgb = [];

    //colour data only works in RGB so needs switch statment
    switch (color) {
        case '#bf616a': //red
            rgb = [191, 97, 106]; 
            break;
        case '#d08770': //salmon
            rgb = [208, 135, 112]; 
            break;
        case '#ebcb8b': //yellow
            rgb = [235, 203, 139]; 
            break;
        case '#a3be8c': //light green
            rgb = [163, 190, 140]; 
            break;
        case '#b48ead': //Purple
            rgb = [180, 142, 173]; 
            break;
        case '#81a1c1': //Blue
            rgb = [129, 161, 193]; 
            break;
    }
    
    //Looping through all the elements in 5x5 around center
    for (i=-2; i<3; i++) {
        for (j=-2; j<3; j++) {
            //Get the colour data values of a square
            colorData.push.apply(colorData, c.getImageData(current.x + i * length + length * 1/2, current.y + j * length + length * 1/2, 1, 1).data);
            //If the data is the colour of the shape, add it to the inactive array
            if(colorData[0] === rgb[0] && colorData[1] === rgb[1] && colorData[2] === rgb[2]) {
                X = current.xcount + i;
                Y = current.ycount + j;
                if (Y < 7) {
                    gameover();
                }
                switched = replaceColor(color);
                cell = [X, Y, switched];
                inactive.push(cell);
                cell=[];
            }
            colorData = [];
        }
    } 
}

//Replacing the colour of the previously current piece to prevent false positive collisions.
function replaceColor(color) {
    switch (color) {
        case '#bf616a': //red
            return color = '#bf616b';
        case '#d08770': //salmon
            return color = '#d08771';
        case '#ebcb8b': //yellow
            return color = '#ebcb8c';
        case '#a3be8c': //light green
            return color = '#a3be8d';
        case '#b48ead': //Purple
            return color = '#b48eae';
        case '#81a1c1': //Blue
            return color = '#81a1c2';
    }
}

//Bringing up the game over page and halting a bunch of other functions
function gameover() {
    //Sound when game is lost.
    let sound = new Audio('Assets/GameOver.wav');
    sound.play();  

    document.getElementById("gameover").style.visibility = "visible";
    over = true;
    //Still refreshes the screen in case of a "suicide" to get extra points
    refresh();
}

function rotateRight() {
    //Turn the piece and draw the board
    current.turned++;
    c.clearRect(0, 0, innerWidth, innerHeight);
    current.update();
    for (i=0; i < inactive.length; i++) {
        drawSquare(inactive[i][0], inactive[i][1], inactive[i][2]);
    }
    
    //Count number of pixels
    backgroundPixelNumber = countPixels(current.color, current);
    //If squares covering piece revert back
    if (current.backgroundPixelNumber > backgroundPixelNumber) {
        current.turned--;
    }

    //Do menial stuff
    genGhost();
    refresh();
}

function rotateLeft() {
    //Turn the piece and draw the board
    current.turned--;
    c.clearRect(0, 0, innerWidth, innerHeight);
    current.update();
    for (i=0; i < inactive.length; i++) {
        drawSquare(inactive[i][0], inactive[i][1], inactive[i][2]);
    }
    
    //Count number of pixels
    backgroundPixelNumber = countPixels(current.color, current);
    //If squares covering piece revert back
    if (current.backgroundPixelNumber > backgroundPixelNumber) {
        current.turned++;
    }
    //Do menial stuff
    genGhost();
    refresh();
}

function moveLeft() {
    //Translate the piece and draw the board
    current.x -= length;
    current.xcount--;
    c.clearRect(0, 0, innerWidth, innerHeight);
    current.update();
    for (i=0; i < inactive.length; i++) {
        drawSquare(inactive[i][0], inactive[i][1], inactive[i][2]);
    }

    //Count number of pixels
    backgroundPixelNumber = countPixels(current.color, current);
    //If squares covering piece revert back
    if (current.backgroundPixelNumber > backgroundPixelNumber) {
        current.x += length;
        current.xcount++;
    }
    //Do menial stuff
    genGhost();
    refresh();
}

function moveRight() {
    //Translate the piece and draw the board
    current.x += length;
    current.xcount++;
    c.clearRect(0, 0, innerWidth, innerHeight);
    current.update();
    for (i=0; i < inactive.length; i++) {
        drawSquare(inactive[i][0], inactive[i][1], inactive[i][2]);
    }
    

    //Count number of pixels
    backgroundPixelNumber = countPixels(current.color, current);
    //If squares covering piece revert back
    if (current.backgroundPixelNumber > backgroundPixelNumber) {
        current.x -= length;
        current.xcount--;
    }
    //Do menial stuff
    genGhost();
    refresh();
}

function moveDown() {
    //Translate the piece and draw the board
    current.y += length;
    current.ycount++; 
    c.clearRect(0, 0, innerWidth, innerHeight);
    current.update();
    for (i=0; i < inactive.length; i++) {
        drawSquare(inactive[i][0], inactive[i][1], inactive[i][2]);
    }

    //Check for collisions
    backgroundPixelNumber = countPixels(current.color, current);
    if (current.backgroundPixelNumber != backgroundPixelNumber) {
        //reset piece specific values and redraw
        held = 0;
        c.clearRect(0, 0, innerWidth, innerHeight);
        current.y -= length;
        current.update();

        //Add the cells of the piece to the inactive array
        inactify(current.color);
        
        //Setting new pieces
        item = pieces[Math.floor(Math.random() * pieces.length)];
        current = Object.assign({},next);;
        next = new Current(item);
        btx.clearRect(0, 0, nextcanvas.width, nextcanvas.height);
        draw(nextcanvas.width / 2 - smollength, nextcanvas.width / 2 - smollength, next.item, next.turned, next.color, smollength, btx);
        
        genGhost();
    }

    refresh();
}

//When the spacebar is clicked the piece falls down
function fall() {
    backgroundPixelNumber = countPixels(current.color, current);
    //While loop to check each fall to see whether the piece can go down further
    while (current.backgroundPixelNumber == backgroundPixelNumber) {
        //Updating and drawing new piece
        c.clearRect(0, 0, innerWidth, innerHeight);
        current.y += length;
        current.ycount++; 
        current.update();

        //Draw The main enlargening blob
        for (i=0; i < inactive.length; i++) {
            drawSquare(inactive[i][0], inactive[i][1], inactive[i][2]);
        }

        //Count number of pixels
        backgroundPixelNumber = countPixels(current.color, current);
    }

    //Draw reverted piece
    c.clearRect(0, 0, innerWidth, innerHeight);
    current.y -= length;
    current.update();

    //Add the cells of the piece to the inactive array
    inactify(current.color);
    
    //Setting new pieces
    item = pieces[Math.floor(Math.random() * pieces.length)];
    current = Object.assign({},next);
    next = new Current(item);
    btx.clearRect(0, 0, nextcanvas.width, nextcanvas.height);
    draw(nextcanvas.width / 2 - smollength, nextcanvas.width / 2 - smollength, next.item, next.turned, next.color, smollength, btx);
    held = 0;

    genGhost();
    refresh();
}

//When the user clicks 'c' their piece will swap with the next piece
function hold() {
    //Swaping pieces
    temp = Object.assign({},next);
    next = Object.assign({},current);
    current = temp;

    //Redrawing little canvas
    btx.clearRect(0, 0, nextcanvas.width, nextcanvas.height);
    draw(nextcanvas.width / 2 - smollength, nextcanvas.width / 2 - smollength, next.item, next.turned, next.color, smollength, btx);
    
    genGhost();
    refresh();
}

//Button presses
window.onkeyup = function(event) {
    let key = event.key.toUpperCase();
    if (over == false) {
        if ( key == 'S') {
            //Move down
            moveDown();
        } 
        else if ( key == 'A') {
           moveLeft();
        }
        else if ( key == 'D'){
           moveRight();
        }
        //Rotations
        else if ( key == 'E' ) { //Clockwise
            rotateRight();
        } 
        else if ( key == 'Q' ) { //Anti-Clockwise
            rotateLeft();
        }
        else if (key == 'C') { //Swap next and current piece
            if (held == 0) {
                hold();
                held = 1;
            }
        }
        else if (key == ' ') {
            fall();
        }
    }
}

//LDR Arrow Keys and Gameover enter key
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (over == false) {
        if (e.keyCode == '40') {   //down
            moveDown();
        }
        else if (e.keyCode == '37') { //left
            moveLeft();
        }
        else if (e.keyCode == '39') { //right
            moveRight();
        }
        else if (e.keyCode == '38') {
            rotateRight();
        }
    }
    else if (over == true && e.keyCode =='13' && updated == false) {
        leaderboarding();
    }
}

//Refresh all the original settings and configurations
function reset() {
    //clearing all settings
    degree = 0;
    backgroundPixelNumber = 0;
    inactive = [];
    layers = 0;
    points = 0;
    over = false;
    held = 0;
    updated = false;

    document.getElementById("layers").innerHTML = layers;
    document.getElementById("points").innerHTML = points;

    item = pieces[Math.floor(Math.random()*pieces.length)];
    current = new Current(item);

    item = pieces[Math.floor(Math.random()*pieces.length)];
    next = new Current(item);
    btx.clearRect(0, 0, nextcanvas.width, nextcanvas.height);
    draw(nextcanvas.width / 2 - smollength, nextcanvas.width / 2 - smollength, next.item, next.turned, next.color, smollength, btx);
    
    document.getElementById("gameover").style.visibility = "hidden";
    
    genGhost();
    refresh();
}

//Update leaderboard (or lack thereof) when the game ends
function leaderboarding() {
    //Obtaining of user name and setting of organisation variables
    let x = document.getElementById("username").value;
    let temparray = [];
    let replaced = false;
    let index = false;

    //Adjusting the array to be descending with the new points
    for (i=0; i < score.length; i++) {
        if (points > score[i] && replaced == false) {
            temparray[i] = points;
            replaced = true;
            index = i;
            points = 0;
        }
        else if (replaced == true) {
            temparray[i] = score[i-1];
        }
        else {
            temparray[i] = score[i];
        }
    }

    //Updating the score array to the final array
    score = temparray;
    temparray = [];

    //If a change has been made update the usernames
    if (index !== false) {
        //Sound when updated leaderboard
        let sound = new Audio('Assets/EnterName.wav');
        sound.play();  
        for (i=0; i<index; i++) {
            temparray[i] = player[i];
        }
        temparray.push(x);
        for (i=index; i<player.length -1; i++) {
            temparray[i+1] = player[i];
        }
        player = temparray;
    }

    //Set each player and score into the local storage
    localStorage.setItem("player1", player[0]);
    localStorage.setItem("player2", player[1]);
    localStorage.setItem("player3", player[2]);
    localStorage.setItem("player4", player[3]);
    localStorage.setItem("player5", player[4]);

    localStorage.setItem("score0", score[0]);
    localStorage.setItem("score1", score[1]);
    localStorage.setItem("score2", score[2]);
    localStorage.setItem("score3", score[3]);
    localStorage.setItem("score4", score[4]);

    //Writing the leaderboard out on the LHS of the screen
    for (i=1; i<6; i++) {
        document.getElementById("player" + i.toString()).innerHTML = (i.toString() + '. ' + player[i-1]);
        document.getElementById("score" + i.toString()).innerHTML = score[i-1];
    }
    updated = true;
    refresh();
}

//The aid screen that tells the user what each button does
function helpme(state) {
    if (state==true) {
        document.getElementById("helpbox").style.visibility = "visible";
    }
    else if (state==false){
        document.getElementById("helpbox").style.visibility = "hidden";
    }
}