'use strict'

var tg = require('telegram-node-bot')('192089181:AAE01YNBSlL80xnlWDNNSmKFdjOiIhSMCkE')

// lets heroku set the port
var port = process.env.PORT

tg.router.
	when(['/start'], 'StartController').
	when(['/help'], 'HelpController').
	when(['/ping', 'ping', 'Ping', 'PING'], 'PingController')

tg.controller('StartController', ($) => {
	var start_message = "Hi! I'm DurdenBot. Type /help to see what I can do. "

	tg.for('/start', () => {
		$.sendMessage(start_message)
	})
})

tg.controller('HelpController', ($) => {
	var help_message = "Type /help to see this message.\n"

	tg.for('/help', () => {
		$.sendMessage(help_message)
	})
})

tg.controller('PingController', ($) => {
	var callback = () => { $.sendMessage('pong!') }

	tg.for('/ping', callback)
	tg.for('ping', callback)
	tg.for('Ping', callback)
	tg.for('PING', callback)
	
})

console.log("bot started...");
