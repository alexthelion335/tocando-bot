const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
var target = ' ';
const fs = require('fs');


//log in
const client = new Discord.Client();
client.login(token);

//print messages to console
client.once('ready', () => {
 console.log('Ready!');
});
client.once('reconnecting', () => {
 console.log('Reconnecting!');
});
client.once('disconnect', () => {
 console.log('Disconnect!');
});

//read messages
client.on('message', async message => {
  //ignore messages from bot
  if (message.author.bot) return;

  //ignore messages that don't start with prefix
  if (!message.content.startsWith(prefix)) return;

  //play command
  if (message.content.startsWith(`${prefix}play`) || message.content.startsWith(`${prefix}p`)) {
    execute(message);
    return;
  }
  if (message.content.startsWith(`${prefix}stop`)) {
    const voiceChannel = message.member.voice.channel;
    voiceChannel.leave();
    message.channel.send("I have been disconnected from the voice channel.");
  }
  if (message.content.startsWith(`${prefix}help`)) {
    message.channel.send("$help - displays this help message\n$about - gives an about message\n$play [url] - plays a song with url(only audio files and YouTube links are supported) or searches YouTube for the song\n$stop - makes Tocando leave the channel");
  }
  if (message.content.startsWith(`${prefix}about`)) {
    message.channel.send("The Tocando bot will play any audio file you have the link to.\nTo be added: Queue\nTocando-Bot v1.2\n(c) Alex Kinch 2021");
  }
})

async function execute(message) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    return message.channel.send("You need to be in a voice channel!");
  }
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    message.channel.send("I need to have permissions to join and speak!");
    return;
  }

  var url = args[1];

    var connection = await voiceChannel.join();
    
    if (url.includes("youtube") || url.includes("youtu.be")) {
	const dispatcher = connection.play(await ytdl(url), { type: 'opus' });
    } else if (url.includes("http")) {
    	const dispatcher = connection.play(url);
    } else {
	//remove the first item from the array ($play)
	args.shift();
	//change array into string with spaces in between
	const videoUrl = await ytsr(args.join(" "));
	//get youtube dl link for the first item in the search results
	const search = await ytdl(videoUrl.items[0].url);
	const dispatcher = connection.play(search);
	message.channel.send("Now Playing: " + videoUrl.items[0].url);
    }
	
}
