const path = require('path')
const signersPath = path.join(__dirname, 'signers.json')
const signers = require(signersPath)

for (const subplebbitAddress in signers) {
  console.log(subplebbitAddress, signers[subplebbitAddress].address)
}
