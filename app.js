const express = require("express")
const PORT = parseInt(process.argv[2] || 8080)
const app = express()
const cluster = require("cluster")
const core = require("os")

app.use(express.static('public'))

app.get("/hola", (req, res) => {
    res.send(`Express server on port ${PORT} - PID ${process.pid}`)
})

if(cluster.isMaster) {
    console.log(`Proceso primario con pid ${process.pid}`)
    cluster.fork()
    for(let i = 0; i < core.cpus(); i++) {
        cluster.fork()
    }
} else {
    console.log(`Soy un worker con pid ${process.pid}`)
    app.listen(PORT, () => console.log(`Worker ${process.pid} en el puerto ${PORT}`))
}

app.get("/info", (req, res) => {
    res.send({
      status: "success",
      payload: {
            args: process.argv,
            os: process.platform,
            nodeVersion: process.version,
            memoryUsage: process.memoryUsage(),
            execPath: process.execPath,
            processId: process.pid,
            projectFolder: process.cwd(),
            cores: core.cpus().length
        }
    })
})

app.get("/api/randoms", (req, res) => {
    const calculus = fork("calculus", [req.query.cant])
    calculus.on("message", (data) => {
        res.send({ port: PORT, numbers: data })
    })
})