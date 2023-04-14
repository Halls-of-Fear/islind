const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const generateButton = document.getElementById('generateButton');

const colors = {
    water: ['#0077be', '#00a7e6'],
    land: ['#2c5f2d', '#4c8a4e', '#6b9d61'],
    plains: ['#4c8a4e', '#6b9d61'],
    forest: ['#2c5f2d', '#4c8a4e', '#6b9d61'],
    mountain: ['#ffffff', '#c7c7c7', '#8f8f8f']
};

const SIZE = 128;
const MAP_SIZE = SIZE + 1;
const MAX_HEIGHT = 255;
const MIN_HEIGHT = 0;
const ROUGHNESS = 0.5;
let heightMap = [];

function init() {
    heightMap = [];
    for (let i = 0; i < MAP_SIZE; i++) {
        heightMap[i] = new Array(MAP_SIZE).fill(0);
    }
}

function generateHeightMap() {
    let step = SIZE;
    let heightRange = MAX_HEIGHT - MIN_HEIGHT;

    while (step > 1) {
        diamondSquare(step, heightRange);
        step = Math.floor(step * ROUGHNESS);
        heightRange = Math.floor(heightRange * ROUGHNESS);
    }

    normalizeHeightMap();
    drawHeightMap();
}

function diamondSquare(step, range) {
    let half = step / 2;

    for (let y = half; y < MAP_SIZE; y += step) {
        for (let x = half; x < MAP_SIZE; x += step) {
            square(x, y, half, Math.random() * range * 2 - range);
        }
    }

    for (let y = 0; y < MAP_SIZE; y += half) {
        for (let x = (y + half) % step; x < MAP_SIZE; x += step) {
            diamond(x, y, half, Math.random() * range * 2 - range);
        }
    }
}

function square(x, y, half, offset) {
    let topLeft = heightMap[y - half][x - half];
    let topRight = heightMap[y - half][x + half];
    let bottomLeft = heightMap[y + half][x - half];
    let bottomRight = heightMap[y + half][x + half];

    let average = (topLeft + topRight + bottomLeft + bottomRight) / 4;
    let height = average + offset;

    heightMap[y][x] = height;
}

function diamond(x, y, half, offset) {
    let topLeft = y - half >= 0 ? heightMap[y - half][x] : 0;
    let topRight = x + half < MAP_SIZE ? heightMap[y][x + half] : 0;
    let bottomLeft = y + half < MAP_SIZE ? heightMap[y + half][x] : 0;
    let bottomRight = x - half >= 0 ? heightMap[y][x - half] : 0;

    let average = (topLeft + topRight + bottomLeft + bottomRight) / 4;
    let height = average + offset;

    heightMap[y][x] = height;
}

function normalizeHeightMap() {
    let max = -Infinity;
    let min = Infinity;

    for (let y = 0; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
            if (heightMap[y][x] > max) {
                max = heightMap[y][x];
            }

            if (heightMap[y][x] < min) {
                min = heightMap[y][x];
            }
        }
    }

    for (let y = 0; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
            heightMap[y][x] = (heightMap[y][x] - min) / (max - min);
        }
    }
}

function drawHeightMap() {
    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            let height = heightMap[y][x];

            let color;
            if (height < 0.2) {
                color = colors.water[0];
            } else if (height < 0.3) {
                color = colors.water[1];
            } else if (height < 0.5) {
                color = colors.land[0];
            } else if (height < 0.7) {
                color = colors.land[1];
            } else if (height < 0.85) {
                color = colors.land[2];
            } else if (height < 0.9) {
                color = colors.mountain[0];
            } else if (height < 0.95) {
                color = colors.mountain[1];
            } else {
                color = colors.mountain[2];
            }

            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

init();
generateHeightMap();
generateButton.addEventListener('click', () => {
    init();
    generateHeightMap();
});
