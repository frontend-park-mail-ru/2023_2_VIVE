'use strict'

const loadedContent = {};

async function loadContent(url='/templates/employer_reg.html') {
    try {
        if (!loadedContent[url]) {
            const response = await fetch(url);
            loadedContent[url] = await response.text();
        }
        document.getElementById('main-content').innerHTML = loadedContent[url];
    } catch (error) {
        console.error('Ошибка загрузки содержимого:', error);
    }
}

window.onload = loadContent();
