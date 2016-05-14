
/*
var express = require('express'),
  config = require('./config/config');

var app = express();

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});
*/

var tg = require('telegram-node-bot')('192089181:AAE01YNBSlL80xnlWDNNSmKFdjOiIhSMCkE')

tg.router.
	when(['/start'], 'StartController').
	when(['/help'], 'HelpController').
	when(['ping'], 'PingController')

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
	tg.for('ping', () => {
		$.sendMessage('pong')	
	})
})

