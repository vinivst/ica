const minNumPart = require('.') /* the current working directory so that means main.js because of package.json */
let theFile = process.argv[2] /* what the user enters as first argument */
let seed = process.argv[3]

console.log(
    minNumPart(theFile, seed)
)