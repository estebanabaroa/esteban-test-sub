const fs = require('fs-extra')
const Plebbit = require('@plebbit/plebbit-js')
const path = require('path')
const Logger = require('@plebbit/plebbit-logger')
// Logger.enable('plebbit-js:*')

const signerPath = path.join(__dirname, 'signer.json')

if (fs.existsSync(signerPath)) {
  throw Error(`./signer.json already exists, sub already created`)
}

;(async () => {
  const plebbit = await Plebbit()
  plebbit.on('error', error => console.warn(error.message))
  const subplebbit = await plebbit.createSubplebbit({
    title: `Esteban's test sub`, 
    description: 'Publish tests here.',
    settings: {fetchThumbnailUrls: true}
  })
  fs.writeFileSync(signerPath, JSON.stringify(subplebbit.signer))
  console.log('created', subplebbit.address, subplebbit.title, subplebbit.description, subplebbit.settings)
})()
