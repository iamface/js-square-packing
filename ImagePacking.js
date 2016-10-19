ImagePacking = {

    // Smallest browser window size (width or height)
    smallerWindowSize     : 0,
    containerSize         : 0,
    imageContainer        : null,
    canvas                : document.createElement('canvas'),
    canvasCtx             : null,
    imageURLs             : [],
    sizes                 : [],
    smallestSize          : 0,
    gridMatrixArray       : [],
    currentContainerSize  : 0,
    imagesArray           : [],

    // Set container
    setContainer : function(container, sizes){
        this.imageContainer = container;
        this.sizes = sizes.sort(this.sortNumber);
        this.smallestSize = this.sizes[0];

        // Set initial container size
        this.setContainerSize();
    },

    // Set container size
    setContainerSize : function(){
        // Find smallest window size and round down to nearest 5
        this.smallerWindowSize = Math.min(window.innerHeight, window.innerWidth);
        this.smallerWindowSize = this.roundDownToSmallest(this.smallerWindowSize, this.smallestSize);

        if(this.containerSize == 0){
            this.containerSize = this.smallerWindowSize;
        }

        // Set container
        this.imageContainer.style.width  = this.containerSize + 'px';
        this.imageContainer.style.height = this.containerSize + 'px';

        this.currentContainerSize = this.containerSize;
    },

    // Create canvas
    createCanvas : function(){
        this.canvas.width  = this.containerSize;
        this.canvas.height = this.containerSize;

        this.canvasCtx = this.canvas.getContext('2d');
        this.canvasCtx.width  = this.canvas.width;
        this.canvasCtx.height = this.canvas.height;
    },

    // Rescale canvas
    rescaleCanvas : function(){
        this.canvas.setAttribute('style', 'width:' + this.currentContainerSize + 'px');
        this.canvas.setAttribute('style', 'height:' + this.currentContainerSize + 'px');
    },

    // Round down to the nearest, smallest square
    roundDownToSmallest : function(x, y){
        return Math.floor(x / y) * y;
    },

    // Function to sort numbers in numeric order
    sortNumber : function(a, b){
        return a - b;
    },

    // Fill grid
    fillGrid : function(container, sizes, imageURLs, containerSize){
        this.imageURLs = imageURLs;
        this.containerSize = typeof containerSize !== 'undefined' ?  containerSize : 0;

        this.setContainer(container, sizes);

        // Add canvas
        this.createCanvas();
        this.imageContainer.appendChild(this.canvas);

        // Reset container size if window changes
        window.onresize = function(){
            ImagePacking.setContainerSize();
            ImagePacking.rescaleCanvas();
        };

        this.buildGridMatrix();

        this.packSquares();
    },

    // Build grid matrix to check against
    buildGridMatrix : function(){
        var x = 0;
        var y = 0;

        for(var i = 0; i < (this.containerSize / this.smallestSize); i++){
            var row = [];
            x = 0;

            for(var j = 0; j < (this.containerSize / this.smallestSize); j++){
                var squareMatrix = {
                    'occupied' : false,
                    'x'        : x,
                    'y'        : y
                };

                row.push(squareMatrix);
                x += this.smallestSize;
            }

            this.gridMatrixArray.push(row);
            y += this.smallestSize;
        }
        //console.log(this.gridMatrixArray);
    },

    // Pack all squares
    packSquares : function(){
        for(var rowIndex = 0; rowIndex < (this.canvasCtx.width / this.smallestSize); rowIndex++){
            for(var colIndex = 0; colIndex < (this.canvasCtx.height / this.smallestSize); colIndex++){
                // Current grid unit in not occupied
                if(!this.gridMatrixArray[rowIndex][colIndex].occupied){
                    var validSquare = false;

                    while(!validSquare){
                        // Create a new image at a random size
                        var image = this.randomImage();
                        // Assume the square area in the grid is empty
                        var canBePlaced = true;

                        for(var i = rowIndex; i < Number(rowIndex + (image.width / this.smallestSize)); i++){ // check if all square units are not occupied
                            for(var j = colIndex; j < Number(colIndex + (image.height / this.smallestSize)); j++){
                                if((this.gridMatrixArray[i] != undefined) && (this.gridMatrixArray[i][j] != undefined)){ // unit exists in grid matrix
                                    if(this.gridMatrixArray[i][j].occupied == true){
                                        canBePlaced = false; // square cannot be placed without overlap
                                    }
                                }
                            }
                        }

                        if(canBePlaced){ // square can be placed without overlapping other units
                            if((((this.canvasCtx.width / this.smallestSize) - rowIndex) >= (image.width / this.smallestSize)) && (((this.canvasCtx.height / this.smallestSize) - colIndex) >= (image.height / this.smallestSize))){ // square fits without 'falling off' any edge

                                ImagePacking.drawImage(image, this.gridMatrixArray[rowIndex][colIndex].x, this.gridMatrixArray[rowIndex][colIndex].y, image.width, image.height);

                                ImagePacking.saveImageInfo(image, this.gridMatrixArray[rowIndex][colIndex].x, this.gridMatrixArray[rowIndex][colIndex].y, image.width, image.height);

                                for(var k = rowIndex; k < Number(rowIndex + (image.width / this.smallestSize)); k++){ // mark all area units in square as occupied
                                    for(var l = colIndex; l < Number(colIndex + (image.height / this.smallestSize)); l++){
                                        if((this.gridMatrixArray[k] != undefined) && (this.gridMatrixArray[k][l] != undefined)) { // unit exists in grid matrix
                                            this.gridMatrixArray[k][l].occupied = true;
                                        }
                                    }
                                }
                                validSquare = true; // square was validated to fit and placed, move on
                            }
                        }
                    }
                }
            }
        }
    },

    // Draws image on canvas
    drawImage : function(image, x, y, width, height){
        image.onload = function(){
            ImagePacking.canvasCtx.drawImage(image, x, y, width, height);
        };
    },

    saveImageInfo : function(image, x, y, width, height){
        var imageObject = {
            'x':x,
            'y':y,
            'width':width,
            'height':height,
            'img':image
        };
        ImagePacking.imagesArray.push(imageObject);
    },

    // Create random image
    randomImage : function(){
        // Get random size and image key
        var size = this.sizes[Math.floor(Math.random() * this.sizes.length)];
        var randomImageKey = Math.floor(Math.random() * this.imageURLs.length);

        var url = this.imageURLs[randomImageKey];

        var image = new Image();
        image.src = url;
        image.width  = size;
        image.height = size;

        return image;
    }
};