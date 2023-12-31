import router from "../modules/router/router.js";
import profileStore from '../stores/profileStore.js';
import { getFormObject } from '../utils.js';
import mainView from './mainView.js';
import Handlebars from 'handlebars';

export default class profileView extends mainView {
  constructor() {
    super();
    this.errorTimeoutsId = [];
  }

  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    await super.render();

    if (screen.width < 768) {
      const footer = document.querySelector("footer");
      if (footer !== null) {
        footer.remove();
      }
    }

    // eslint-disable-next-line no-undef
    const template = require('@pages/profile.handlebars');
    document.querySelector('main').innerHTML = template(this.getFullContext({
      form_error: profileStore.form_error,
      errors: profileStore.errors,
      state: profileStore.state,
      user: profileStore.user,
      data: profileStore.data,

    }));

    profileStore.update();

    this.addEventListeners();
  }

  /*
   * Метод, добавляющий обработчики событий на страницу
   */
  addEventListeners() {
    super.addEventListeners();

    const profileButtons = document.querySelectorAll('.profile__btn');
    const settingButtons = document.querySelectorAll('[data-name="changing"]');
    const cancelButtons = document.querySelectorAll('[data-name="cancel-changing"]');
    const sendButtons = document.querySelectorAll('[data-name="send-form"]');

    profileButtons.forEach(button => {
      button.addEventListener('click', () => {
        const buttonName = button.getAttribute('data-name');
        this.state = buttonName;
        router.goToLink(`/profile/${buttonName}`)
      });
    });

    settingButtons.forEach(button => {
      button.addEventListener('click', () => {
        const buttonName = button.getAttribute('type');
        const changingBlock = document.querySelector(`[data-name="changing-${buttonName}"]`);
        const nonVisibleBlock = document.querySelector(`[data-name="setting-${buttonName}"]`);
        changingBlock.classList.remove('ch-i__d-none');
        nonVisibleBlock.classList.add('ch-i__d-none');
      });
    });

    cancelButtons.forEach(button => {
      button.addEventListener('click', () => {
        router.goToLink('/profile/settings');
      });
    });

    sendButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const changingFullNameForm = button.closest('.changing-inpute');
        const fields = changingFullNameForm.querySelectorAll('input');
        const type = fields[0].getAttribute('name');

        if (profileStore.checkForm(fields, type)) {
          if (!await profileStore.sendData(fields)) {
            this.render();
          }
        } else {
          this.render();
        }
      });
    });

    // Загрузка аватарок



    const avatar_input = document.querySelector('.js-avatar-input');
    const avatar_img = document.querySelector('.js-avatar-image');
    const max_size = 2097152; // 2MB
    // const max_size = 1;
    const form = document.querySelector('.js-avatar-form');

    avatar_input.addEventListener('change', async (event) => {
      const file = avatar_input.files[0];
      // // console.log(`размер изображения: ${file.size / 1024 / 1024} MB`);
      if (file.size > max_size) {
        this.setError(`Размер файла не должен превышать ${max_size / 1024 / 1024} MB`);
      } else {

        let form_data = new FormData(form);
        const file = form_data.get('avatar');
        const url = URL.createObjectURL(file);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const image = new Image();
        image.src = url;
        image.onload = async (event) => {
          canvas.width = image.width;
          canvas.height = image.height;

          ctx.drawImage(image, 0, 0);

          const webpImage = canvas.toDataURL('image/webp');

          const resp = await fetch(webpImage);
          const webp_blob = await resp.blob();
          const webp_file = new File([webp_blob], file.name + ".webp", { type: webp_blob.type })
          // // // console.log(webp_file);
          form_data.set('avatar', webp_file);

          if (!await profileStore.sendAvatar(form_data)) {
            this.setError('Ошибка сохранения изображения')
          } else {
            // // console.log("ok!");
            avatar_img.src = URL.createObjectURL(webp_blob);
          }
        }
      }
    })

  }

  setError(message) {
    const push_error = document.querySelector('.push__error');

    this.errorTimeoutsId.forEach((errorTimeOutId) => {
      clearTimeout(errorTimeOutId);
    })

    push_error.innerHTML = message;
    push_error.classList.add('push__error_active');
    push_error.classList.remove('push__error_deactive')

    this.errorTimeoutsId.push(setTimeout(() => {
      push_error.classList.add('push__error_deactive');
      push_error.classList.remove('push__error_active')
      this.errorTimeoutsId.pop();
    }, 3000));
  }

  async updateInnerData(data) {
    return profileStore.updateInnerData(data);
  }
}
