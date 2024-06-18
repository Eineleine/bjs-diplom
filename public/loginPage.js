"use strict";
const userForm = new UserForm();
userForm.loginFormCallback = data => {
    ApiConnector.login(data, response => {
        if (response.success) {
            location.reload();
        } else {
            userForm.loginErrorMessageBox = userForm.setLoginErrorMessage(`Неверно указан логин или пароль`);
        }
    } );  
}

userForm.registerFormCallback = data => {
    ApiConnector.register(data, response => {
        if (!data.password) {
            userForm.registerErrorMessageBox = userForm.setRegisterErrorMessage(`Вы не указали пароль!`);
            return;
        }

        if (response.success) {
            location.reload();
        } else {
            userForm.registerErrorMessageBox = userForm.setRegisterErrorMessage(`Пользователь с логином ${data.login} уже зарегистрирован!`);
            return;
        }
    });
}