"use strict";
const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout(response => {
        if (response) {
            location.reload();
        }
    })
}

ApiConnector.current(response => {
    if (response.data) {
        ProfileWidget.showProfile(response.data);
    }
})

const ratesBoard = new RatesBoard();
function getCourse() {
    ApiConnector.getStocks(response => {
        if (response) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}
setInterval(getCourse(), 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = data => {
    if (!data.amount || data.currency === undefined) {
        const isSuccess = false;
        moneyManager.errorMessageBlock = moneyManager.setMessage(isSuccess, `Некорректно заполнены данные`);
        return;
    }
    ApiConnector.addMoney(data, response => {
        if (response) {
            ProfileWidget.showProfile(response.data);
            const isSuccess = true;
            moneyManager.errorMessageBlock = moneyManager.setMessage(isSuccess, `Счет пользователя ${response.data.login} успешно пополнен`);
        } 
    });
}
moneyManager.conversionMoneyCallback = data => {
    if (!(data.fromAmount || data.fromCurrency || data.targetCurrency) === undefined) {
        console.log(data.fromAmount);
        console.log(data.fromCurrency);
        console.log(data.targetCurrency);
        const isSuccess = false;
        moneyManager.errorMessageBlock = moneyManager.setMessage(isSuccess, `Некорректно заполнены данные`);
        return;
    }
    ApiConnector.convertMoney(data, response => {
        if (response) {
            ProfileWidget.showProfile(response.data);
            const isSuccess = true;
            moneyManager.errorMessageBlock = moneyManager.setMessage(isSuccess, `Валюта  успешно сконвертирована`);
        }
    });
}
moneyManager.sendMoneyCallback = data => {
    if (!(data.amount || data.to || data.currency) === undefined) {
        const isSuccess = false;
        moneyManager.errorMessageBlock = moneyManager.setMessage(isSuccess, `Некорректно заполнены данные`);
        return;
    }
    ApiConnector.transferMoney(data, response => {
        if (response) {
            ProfileWidget.showProfile(response.data);
            console.log(data);
            const isSuccess = true;
            moneyManager.errorMessageBlock = moneyManager.setMessage(isSuccess, `Деньги успешно отправлены пользователю`);
        }
    })
}

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
});
favoritesWidget.addUserCallback = data => {
    if (!data.id || data.name === undefined) {
        const isSuccess = false;
        favoritesWidget.favoritesMessageBox = favoritesWidget.setMessage(isSuccess, `Некорректно заполнены данные`);
        return;
    }
    ApiConnector.addUserToFavorites(data, response => {
        if (response) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            const isSuccess = true;
            favoritesWidget.favoritesMessageBox = favoritesWidget.setMessage(isSuccess, `Пользователь c ID ${data.id} и именем ${data.name} успешно добавлен в избранное`);
        } 
    });
}
favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response) {         
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            const isSuccess = true;
            favoritesWidget.favoritesMessageBox = favoritesWidget.setMessage(isSuccess, `Пользователь c ID ${data} успешно удален из избранного`);           
        }
    })
}