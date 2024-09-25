require('dotenv').config();
const { Bot, GrammyError, HttpError, session } = require('grammy');
const {
    conversations,
    createConversation,
} = require('@grammyjs/conversations');
const coinKeeperKeyboard = require('./Keyboard');
const { updateBalance } = require('./conversationsFn');
const {
    getBalance,
    showTransactionHistory,
    initiateBalanceChange,
} = require('./handlers/handlers');
const { freeStorage } = require('@grammyjs/storage-free');

const bot = new Bot(process.env.TOKEN);

bot.use(
    session({
        type: 'multi',
        custom: {
            initial: () => ({ money: '0', history: [] }),
            storage: freeStorage(process.env.TOKEN),
        },
        conversation: {},
    })
);
bot.use(conversations());

bot.use(createConversation(updateBalance));

bot.command('start', async (ctx) => {
    await ctx.reply(
        'Здравствуй, мой дорогой друг. Я помогу тебе разобраться с финансами. Ты сможешь записывать свои доходы и расходы, проверять баланс, а также просматривать историю операций.',
        {
            reply_markup: coinKeeperKeyboard,
        }
    );
});

bot.hears(
    ['Баланс', 'История', 'Добавить деньги', 'Убавить деньги'],
    async (ctx) => {
        const command = ctx.message.text;

        // Define a mapping between commands and their handlers
        const commandHandlers = {
            Баланс: getBalance,
            История: showTransactionHistory,
            'Добавить деньги': initiateBalanceChange,
            'Убавить деньги': initiateBalanceChange,
        };

        // Call the appropriate handler based on the user's command
        if (commandHandlers[command]) {
            await commandHandlers[command](ctx);
        }
    }
);

bot.on('message', async (ctx) => {
    await ctx.reply('Неверный ввод. Попробуйте снова!', {
        reply_parameters: { message_id: ctx.msg.message_id },
    });
});

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error('Error in request:', e.description);
    } else if (e instanceof HttpError) {
        console.error('Could not contact Telegram:', e);
    } else {
        console.error('Unknown error:', e);
    }
});

bot.start();
