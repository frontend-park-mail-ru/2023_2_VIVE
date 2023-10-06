import validator from '../modules/validator.js';

export function formIsValid(data, { is_login, is_reg }) {
  let errors = {};
  if (is_reg) {
    errors = validator.validateRegistrationForm(data);
  } else if (is_login) {
    errors = validator.validateAuthForm(data);
  }
  let inputs = document.querySelectorAll('input');
  let isValid = true;
  for (let field in errors) {
    if (errors[field]) {
      isValid = false;
    }
  }

  inputs.forEach((input) => {
    let existErrorNode = input.parentNode.querySelector('.input-error-msg');
    if (errors[input.name]) {
      if (!existErrorNode) {
        let errorNode = document.createElement('div');
        errorNode.classList.add('input-error-msg');
        errorNode.textContent = errors[input.name];
        input.parentNode.appendChild(errorNode);

        input.classList.add('input-in-error');
      } else {
        existErrorNode.textContent = errors[input.name];
      }
    } else {
      if (existErrorNode) {
        input.parentNode.removeChild(existErrorNode);
        input.classList.remove('input-in-error');
      }
    }
  });

  return isValid;
}
