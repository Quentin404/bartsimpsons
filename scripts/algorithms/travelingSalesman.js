function solveTSP(points) {
    const numPoints = points.length;
    if (numPoints < 2) {
        return [];
    }

    // Créez un tableau pour suivre les points visités
    const visited = new Array(numPoints).fill(false);
    visited[0] = true;

    // Initialisez le chemin avec le premier point
    const path = [0];

    let currentPoint = 0;

    // Trouvez le point le plus proche jusqu'à ce que tous les points aient été visités
    while (path.length < numPoints) {
        let nearestPoint = null;
        let shortestDistance = Infinity;

        for (let i = 0; i < numPoints; i++) {
            if (!visited[i]) {
                const distance = calculateDistance(points[currentPoint], points[i]);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    nearestPoint = i;
                }
            }
        }

        if (nearestPoint !== null) {
            path.push(nearestPoint);
            visited[nearestPoint] = true;
            currentPoint = nearestPoint;
        }
    }

    // Ajoutez le point de départ à la fin pour fermer la boucle
    path.push(0);

    return path;
}

function calculateDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export { solveTSP };
