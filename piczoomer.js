var picZoomer = function(container, data, colours)
{
    var cont = document.getElementById(container);
    //  Number of blocks to fit in
    var blockNum = 100;
    //  or row count
    var rowCount = 7;

    //  Zoom ratio on hover
    var zoomRatio = 3; // How many block area is hover effect

    //  Loading bar
    var barHeight = 2;  //  Pixels
    var barWidth = 0.6; //  Percents * 100
    var loaderBack = '#000';
    var barColor = '#FFF';

    //  Fade color
    var fadeBack = '#000';

    var realBlockNum = blockNum;
    var blockDim = 50;
    var blockCols = 10;
    var blockRows = 5;
    var xRelat = 0;
    var yRelat = 0;
    var actData = [];
    var imagesLoaded = 0;
    var imagesLoader = [];
    var ctx;
    var mousex = -100;
    var mousey = -100;
    var currentMainAlpha = 0.01;
    var allPics = null;
    var activated = [];
    var current;
    var forceDraw = false;
    var waiting;
    var label;
    var labelFor = 0;

    var mainAnimation;

    self = this;

    this.init = function()
    {
        cont.innerHTML = '<canvas id="'+container+'_kK"></canvas>';
        canvas = document.getElementById(container+"_kK");

        var labelNode = document.createElement("div");
        cont.appendChild(labelNode).setAttribute("class", "mainLabel");;
        label = cont.getElementsByClassName('mainLabel')[0];

        ctx = canvas.getContext('2d');
        this.resize();
        this.setup();
    }


    this.setup = function()
    {
        imageLoad = [];
        actData = [];
        id = 1;
        for (i = 0; i < blockRows; i++)
        {
            actData[i] = []
            for (j = 0; j < blockCols; j++)
            {
                var current = [];
                current = data[Math.floor(Math.random() * data.length)];

                actData[i][j] = {
                    id: id++,
                    row: i,
                    col: j,
                    name: current[0],
                    pic: current[1],
                    object: current,
                    posx: blockDim * j + xRelat,
                    posy: blockDim * i + yRelat,
                    zoomRatio: 1,
                    currentZoom: 1,
                    currentAlpha: 1
                }

                imagesLoader.push(current[1]);
            }
        }

        /**
         * Image preloader
         */
        imagesLoader.forEach(function(el) {
            imageTemp = new Image;
            imageTemp.src = el;
            imageTemp.onload = function() {
                imagesLoaded++;

                ctx.fillStyle = loaderBack;
                ctx.fillRect(0,0, self.w, self.h);

                ctx.fillStyle = barColor;
                ctx.fillRect(
                    (self.w - (self.w*barWidth)) / 2,
                    self.h/2-(barHeight/2),
                    self.w*barWidth*imagesLoaded/imagesLoader.length,
                    barHeight
                );

                if (imagesLoaded == imagesLoader.length)
                {
                    actData.forEach(function(rowArr) {
                        rowArr.forEach(function(col) {
                            var tempImage = new Image;
                            tempImage.src = col.pic;
                            actData[col.row][col.col].image = tempImage

                            offset = (actData[col.row][col.col].zoomRatio - 1) / 2 * blockDim;
                            ctx.drawImage(tempImage, col.posx-offset, col.posy-offset, blockDim, blockDim);
                            offset = (actData[col.row][col.col].currentZoom - 1) / 2 * blockDim;
                        });
                    });

                    imagesLoaded = 0;
                    allPics = ctx.getImageData(0,0,self.w,self.h);
                    self.draw();
                }
            }
        });
    }

    this.draw = function()
    {
        mainAnimation = requestAnimationFrame(self.draw)

        /**
         * Define draw loop variables and clear canvas
         */
        ctx.fillStyle = fadeBack;
        ctx.fillRect(0,0, self.w, self.h);
        animateAlpha = false;


        /**
         * Draw and afterwards redraw background from initial draw
         * Saves resources from drawing it every time.
         */
        if (!allPics)
        {
            actData.forEach(function(rowArr) {
                rowArr.forEach(function(col) {
                    offset = (actData[col.row][col.col].zoomRatio - 1) / 2 * blockDim;
                    ctx.drawImage(col.image, col.posx-offset, col.posy-offset, blockDim, blockDim);
                    offset = (actData[col.row][col.col].currentZoom - 1) / 2 * blockDim;
                });
            });
            allPics = ctx.getImageData(0,0,self.w,self.h);
        } else {
            if (
                (mousex < self.w && mousex > 0) &&
                (mousey < self.h && mousey > 0)
             )
            {
                animateAlpha = true;
            } else {
                animateAlpha = false;
            }
            ctx.putImageData( allPics, 0,0);

            ctx.globalAlpha = currentMainAlpha;
            ctx.fillRect(0,0, self.w, self.h);
            ctx.globalAlpha = 1;
        }


        /**
         * Apply transperancy to rectangle if mouse hovers
         * canvas to replicate fading effect for images
         * Saves resources. A lot.
         */
        if (animateAlpha && currentMainAlpha < 0.65)
        {
            currentMainAlpha = currentMainAlpha * 1.7;
            if (currentMainAlpha > 0.65)
                currentMainAlpha = 0.65;
        } else if (!animateAlpha && currentMainAlpha > 0.01) {
            currentMainAlpha = currentMainAlpha * 0.7;
            if (currentMainAlpha < 0.01)
                currentMainAlpha = 0.01;
        }

        /**
         * Animate zoomRatio for hovered images
         */
        if (mousey > 0 && mousey < self.h && mousex > 0 && mousex < self.w)
        {
            selCol = Math.floor((mousex-xRelat) / blockDim);
            selRow = Math.floor((mousey-yRelat) / blockDim);

            curr = actData[selRow][selCol];

            curr.zoomRatio = zoomRatio;
            if (curr.currentZoom < curr.zoomRatio)
                curr.currentZoom = curr.currentZoom * 1.13;

            if (curr.zoomRatio != 1)
            {
                tempImage = new Image;
                tempImage.src = curr.pic;
                positionX = curr.posx - (curr.currentZoom - 1) / 2 * blockDim;
                positionY = curr.posy - (curr.currentZoom - 1) / 2 * blockDim;

                if (positionX < 0) positionX = 0;
                if (positionY < 0) positionY = 0;
                if (positionX+(blockDim*curr.currentZoom) > self.w) positionX = self.w-(blockDim*curr.currentZoom);
                if (positionY+(blockDim*curr.currentZoom) > self.h) positionY = self.h-(blockDim*curr.currentZoom);

                ctx.drawImage(
                    tempImage,
                    positionX,
                    positionY,
                    blockDim*curr.currentZoom,
                    blockDim*curr.currentZoom
                );

                if (labelFor != curr.id && curr.currentZoom > curr.zoomRatio)
                {
                    self.setLabel(positionX, positionY, curr, (blockDim * zoomRatio), true);
                    labelFor = curr.id;
                }

                current = curr;
                if (activated[curr.row] == undefined)
                    activated[curr.row] = [];
                activated[curr.row][curr.col] = curr;
            }
        } else {
            if (labelFor != 0)
            {
                self.setLabel(null, null, null);
            }
            labelFor = 0;
        }


        /**
         * Reset zoom ratio for hovered images
         */
        activated.forEach(function(row) {
            row.forEach(function(elem) {
                if (elem != current)
                {
                    actData[elem.row][elem.col].currentZoom = 1;
                    actData[elem.row][elem.col].zoomRatio = 1;
                    index = activated[elem.row].indexOf(elem);
                    activated[elem.row].splice(index, 1);
                }
            });
        });
    }

    this.setLabel = function(posx, posy, obj, blockDim, animate)
    {
        //  Can be used with default function, and overridden
        if (posx != null)
        {
            if (animate)
            {
                $('.mainLabel').fadeIn();
            }
            $(label).html('<h3>'+obj.object[3]+'</h3><h1>'+obj.name+'</h1><h2>CLASS OF '+obj.object[2]+'</h2>')

            positionX = posx+blockDim;
            positionY = posy;

            if (positionX-blockDim > $('#piczoomer').width()/2)
            {
                positionX = positionX - blockDim - $('.mainLabel').outerWidth();
            }

            $('.mainLabel').css('left', positionX+'px');
            $('.mainLabel').css('top', positionY+'px');
            $('.mainLabel').css('height', blockDim+'px');
        } else {
            $('.mainLabel').fadeOut();
        }
    }

    this.resize = function()
    {
        console.log('resize')
        this.w = cont.offsetWidth;
        this.h = cont.offsetHeight;

/*        S = this.w * this.h;
        S = S / blockNum;
        S = Math.ceil(Math.sqrt(S));
        blockDim = S;
*/

        blockDim = this.h / rowCount;
        blockRows = Math.ceil(this.h / blockDim)
        blockCols = Math.ceil(this.w / blockDim)
        realBlockNum = blockRows * blockCols;

        xRelat = (this.w - (blockCols * blockDim)) / 2;
        yRelat = (this.h - (blockRows * blockDim)) / 2;

        canvas.width = this.w;
        canvas.height = this.h;
    }

    window.onresize = function() {
        clearTimeout(waiting);
        window.cancelAnimationFrame(mainAnimation)
        waiting = setTimeout(function() {
            self.resize();
            self.setup();
            forceDraw = true;
            allPics = false;
        }, 200);
    }

    /**
     * Simple cursor tracker
     */
    cont.onmousemove = function(e) {
        mousex = e.offsetX == undefined ? e.layerX : e.offsetX;
        mousey = e.offsetY == undefined ? e.layerY : e.offsetY;
    };
    cont.onmouseout = function(e) {
        mousex = -100;
        mousey = -100;
    }
}


/**
 * Correct way of calling animation, so they dont crash on mobile devices
 */
var lastTime = 0;
var vendors = ['webkit', 'moz'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };