const { Keyboard } = require('grammy');

const coinKeeperKeyboard = new Keyboard()
    .text('Баланс')
    .text('История')
    .row()
    .text('Добавить деньги')
    .text('Убавить деньги')
    .resized();

module.exports = coinKeeperKeyboard;
