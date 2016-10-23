# js-square-packing

JS Square Packing is a Javascript tool which will pack random size square images into a given area until it is filled.

Below is an example of the final outcome.

![as3-square-packing](https://www.dropbox.com/s/zxnemrnbt2vagij/js-square-packing.png?dl=0&raw=1)

Just provide an array of images to randomly choose from and the sizes you want.

    // app.js
    var images = [
        './images/red.jpg',
        './images/blue.jpg',
        './images/yellow.jpg'
    ];
        
    var sizes = [10,40,20];

And add a container div.

    // index.html
    <div id="imageContainer"></div>
    
It will recursively pick one of the sizes and images at random and then attempt to place that image starting in the top left corner. If it fits (without covering another image or flowing off the right side) it will place the image down, then repeat. Once it fills a row to the end of the given area, it will then move down and continue from there.

This will work with any array of images to create different affects.

![as3-square-packing](https://www.dropbox.com/s/rxtdwvb550famwr/js-square-packing-android.png?dl=0&raw=1)

ActionScript 3 version located [here](https://github.com/iamface/as3-square-packing).
