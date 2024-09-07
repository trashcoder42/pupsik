const TelegramApi = require("node-telegram-bot-api")
const { DefaultAnswers, BadWords } = require("./options")

const print = console.log
const error = error => console.log("\x1b[31m", "Exception: ", error, "\x1b[0m")

const token = "6972510603:AAHOk_UP9NasYkQfRJ8rneq9zJ18GY3WA0Q"
const botId = +token.split(":")[0]
const options = {
    polling: true
}

class Bot extends TelegramApi {

    chats = {}

    editMessageEntry(msg) {
        return async (text) => await this.editMessageText(text, {
                chat_id: msg.chat.id,
                message_id: msg.message_id
        })
    }

    async onMessage(msg) {

        let text = msg.text.toLowerCase()
        const chatId = msg.chat.id
        const userId = msg.from.id

        const chatUsers = this.chats[chatId]

        //commands

        if (text.startsWith("/start")) {

        }
        if (text.startsWith("/info")) {
            return this.sendMessage(chatId,"я личный пупсик хомы",{reply_to_message_id: msg.id})
        }
        if (text.startsWith("/game")) {
            return this.sendMessage(chatId,"хм у меня есть веселая игра! называется какое твое будущее по номеру твоей кредитной карты! Скинь номер карты",{reply_to_message_id: msg.id})
        }

        //Text commands        
        if (text.startsWith("кто")) {
            text = text.slice(3)

            const data = text.remove("?")
            const user_id = chatUsers.random()

            let userName = user_id

            if (userId == user_id) {
                userName = "ты"
            } else if (typeof user_id === "number") {
                userName = await this.getChatMember(chatId,user_id).user.first_name
            }

            return this.sendMessage(chatId,`${userName}${data}`)
        }
        if (text.startsWith("запомни")) {
            text = text.slice(7)
            DefaultAnswers.push(text)
            return this.sendMessage(chatId,`Хорошо теперь я буду это говорить!`)
        }
        if (text.startsWith('проверка')) {
            const message = "проверка на натурала:"


            const msg = await this.sendMessage(chatId, message)

            let count = 0;

            const editMessage = this.editMessageEntry(msg)

            const timerId = setInterval(() => {
                if(count>=100){
                    clearInterval(timerId);
                    editMessage(`поздравляю вы натурал!`)
                }

                count+= Math.floor(Math.random()*20 + 1);
                console.log(count)
                count = Math.min(count,100)

                editMessage(`${message} ${count}%`)
            }, 1500)

            return
        }
        if (text.includes(" или ")) {
            const Variants = text.remove("что лучше","ты","?").split(" или ")
            const Variant = Variants.random()

            return this.sendMessage(chatId,Variant)
        }

        for (const bad_word of BadWords) {
            if (text.includes(bad_word)) {
                return this.sendMessage(chatId,"фу быдло")
            }
        }
        
        return this.sendMessage(chatId,DefaultAnswers.random())
    }

    constructor() {
        super(token,options)

        const startDate = Math.floor(Date.now() / 1000) // in seconds

        this.on("message",async msg => {
            if (!msg.text || msg.from.is_bot || msg.date < startDate || msg.chat.type === "private") return
            
            const text = msg.text.toLowerCase()
            const chatId = msg.chat.id
            const userId = msg.from.id


            
            if (!this.chats[chatId]) {
                this.chats[chatId] = ["я"]

                const chatUsers = this.chats[chatId]

                const users = await this.getChatAdministrators(chatId)

                for (const user of users) {
                    if (chatUsers.find(value => value === user.user.id)) continue
                    
                    chatUsers.push(user.user.id)
                } 
            }
    
            const chatUsers = this.chats[chatId]
    
            if (!chatUsers.includes(userId)) {
                chatUsers.push(userId)
            }
            
            this.onMessage(msg)
        }) 

        this.on("callback_query",async msg => {
            const data = msg.data
            const chatId = msg.message.chat.id
    
            if (data == "enter") {
                code = "сломался походу хз лол"
            } else if (data == "clear") {
                code = ""
            } else {
                code = `${code}${data}`
            }
        })

        this.on("polling_error",error)

        this.on('uncaughtException',error);
        
        this.on('unhandledRejection',error);
    }
}

module.exports = Bot