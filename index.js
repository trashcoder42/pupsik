const TelegramApi = require("node-telegram-bot-api")

const token = "6972510603:AAHOk_UP9NasYkQfRJ8rneq9zJ18GY3WA0Q"

const bot = new TelegramApi(token,{polling: true})

const {gameOptions,againOptions} = require("./options")

const chats = []

const GameStart = async chat_id => {
    const random = Math.floor(Math.random() * 10)
    chats[chat_id] =  random

    await bot.sendMessage(chat_id,`играй`,gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: "/info",description: "hehe"},
        {command: "/start",description: "privet"},
        {command: "/game",description: "game"},
    ])
    
    bot.on("message",async msg => {
        const text = msg.text
        const chatId = msg.chat.id
    
        if (text == "/info") {
            await bot.sendSticker(chatId,"https://sl.combot.org/jansqualityshit/webp/1xe298baefb88f.webp")
            await bot.sendMessage(chatId,`Пошел в попе ${msg.from.first_name}  ${msg.from.last_name}`)
        } else if (text == "/start") {
            await bot.sendMessage(chatId,`Пошел в попе`)
        }  else if (text == "/game") {
            await GameStart(chatId)
        } else {
            await bot.sendMessage(chatId,`не пон`)
        }
    })
1
    bot.on("callback_query",async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id


        if (data == "/again") {
            await GameStart(chatId)
        }

        if (data == chats[chatId]) {
           await bot.sendMessage(chatId,"уганда",againOptions)
        } else {
            await bot.sendMessage(chatId,"не уганда",againOptions)
        }
    })

    bot.on("polling_error",err => console.error(err))
}

start()