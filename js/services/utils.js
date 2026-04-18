'use strict';

function generateId() {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}