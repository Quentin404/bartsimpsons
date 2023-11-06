import { solveTSP } from "../algorithms/travelingSalesman.js";

function linkDamage(ctx, points){

    // Use the TSP algorithm to find the optimal path
    const tspPath = solveTSP(points);

    // Render the path connecting the points
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[tspPath[0]].x, points[tspPath[0]].y);
    for (let i = 1; i < tspPath.length; i++) {
        ctx.lineTo(points[tspPath[i]].x, points[tspPath[i]].y);
    }
    ctx.lineTo(points[tspPath[0]].x, points[tspPath[0]].y);
    ctx.stroke();

    // Render the points
    for (let i = 0; i < points.length; i++) {
        ctx.fillStyle = "red";
        ctx.fillRect(points[i].x - 5, points[i].y - 5, 10, 10);
    }
}

export { linkDamage };