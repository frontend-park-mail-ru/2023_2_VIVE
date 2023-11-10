import validator from '../modules/validator.js';

/**
 * Функция для проверки формы на валидность
 * @param {Object} data - объект с данными полей
 * @param {boolean} is_login - если форма для входа
 * @param {boolean} is_reg - если форма для регистрации
 * @returns {boolean} true, если формула валидна, false иначе
 */
export function formIsValid(form, data, { is_login, is_reg }) {
  let errors = {};

  const inputs = form.querySelectorAll('.input');
  let isValid = true;
  for (let field in errors) {
    if (errors[field]) {
      isValid = false;
    }
  }

  inputs.forEach((input) => {
    const input_name = input.getAttribute('for')
    const error_node = input.querySelector('.input__error-msg')
    if (errors[input_name]) {
      if (!error_node.classList.contains('d-none')) {
        error_node.classList.remove('d-none');
        input.classList.add('input_error');
      }
      error_node.textContent = errors[input_name];
    } else {
      if (!error_node.classList.contains('d-none')) {
        error_node.classList.add('d-none');
        input.classList.remove('input_error');
      }
    }
  });

  return isValid;
}
