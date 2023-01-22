const jwt = require("jsonwebtoken")
const express = require(`express`)
const cors = require(`cors`)
const app = express()

app.use(cors())
app.use(express.json())
app.listen(5000, console.log(`Servidor arriba!`))

const { verificarCredenciales, registrarUsuario, getUser } = require(`./consultas`)

app.use((req, res, next) => {
    const parametros = req.params;
    const method = req.method
    const url = req.url;
    console.log(`
    Hoy ${new Date()}
    Se ha recibido una consulta en la ruta ${url}
    con los parámetros: `, parametros)
    if ((url === "/usuarios" || url === "/usuarios") && method === "POST") {
        const { password, email } = req.body
        if (!password || !email) {
            res.status(400).send(error)
        }
    }
    console.log({ url })
    return next();
});

//register user
app.post("/usuarios", async (req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.send("Usuario creado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})

// get user
app.get("/usuarios", async (req, res) => {
    try {
        const token = req.headers['authorization'].replace('Bearer ', '')
        const { email } = jwt.decode(token)
        const user = await getUser(email);
        res.json(user)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, "churro", { expiresIn: 60 })
        res.send(token)
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})