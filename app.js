'use strict'

//for interacting with telegram
var tg = require('telegram-node-bot')('192089181:AAE01YNBSlL80xnlWDNNSmKFdjOiIhSMCkE');
//for sending HTTP requests
var request = require('request');
//for interacting with the file system
//  (only used for video)
var fs = require('fs');

// lets heroku set the port
var port = process.env.PORT;

//routes each command to its respective controller
tg.router.
	when(['/start'], 'StartController').
	when(['/help'], 'HelpController').
	when(['/ping', 'ping', 'Ping', 'PING'], 'PingController').
	when(['/kitty', '/kitten'], 'KittenController').
	when(['/imgurtag :tag1', '/imgurtag@DurdBot :tag1'], 'ImgurTagController');

//@todo: move this to its own file, export it
//
//this function gets a random imgur image by tag.
//thus, $.query.1 should contain a tag.
//    if it doesn't, just send a kitten!!
var get_image_tag_callback = function ($)
{
	console.log('$.query is ');
	console.log($.query);
	//use imgur API to get a random image by tag
	var client_id = '6cd601bbdda89a5';
	var auth = 'Client-ID ' + client_id;
	var tagname = $.query.tag1 || 'kitten';

	//switch up the page number from time to time
	var url = 'https://api.imgur.com/3/gallery/t/' + tagname + '/top/all/' //+ page_number;

	var options = {
		uri: url,
		headers: {
			Authorization: auth
		}
	};

	//console.log('before callback definition');

	function callback(error, response, body){
		if(error || response.statusCode != 200){
			console.log('request get failed.');
			console.log('error is ' + error);
			$.sendMessage('No image found for that tag...');
			return;
		}
		else{
			var json = JSON.parse(body);
			console.log('json is ');
			console.log(json);
			if(json['data']['items'].length == 0)
			{
				console.log('No image found for that tag...');
				$.sendMessage('No image found for that tag...');
				return;
			}
			var images_and_albums = json['data']['items'];
			var keys = Object.keys(images_and_albums);
			var rand_member = images_and_albums[0];

			do{
				var rand_index = keys[ keys.length * Math.random() << 0];
				rand_member = images_and_albums[rand_index];
				console.log('rand_member is: ');
				console.log(rand_member);
			}while(typeof rand_member == 'undefined' || rand_member['is_album'])

			if(!rand_member['mp4']){
				//image, not video
				var image_url = rand_member['link'];

				if(image_url.indexOf(':\/\/imgur') > -1){
					image_url = image_url.replace('://imgur', '://i.imgur');
					image_url += '.png';
				}

				console.log('image_url is ');
				console.log(image_url);
				$.sendPhotoFromUrl(image_url);
			}
			else{
				//video, not image
				console.log('video, not image');

				if (!fs.existsSync(__dirname + '/temp/')) {
					fs.mkdirSync(__dirname + '/temp/')
				}

				//callback = callback || Function();
				var fileName = Math.random().toString(16) + ".mp4";
				var wstream = fs.createWriteStream(__dirname + '/temp/' + fileName);

				wstream.on('finish', () => {
					var read_stream = fs.createReadStream(__dirname + '/temp/' + fileName);
					read_stream.on('open', () => {
						$.sendVideo(read_stream, function() { fs.unlink(__dirname + '/temp/' + fileName); });
					});
				});

				request.get(rand_member['mp4']).pipe(wstream);	
			}
		}
	}

	request.get(options, callback);
};

//Doesn't do much.
tg.controller('StartController', ($) => {
	var start_message = 'Hi! I\'m DurdenBot. Type /help to see what I can do.';

	tg.for('/start', () => {
		$.sendMessage(start_message)
	});
});

//Displays help message
tg.controller('HelpController', ($) => {
	var help_message = 
		'Type /help to see this message.' + '\n' + 
		'Type /ping for me to reply with "pong!"' + '\n' +
		'Type /kitten for a picture of a kitten!' + '\n' +
		'Type /imgurtag TAG for a picture of something matching the TAG!' + '\n'
		;

	tg.for('/help', () => {
		$.sendMessage(help_message);
	});
});

//Replies with pong!
tg.controller('PingController', ($) => {
	var callback = function() { 
		$.sendMessage('pong!') 
	};

	tg.for('/ping', callback);
	tg.for('ping', callback);
	tg.for('Ping', callback);
	tg.for('PING', callback);

})

//calls function to get picture of kitten
tg.controller('KittenController', ($) => {
	$.query.tag1 = 'kitten';
	tg.for('/kitty',  get_image_tag_callback.bind(tg, $));
	tg.for('/kitten', get_image_tag_callback.bind(tg, $));
});

//calls function to get image of whatever was passed
tg.controller('ImgurTagController', ($) => {
	tg.for('/imgurtag :tag1', get_image_tag_callback.bind(tg, $));
	tg.for('/imgurtag@DurdBot :tag1', get_image_tag_callback.bind(tg, $));
});



console.log("bot started...");
