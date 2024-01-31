import { solveTSP } from "../algorithms/travelingSalesman.js";

function linkDamage(ctx, points, maxLinks) {

    if (points.length < 2) {
        return;
    }
    // Use the TSP algorithm to find the optimal path
    const tspPath = solveTSP(points);

    // Render the path connecting the points
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(points[tspPath[0]].x, points[tspPath[0]].y);

    maxLinks = Math.min(maxLinks, tspPath.length - 1);

    for (let i = 1; i < tspPath.length; i++) {
        if (i >= maxLinks) {
            break; // Sortir de la boucle si le nombre maximum de liens est atteint
        }
        ctx.lineTo(points[tspPath[i]].x, points[tspPath[i]].y);
    }

    ctx.stroke();
}

export { linkDamage };
