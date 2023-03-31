const fs = require('fs-extra')
const Plebbit = require('@plebbit/plebbit-js')
const path = require('path')
const startIpfs = require('./start-ipfs')
const Logger = require('@plebbit/plebbit-logger')
// Logger.enable('plebbit-js:*')

const signerPath = path.join(__dirname, 'signer.json')
if (!fs.existsSync(signerPath)) {
  throw Error(`./signer.json doesn't exist, call 'node create-sub' first`)
}
const signer = require(signerPath)
console.log(signer.address)

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
  const subplebbit = await plebbit.createSubplebbit({signer})
  await subplebbit.start()
  console.log('started', subplebbit.title, subplebbit.description, subplebbit.settings)
})()
