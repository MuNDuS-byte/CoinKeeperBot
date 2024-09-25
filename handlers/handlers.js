async function getBalance(ctx) {
    await ctx.reply(`У вас остолось ${ctx.session.custom.money} ₽`);
}

// Helper function to reply with history (once it's implemented)
async function showTransactionHistory(ctx) {
    const history = ctx.session.custom.history;
    if (history.length === 0) {
        await ctx.reply('У вас нету историй!');
        return;
    }
    history.map((el) => {
        if (el.type === 'add') {
            return ctx.reply(
                `Вы добавили: ${el.changingMoney}₽\nНа балансе: ${el.money}₽\nВремя изменение:  ${el.time}`
            );
        } else {
            return ctx.reply(
                `Вы убавили: ${el.changingMoney}₽\nНа балансе: ${el.money}₽,\nВремя изменение:  ${el.time}`
            );
        }
    });
}

// Helper function to handle adding or reducing money
async function initiateBalanceChange(ctx) {
    await ctx.conversation.enter('updateBalance');
}

module.exports = {
    getBalance,
    showTransactionHistory,
    initiateBalanceChange,
};
