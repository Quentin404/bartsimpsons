import {WFC} from "./algorithms/ndwfc";
import {WFCTool2D} from "./algorithms/ndwfc-tools";

var tilesets = {
    floor_plan: function(tool){


        tool.addTile(`\
.........
.........
.........
.........
.........
.........
.........
.........
.........`,{weight:2})

        tool.addTile(`\
@@@@@@@@@
@@@@@@@@@
@@@@@@@@@
@@@@@@@@@
@@@@@@@@@
@@@@@@@@@
@@@@@@@@@
@@@@@@@@@
@@@@@@@@@`,)

        tool.addTile(`\
@@@@@@@@@
@@@@@@@@@
@@@@@@@@@
#########
#########
#########
.........
.........
.........`)

        tool.addTile(`\
@@@@@@@@@
@@@@@@@@@
@@@@@@@@@
@@@######
@@@######
@@@######
@@@###...
@@@###...
@@@###...`)

        tool.addTile(`\
.........
.........
.........
...######
...######
...######
...###@@@
...###@@@
...###@@@`)

        tool.addTile(`\
@@@@@@@@@
@@@@@@@@@
@@@@@@@@@
#########
#########
#########
....#....
....#....
....#....`)


        tool.addTile(`\
....#....
....#....
....#....
....#....
....#....
....#....
....#....
....#....
....#....`)

        tool.addTile(`\
.........
.........
.........
.........
....#####
....#....
....#....
....#....
....#....`)

        tool.addTile(`\
....#....
....#....
....#....
....#....
....#####
....#....
....#....
....#....
....#....`)

        tool.addTile(`\
@@@@@@@@@
@@@@@@@@@
@@@@@@@@@
####=====
#########
####=====
.........
.........
.........`)


        tool.addTile(`\
@@@@@@@@@
@@@@@@@@@
@@@@@@@@@
=====####
#########
=====####
.........
.........
.........`)

        tool.addTile(`\
@@@@@@@@@
@@@@@@@@@
@@@@@@@@@
=========
#########
=========
.........
.........
.........`)


        tool.addTile(`\
@@@@@@@@@
@#==@@@@@
@#..=@@@@
##...=###
##....###
##....###
.........
.........
.........`)

        tool.addTile(`\
@@@@@@@@@
@#==@==#@
@#..=..#@
##..=..##
##.....##
##.....##
.........
.........
.........`)

        tool.addTile(`\
....#....
....#....
....===..
.......=.
.......=.
....####.
....#....
....#....
....#....`)


        tool.addTile(`\
.........
.#######.
.##...##.
.#.#.#.#.
.#..#..#.
.#.#.#.#.
.##...##.
.#######.
.........`)


        tool.addTile(`\
.........
.........
...###...
..#...#..
..#...#..
..#...#..
...###...
.........
.........`,{weight:0.2})


        tool.addTile(`\
....#....
....#####
....#....
....#####
....#....
....#####
....#....
....#####
....#....`)


        tool.addColor(".", [232, 146, 162])
        tool.addColor("#", [54, 1, 10])
        tool.addColor("=", [168, 12, 54])
        tool.addColor("@", [232, 146, 162])

    },

}

var worker;
var canvas;
var renderer;

function wfcDemo2D(tilesetName){

    if (worker){
        worker.terminate();
    }

    var tool = new WFCTool2D();

    tilesets[tilesetName](tool);

    var viewport;
    var wave;

    var workerCode = function(){
        var viewport;
        var wfc;
        var aspectRatio;
        var size;
        var increment;
        var multiply;

        console.log("connect")

        onmessage = function(e) {
            console.log(e)
            if (e.data.op == "init"){
                wfc = new WFC(e.data.wfcInput);
                aspectRatio = e.data.aspectRatio;
                size = e.data.initialSize;
                increment = e.data.increment;
                multiply = e.data.multiply
                main();
            }
        }

        function main(){
            setTimeout(main,1);
            if (!wfc){
                return
            }
            if (wfc.step()){
                viewport = {x:-size,y:-Math.round(size*aspectRatio),w:size*2,h:Math.round(size*2*aspectRatio)}
                wfc.expand([viewport.y,viewport.x],[viewport.y+viewport.h,viewport.x+viewport.w]);
                size=Math.ceil((size+increment)*multiply);
            }
            postMessage({viewport,wave:wfc.readout(/*false*/)})
        }
    }

    console.log(tool.getTileFormulae())

    worker =new Worker(URL.createObjectURL(new Blob(["var WFC="+WFC.toString()+';('+workerCode.toString()+')()'])));// new Worker('worker.js');

    worker.postMessage({
        op:'init',
        wfcInput:tool.generateWFCInput(),
        aspectRatio:window.innerHeight/window.innerWidth,
        initialSize:8,
        increment:0,
        multiply:1.5,
    })

    worker.onmessage = function(e){
        viewport = e.data.viewport;
        wave = e.data.wave;
    }

    if (renderer){
        renderer.domElement.style.display="none";
    }

    if (!canvas){
        canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = "absolute";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
        document.body.appendChild(canvas);
    }else{
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }

    canvas.style.display="block";

    function main(){
        requestAnimationFrame(main)
        // tool.clearPlotCache();
        if (viewport && wave){
            tool.plotWFCOutput(canvas,viewport,wave)
        }
    }
    main();
}

export function drawWFC(){
    wfcDemo2D('floor_plan');
}