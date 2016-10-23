$(document).ready(function(){


    // TODO load images with ajax from db

    var images = [
        './images/red.jpg',
        './images/blue.jpg',
        './images/yellow.jpg'];
    var sizes = [10,40,20];

    sizes = sizes.sort(ImagePacking.sortNumber);
    var smallestSize = sizes[0];
    var smallerWindowSize = Math.min(window.innerHeight, window.innerWidth);
    smallerWindowSize = ImagePacking.roundDownToSmallest(smallerWindowSize, smallestSize);

    var size = smallerWindowSize - 100;

    ImagePacking.fillGrid(document.getElementById('imageContainer'), sizes, images, size);

    ImagePacking.canvas.addEventListener('click', function(e){
        var x = e.pageX;
        var y = e.pageY;

        console.log(x, y);
        ImagePacking.imagesArray.forEach(function(element){
            if(y > element.y && y < (element.y + element.height) && x > element.x && x < (element.x + element.width)){
                console.log(element.img);
            }
        });
    })
    console.log('done');

});