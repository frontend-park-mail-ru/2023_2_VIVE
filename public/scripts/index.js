const navElement = document.querySelector('#nav');
const mainElement = document.querySelector('#main');
const footerElement = document.querySelector('#footer');

navElement.innerHTML = `
<nav>
    <div>
        <h1 class="dodger-blue logo">H&H</h1>
    </div>
    <div class="infoblock">
        <div class="ms-10 me-10">
            <p class="default-text">О нас</p>
        </div>
        <div class="ms-10 me-10">
            <p class="default-text">Как это работает</p>
        </div>
        <div class="ms-10 me-10">
            <p class="default-text">Вакансии</p>
        </div>
    </div>
    <div>
        <a href="#" class="transparent-button" data-section="nav_in">Уже есть аккаунт</a>
        <a href="#" class="fully-button" data-section="nav_reg">Зарегистрироваться</a>
    </div>
</nav>`;

footerElement.innerHTML = `
<footer>
        <div class="footer-content">
            <div class="top-footer">
                <div>
                    <p class="footer-text x-large-font">Найди работу</p>
                    <p class="footer-text x-large-font">Своей мечты здесь</p>
                </div>
                <div>
                    <button class="footer-button">Создать резюме</button>
                </div>
            </div>
            <div class="footer-divider"></div>
            <div class="footer-content">
                <p class="footer-text">Hunt & Hire</p>
                <p class="footer-text font-weight-100 small-font">Найти работу своей мечты теперь проще чем когда-либо</p>
            </div>
        </div>
    </footer>
`;

const navLoginLink = document.querySelector("[data-section='nav_in']");
navLoginLink.addEventListener('click', (e) => {
    e.preventDefault();

    mainElement.innerHTML = `
        <main id="main-content">
            <div class="reg-form">
                <span class="default-text x-large-font">Войти</span>
                <div class="d-flex">
                    <span class="reg-text me-10">Найти работу</span>
                    <a href="#" class="elipse-button" data-section="emp_in">
                        <div class="circle"></div>
                    </a> 
                    <span class="reg-text ms-10">Найти сотрудников</span>
                </div>  
                <div class="input">
                    <input type="text" class="input-in" id="email" placeholder="Электронная почта">
                </div>
                <div class="input">
                    <input type="password" class="input-in" id="password" placeholder="Пароль">
                </div>
                <label for="rememberPassword" class="remember-label">
                    <input type="checkbox" id="rememberPassword" class="remember-checkbox">
                    <span class="reg-text small-font">Запомнить пароль</span>
                </label>
                <div class="form-actions">
                    <a href="#" class="fully-button side-m-0">Войти</a>
                    <a href="#" class="transparent-button side-m-0" data-section="app_reg">Зарегистрироваться</a>
                </div>
            </div>
        </main>
    `;
});


const navRegLink = document.querySelector("[data-section='nav_reg']");
navRegLink.addEventListener('click', (e) => {
    e.preventDefault();

    mainElement.innerHTML = `
        <main id="main-content">
            <div class="reg-form">
                <span class="default-text x-large-font">Регистрация</span>
                <div class="d-flex">
                    <span class="reg-text me-10">Найти работу</span>
                    <a href="#" class="elipse-button" data-section="emp_reg">
                        <div class="circle"></div>
                    </a>
                    <span class="reg-text ms-10">Найти сотрудников</span>
                </div> 
                <div class="input">
                    <input type="text" class="input-in" id="name" placeholder="Имя">
                </div>
                <div class="input">
                    <input type="text" class="input-in" id="surname" placeholder="Фамилия">
                </div>
                <div class="input">
                    <input type="text" class="input-in" id="email" placeholder="Электронная почта">
                </div>
                <div class="input">
                    <input type="password" class="input-in" id="password" placeholder="Придумайте пароль">
                </div>
                <div class="input">
                    <input type="text" class="input-in" id="repeat_password" placeholder="Повторите пароль">
                </div>
                <label for="rememberPassword" class="remember-label">
                    <input type="checkbox" id="rememberPassword" class="remember-checkbox"> <span class="reg-text small-font">Запомнить пароль</span>
                </label>
                <div class="form-actions">
                    <a href="#" class="fully-button side-m-0">Зарегистрироваться</a>
                    <a href="#" class="transparent-button side-m-0" data-section="app_in">Уже есть аккаунт</a>
                </div>
            </div>
        </main>
    `;
});
