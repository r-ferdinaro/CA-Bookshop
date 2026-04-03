'use strict';

function saveToStorage(key, value) {
    const jsonVal = JSON.stringify(value);
    localStorage.setItem(key, jsonVal);
}

function loadFromStorage(key) {
    const val = localStorage.getItem(key);
    return JSON.parse(val);
}