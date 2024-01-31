import { BasicFoe } from "./basicFoe.js";

var volume = .6;
var foeDeadSounds = [
    new Audio("../audio/foeDead1.mp3"),
    new Audio("../audio/foeDead2.mp3"),
    new Audio("../audio/foeDead3.mp3")
];
foeDeadSounds.forEach(e => { e.volume = volume });

export class FoeGenerator {
    constructor(populationSize) {
        this.populationSize = populationSize;
        this.foes = []; // The desired number of foes which is meant to be constant
        this.deadFoes = [];
        this.playerScore = 0;
    }

    initializePopulation(ctx) {
        for (let i = 0; i < this.populationSize; i++) {
            const randomShootingPattern = Math.floor(Math.random() * 3); // 0, 1, or 2
            const foe = new BasicFoe(
                Math.random() * ctx.canvas.width, // random x position
                Math.random() * ctx.canvas.height, // random y position
                Math.random() * 4 + 1, // random movement speed between 1 and 5
                30, // foe height
                30, // foe width
                randomShootingPattern,
                Math.floor(Math.random() * 100) + 1, // random accuracy between 1 and 100
                Math.random() * 500 + 150,
                200 // move rate
            );

            this.foes.push(foe);
        }
    }

    update(ctx, player) {
        this.evaluatePopulation();
        for (let i = 0; i < this.foes.length; i++) {
            const foe = this.foes[i];
            foe.update(ctx, player);
            if (foe.isDead()) {
                var randomSound = Math.floor(Math.random() * 2);
                foeDeadSounds[randomSound].currentTime = 0;
                foeDeadSounds[randomSound].play();

                this.playerScore += 1;
                this.deadFoes.push(foe);
                this.foes.splice(i, 1);
            }
        }
        if (this.foes.length < this.populationSize) {
            this.addFoe(ctx);
        }
    }

    addFoe(ctx) {
        const parents = this.selectParents();

        for (let i = this.foes.length; i < this.populationSize; i++) {
            const parent1 = parents[Math.floor(Math.random() * parents.length)];
            const parent2 = parents[Math.floor(Math.random() * parents.length)];

            const child = this.crossover(ctx, parent1, parent2);

            this.mutate(child);

            this.foes.push(child);
        }
    }

    evaluatePopulation() {
        for (let i = 0; i < this.foes.length; i++) {
            const foe = this.foes[i];
            foe.performance = foe.hitsToPlayer * 1000 + foe.survivalTime * 2;
        }
    }

    // Selecting the best foes for reproduction among both living and dead
    selectParents() {
        const allFoes = this.foes.concat(this.deadFoes); // Combine dead and living foes to get the very best

        allFoes.sort((a, b) => b.performance - a.performance); // Sort by performance

        const numParents = Math.floor(this.populationSize / 2); // Select the best 50%
        return allFoes.slice(0, numParents);
    }

    // Crossing foes traits to optimize performance
    crossover(ctx, parent1, parent2) {
        let firingPattern = Math.floor(Math.random() * 3);
        if (Math.random() < 0.40) { // 40% chance of inheriting pattern
            firingPattern = parent1.currentFiringPattern;
        }

        return new BasicFoe(
            Math.random() * ctx.canvas.width, // random x position
            Math.random() * ctx.canvas.height, // random y position
            (parent1.speed + parent2.speed) / 2, // Average speed
            parent1.height,
            parent1.width,
            firingPattern,
            (parent1.accuracy + parent2.accuracy) / 2, // Average precision
            (parent1.fireRate + parent2.fireRate) / 2, // Average fire rate
            parent1.moveRate
        );
    }

    // Apply mutations to foe
    mutate(foe) {
        const mutationRate = 2;
        foe.speed += (Math.random() - 0.5) * mutationRate;
        foe.accuracy += (Math.random() - 0.5) * mutationRate * 5;
        foe.fireRate += (Math.random() - 0.5) * mutationRate * 100;
        foe.speed = Math.max(1, foe.speed);

        if (Math.random() < 0.15) { // 15% chance of a random pattern
            foe.shootingPattern = Math.floor(Math.random() * 3); // 0, 1 or 2
        }
    }
}
