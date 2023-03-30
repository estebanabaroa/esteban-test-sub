const fs = require('fs-extra')
const Plebbit = require('@plebbit/plebbit-js')
const path = require('path')
const startIpfs = require('./start-ipfs')
const Logger = require('@plebbit/plebbit-logger')
Logger.enable('plebbit-js:*')

const signerPath = path.join(__dirname, 'signer.json')
if (!fs.existsSync(signerPath)) {
  throw Error(`./signer.json doesn't exist, call 'node create-sub' first`)
}
const signer = require(signerPath)
console.log(signer)

const ipfsConfig = {
  apiPort: 45678,
  gatewayPort: 44678,
  args: '--enable-pubsub-experiment --enable-namesys-pubsub',
}

;(async () => {
  await startIpfs(ipfsConfig)
  const plebbit = await Plebbit({
    ipfsHttpClientOptions: `http://localhost:${ipfsConfig.apiPort}/api/v0`
  })
  const subplebbit = await plebbit.createSubplebbit({signer})
  await subplebbit.start()
})()
