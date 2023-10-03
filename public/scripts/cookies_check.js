'use strict'

function giveInfo(isAuth) {
    if (isAuth) {
        console.log('Пользователь авторизирован');
    } else {
        console.log('Пользователь не авторизирован');
    }
}

async function checkAuth() {
    try {
        const response = await fetch('/session');
        const data = await response.json();

        giveInfo(data.isAuth);
    } catch (error) {
        console.error('Ошибка при проверке аутентификации: ', error);
    }
}

window.addEventListener('load', function() {
    checkAuth();
})
