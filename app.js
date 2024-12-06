const express = require("express")
const app = express()
const postRouter = require("./routers/posts.js")
const notFoundMiddleware = require("./middlewares/notFound.js")
const loggerMiddleware = require("./middlewares/logger.js")
const errorMiddleware = require("./middlewares/error.js")
const cors = require('cors');
app.use(cors());
app.use(express.json())
app.use(express.static('public'))

const HOST = process.env.HOST
const PORT = process.env.PORT

app.listen(PORT, (req, res) => {
    console.log(`Server is running at ${HOST}:${PORT}`);
})

const posts = require("./db.js")
app.get("/", (req, res) => {
    const responseData = {
        data: posts,
        counter: posts.length
    }

    res.status(200).json(responseData)
})



/* app.use("/posts", (req, res, next) => {
    throw new Error("You broke everything...")
    
}); */

app.use(loggerMiddleware)

app.use("/posts", postRouter)
app.use("/", (req, res) => {
    res.send("Ciao!")
})


app.use(notFoundMiddleware)

app.use(errorMiddleware)

