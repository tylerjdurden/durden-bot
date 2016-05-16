'use strict'

var tg = require('telegram-node-bot')('192089181:AAE01YNBSlL80xnlWDNNSmKFdjOiIhSMCkE')
var request = require('request')

// lets heroku set the port
var port = process.env.PORT

tg.router.
	when(['/start'], 'StartController').
	when(['/help'], 'HelpController').
	when(['/ping', 'ping', 'Ping', 'PING'], 'PingController').
	when(['/kitty', '/kitten'], 'KittenController')

tg.controller('StartController', ($) => {
	var start_message = 'Hi! I\'m DurdenBot. Type /help to see what I can do.';

	tg.for('/start', () => {
		$.sendMessage(start_message)
	})
})

tg.controller('HelpController', ($) => {
	var help_message = 
		'Type /help to see this message.' + '\n' + 
		'Type /ping for me to reply with "pong!"' + '\n';

	tg.for('/help', () => {
		$.sendMessage(help_message);
	})
})

tg.controller('PingController', ($) => {
	var callback = function() { $.sendMessage('pong!') };

	tg.for('/ping', callback);
	tg.for('ping', callback);
	tg.for('Ping', callback);
	tg.for('PING', callback);
	
})

tg.controller('KittenController', ($) => {
	function get_kitten()
	{
		//use imgur API to get a random image of a kitten.
		var client_id = '6cd601bbdda89a5';
		var auth = 'Client-ID ' + client_id;
		var random_page_number = Math.floor(Math.random() * 3); //[0, 1, 2]
		var url = 'https://api.imgur.com/3/gallery/search/viral/' + ((random_page_number == 0) ? "" : random_page_number);

		var options = {
			uri: url,
			qs: { q_any: 'kitten kitty kittens kitties', q_all: '', qs: 'thumbs' },
			headers: {
				Authorization: auth
			}
		};

		function callback(error, response, body){
			if(error || response.statusCode != 200){
				console.log('request get failed.');
				console.log('error is ' + error);
			}
			else{
				var json = JSON.parse(body);

				var keys = Object.keys(json['data']);
				var rand_member = json['data'][keys[ keys.length * Math.random() << 0]];
				$.sendMessage(rand_member['link']);
			}
		}
	}

	tg.for('/kitty',  get_kitten);
	tg.for('/kitten', get_kitten);
})


console.log("bot started...");
