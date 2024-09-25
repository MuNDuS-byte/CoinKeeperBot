async function updateBalance(conversation, ctx) {
    const command = ctx.message.text;
    if (command === 'Добавить деньги') {
        await ctx.reply('Напишите, сколько денег вы хотите добавить на баланс');
        const addMoney = await conversation.form.number();
        if (addMoney < 0) {
            await ctx.reply('Вводное цисло не должно быть меньше 0');
            return;
        }
        conversation.session.custom.money = Number(
            conversation.session.custom.money + addMoney
        );
        conversation.session.custom.history[
            conversation.session.custom.history.length
        ] = {
            money: conversation.session.custom.money,
            changingMoney: addMoney,
            time: new Date(),
            type: 'add',
        };
        await ctx.reply(
            `Вы добавили ${addMoney}₽ на свой баланс. Теперь у вас ${conversation.session.custom.money.toString()}₽`
        );
        return;
    }
    if (command === 'Убавить деньги') {
        await ctx.reply('Напишите, сколько денег вы хотите снять с баланса');
        const reduceMoney = await conversation.form.number();
        if (reduceMoney < 0) {
            await ctx.reply('Вводное цисло не должно быть меньше 0');
            return;
        }
        if (reduceMoney > conversation.session.custom.money) {
            await ctx.reply('Вводное цисло не должно быть меньше баланса');
            return;
        }
        conversation.session.custom.money = Number(
            conversation.session.custom.money - reduceMoney
        );
        conversation.session.custom.history[
            conversation.session.custom.history.length
        ] = {
            money: conversation.session.custom.money,
            changingMoney: reduceMoney,
            time: new Date(),
            type: 'reduce',
        };
        await ctx.reply(
            `Вы убавили ${reduceMoney}₽ с вашего баланса. Теперь у вас осталось ${conversation.session.custom.money.toString()}₽`
        );
        return;
    }
}

module.exports = {
    updateBalance,
};
