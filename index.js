const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');
//const JsSIP = require('jssip');
var target = ' ';
const fs = require('fs');

//web socket?
//var socket = new JsSIP.WebSocketInterface('wss://192.168.1.133');

//sip config
/*var configuration = {
  sockets  : [ socket ],
  uri      : 'sip:3723@192.168.1.133',
  password : '1234',
  register : true
};*/


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
  if (message.content.startsWith(`${prefix}play`)) {
    //message.channel.send("You have entered the call comand");
    execute(message);
    return;
  }
  if (message.content.startsWith(`${prefix}stop`)) {
    const voiceChannel = message.member.voice.channel;
    voiceChannel.leave();
    message.channel.send("I have been disconnected from the voice channel.");
  }
  if (message.content.startsWith(`${prefix}help`)) {
    message.channel.send("$help - displays this help message");
    message.channel.send("$about - gives an about message");
    message.channel.send("$play [url] - plays a song with url(only audio files are supported)");
    message.channel.send("$stop - makes Tocando leave the channel");
  }
  if (message.content.startsWith(`${prefix}about`)) {
    message.channel.send("The Tocando bot will play any audio file you have the link to.");
    message.channel.send("To be added: Queue, Youtube support");
    message.channel.send("(c) Alex Kinch 2021");
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
  //message.channel.send("Calling");
  var target = args[1];
  /*var ua = new JsSIP.UA(configuration);
  //start sip connection
  //var connection = await voiceChannel.join();
  voiceChannel.join();
  ua.start();
  ua.call(target);*/
  var connection = await voiceChannel.join();
  const dispatcher = connection.play(target);
  /*const audio = connection.receiver.createStream('448560538142769163', { mode: 'pcm' });
  audio.pipe(fs.createWriteStream('user_audio'));*/
}
