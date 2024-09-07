const TelegramApi = require("node-telegram-bot-api")

const token = "6972510603:AAHOk_UP9NasYkQfRJ8rneq9zJ18GY3WA0Q"

const bot = new TelegramApi(token,{polling: true})

const {gameOptions,againOptions,BadWords} = require("./options")

const chats = {}


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
        if (!msg.text) return
        if (msg.from.is_bot) return

        console.log(msg.date)

        const text = msg.text.toLowerCase()
        const chatId = msg.chat.id
        const userId = msg.from.id

    

        if (!chats[chatId]) {
            chats[chatId] = ["я"]
            
            const ChatData = chats[chatId]

            await bot.getChatAdministrators(chatId)
            .then( async users => {
                for (user of users) {
                    if (ChatData.find(value => value === user.user.id)) continue
                    
                    ChatData.push(user.user.id)
                }
            })
            .catch(e => {
                console.error(e)
            })
            
            
        }

        const ChatData = chats[chatId]

        if (!ChatData.find(value => value === userId)) {
            ChatData.push(userId)
        }

        console.log(ChatData)


        //commands

        if (text.startsWith("/start")) {

        }
        if (text.startsWith("/info")) {
            
            return await bot.sendMessage(chatId,"я личный пупсик хомы",{reply_to_message_id: msg.id})
        }
        if (text.startsWith("/game")) {
            
            return await bot.sendMessage(chatId,"хм у меня есть веселая игра! называется какое твое будущее по номеру твоей кредитной карты! Скинь номер карты",{reply_to_message_id: msg.id})
        }

        //non commands

        if (text.match('проверка')) {
            const message = "проверка на натурала:"

            bot.sendMessage(chatId, message)
            .then(msgData=>{
              let count = 0;

              const editMessage = (text) => {
                bot.editMessageText(text, {
                    chat_id: msgData.chat.id,
                    message_id: msgData.message_id
                  }).catch(e => {
                    console.log(e)
                    bot.sendMessage(chatId, "произошла ошибка простите но вы не натурал")
                    clearInterval(timerId);
                  })

              }

              
              const timerId = setInterval(() => {
                  count+= Math.floor((Math.random()*20 + 1));
                  console.log(count)
                  count = Math.min(count,100)

                    editMessage(`${message} ${count}%`)
          

                  if(count>=100){
                    clearInterval(timerId);
                    editMessage(`поздравляю вы натурал!`)
                  }
              }, 1500)
            })

            return
        }
        
        if (text.startsWith("кто")) {
            const data = text.slice(3,text.length).split("").filter(simbol => simbol !== "?" ).join("")

            const user_id = GetRandomElementFrom(ChatData)

            console.log(user_id)

            if (typeof user_id === "number") {

                if (user_id === userId) {
                    await bot.sendMessage(chatId,`ты${data}`)
                    return
                }

                await bot.getChatMember(chatId,user_id).then(async user => {
                    await bot.sendMessage(chatId,`${user.user.first_name}${data}`)
                })
            } else {
                await bot.sendMessage(chatId,`${user_id}${data}`)
            }

            return
        }

        if (text.includes(" или ")) {
            const Variants = text.split("").filter(simbol => simbol !== "?" ).join("").split(" ").filter(piece => piece !== "ты" ).join(" ").split(" или ")
            
            console.log(Variants)

            const Variant = GetRandomElementFrom(Variants)

            await bot.sendMessage(chatId,Variant)

            return
        }

        if (text === "домофон") {
            await bot.sendMessage(chatId,"домофон",gameOptions)

            return
        }

        if (text.startsWith("запомни")) {
            const data = text.slice(7,text.length)

            await bot.sendMessage(chatId,`Хорошо теперь я буду это говорить!`)

            answers.push(data)

            return
        }

        for (bad_word of BadWords) {
            if (text.includes(bad_word)) {
                await bot.sendMessage(chatId,"фу быдло")
                return
            }
        }

        await bot.sendMessage(chatId,GetRandomElementFrom(answers))


    })

    let code = ""

    bot.on("callback_query",async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data == "enter") {
            code = "сломался походу хз лол"
        } else if (data == "clear") {
            code = ""
        } else {
            code = `${code}${data}`
        }
   
        await bot.editMessageText(`домофон ${code}`, {
            chat_id: msg.message.chat.id,
            message_id: msg.message.message_id,
            inline_message_id: msg.inline_message_id
        }).catch(e => {
            console.log(e)
            bot.sendMessage(chatId, "произошла ошибка простите но вы не натурал")
        })
    })

    bot.on("polling_error",err => console.error(err))
}

start()