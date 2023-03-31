const fs = require('fs-extra')
const Plebbit = require('@plebbit/plebbit-js')
const path = require('path')
const startIpfs = require('./start-ipfs')
const Logger = require('@plebbit/plebbit-logger')
// Logger.enable('plebbit-js:*')

const signersPath = path.join(__dirname, 'signers.json')
if (!fs.existsSync(signersPath)) {
  throw Error(`./signers.json doesn't exist, call 'node create-subs' first`)
}
const signers = require(signersPath)
console.log(Object.keys(signers))

;(async () => {
  const plebbit = await Plebbit()
  plebbit.on('error', error => console.warn(error.message))
  for (const subplebbitAddress in signers) {
    const subplebbit = await plebbit.createSubplebbit({address: subplebbitAddress})
    await subplebbit.edit({title: undefined})
    console.log('edited', subplebbit.title, subplebbit.description, subplebbit.settings)
  }

  {
    const subplebbit = await plebbit.createSubplebbit({address: 'movies-tv-anime.eth'})
    await subplebbit.edit({title: 'movies/TV/anime', description: 'Anything related to movies, TV, anime'})
    console.log('edited', subplebbit.title, subplebbit.description, subplebbit.settings)
  }

  {
    const subplebbit = await plebbit.createSubplebbit({address: 'business-and-finance.eth'})
    await subplebbit.edit({title: '/biz/'})
    console.log('edited', subplebbit.title, subplebbit.description, subplebbit.settings)
  }

  {
    const subplebbit = await plebbit.createSubplebbit({address: 'politically-incorrect.eth'})
    await subplebbit.edit({title: '/pol/'})
    console.log('edited', subplebbit.title, subplebbit.description, subplebbit.settings)
  }

  const signerPath = path.join(__dirname, 'signer.json')
  if (fs.existsSync(signerPath)) {
    const signer = require(signerPath)
    const subplebbit = await plebbit.createSubplebbit({address: signer.address})
    await subplebbit.edit({title:'Test sub'})
    console.log('edited', subplebbit.title, subplebbit.description, subplebbit.settings)
  } 
})()
