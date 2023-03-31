const fs = require('fs-extra')
const Plebbit = require('@plebbit/plebbit-js')
const path = require('path')
const subplebbitSettings = require('./subplebbit-settings')
const Logger = require('@plebbit/plebbit-logger')
// Logger.enable('plebbit-js:*')

const signersPath = path.join(__dirname, 'signers.json')
const signers = {}

if (fs.existsSync(signersPath)) {
  throw Error(`./signers already exists, subs already created`)
}

;(async () => {
  const plebbit = await Plebbit()
  plebbit.on('error', error => console.warn(error.message))
  for (const settings of subplebbitSettings) {
    console.log(settings)
    const subplebbit = await plebbit.createSubplebbit({
      title: settings.address, 
      description: settings.description, 
      rules: settings.rules,
      settings: {fetchThumbnailUrls: true}
    })
    signers[settings.address] = subplebbit.signer
    await subplebbit.edit({address: settings.address})
    console.log('edited address', subplebbit.address, subplebbit.title, subplebbit.description, subplebbit.settings)
  }
  fs.writeFileSync(signersPath, JSON.stringify(signers))
})()
