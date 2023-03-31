const fs = require('fs-extra')
const Plebbit = require('@plebbit/plebbit-js')
const path = require('path')
const startIpfs = require('./start-ipfs')
const Logger = require('@plebbit/plebbit-logger')
Logger.enable('plebbit-js:*')

const signersPath = path.join(__dirname, 'signers.json')
if (!fs.existsSync(signersPath)) {
  throw Error(`./signers.json doesn't exist, call 'node create-subs' first`)
}
const signers = require(signersPath)
console.log(Object.keys(signers))

const ipfsConfig = {
  apiPort: 45678,
  gatewayPort: 44678,
  args: '--enable-pubsub-experiment --enable-namesys-pubsub',
}

;(async () => {
  try {
    await startIpfs(ipfsConfig)
  }
  catch (e) {
    console.warn(e.message)
  }
  const plebbit = await Plebbit({
    ipfsHttpClientOptions: `http://localhost:${ipfsConfig.apiPort}/api/v0`
  })
  plebbit.on('error', error => console.warn(error.message))
  for (const subplebbitAddress in signers) {
    const subplebbit = await plebbit.createSubplebbit({address: subplebbitAddress})
    await subplebbit.start()
    console.log('started', subplebbit.address, subplebbit.description, subplebbit.settings)
  }

  // start test sub
  const signerPath = path.join(__dirname, 'signer.json')
  if (fs.existsSync(signerPath)) {
    const signer = require(signerPath)
    const subplebbit = await plebbit.createSubplebbit({signer})
    await subplebbit.start()
    console.log('started', subplebbit.title, subplebbit.description, subplebbit.settings)
  } 
})()
