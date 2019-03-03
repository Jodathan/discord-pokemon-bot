// Import node modules
const Discord = require('discord.js')
const Pokedex = require('pokedex-promise-v2')
// Create discord client
const client = new Discord.Client()
// Create pokedex instance
const P = new Pokedex()

// Will be fired when bot runs
client.on('ready', () => {
  /*
  Iterates over all servers that are connected to the bot.
  If the bot gets online, it will post a message to every general text channel
   */
  let generalChannel = null
  client.guilds.forEach(guild => {
    guild.channels.forEach(channel => {
      const { name, type, id } = channel
      if (name === 'general' && type === 'text') {
        generalChannel = client.channels.get(id)
        generalChannel.send('Hello, I\'m online and ready to go!')
      }
    })
  })
})
// Will be fired when bot receives a message
client.on('message', message => {
  // Prevent bot to reply to own messages
  if (message.author === client.user) return
  // If message is command run process command
  if (message.content.startsWith('!')) processCommand(message)
})

// Set discord bot token
const token = ''
// Run bot
client.login(token)

function processCommand(command) {
  // If command is !random get random pokemon with name and picture
  if (command.content === '!random') sendRandom(command)
}

function sendRandom(message) {
  // Just support the first 151 pokemon
  const nr = Math.floor((Math.random() * 151) + 1)
  // Get pokemon by number
  P.getPokemonByName(nr, (response, error) => {
    if (!error) {
      // Get name and img of pokemon
      const { name, sprites } = response
      const pokemonImg = sprites.front_default
      // Send pokemon name and the attached image
      const img = new Discord.Attachment(pokemonImg)
      message.channel.send(name, { files: [img]})
    } else console.log(error)
  })
}
