let quantity = parseInt(process.argv[2]) || 100000000
const result = {}

for (let i = 0; i < quantity; i++) {
  let randomNum = Math.floor(Math.random() * 1000)
  result[randomNum] = result[randomNum] ? result[randomNum] + 1 : 1
}

process.send(result)