const posts = require("../db.js")
const fs = require("fs")
const connection = require("../data/connection.js")
const { error } = require("console")

/* const index = (req, res) => {
    let list = "";
    for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        let markup = `
        <ul>
            <li>
                <h3>${post.title}</h3>
                <img src= "./imgs/posts/${post.image}">
                <p>${post.content}</p>
                <p>${post.tags}</p>
            </li>
        </ul>
    `
        list += markup;
    }
    res.send(list)
} */

function index(req, res) {
    const sql = "SELECT * FROM posts"
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database query failed" })
        res.json(results);
    });
}

function destroy(req, res) {

    const { title } = req.params;
    connection.query("DELETE FROM posts WHERE title = ?", [title], (err) => {
        if (err) return res.status(500).json({ error: "Post non eliminato!" })
        res.sendStatus(204);
    });
}

function show(req, res) {
    const { id } = req.params;
    connection.query("SELECT * FROM posts WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database query failed" });
        if (results.length === 0) return res.status(404).json({ error: "Post non trovato!" })
        res.json(results[0])
    })
}

/* const show = (req, res) => {

    const post = posts.find(post => post.slug.toLowerCase() === (req.params.slug))
    console.log(post);
    if (!post) {
        return res.status(404).json({
            error: `404! Not found!`
        })
    }

    res.json({
        data: post
    })
} */

const store = (req, res) => {
    const post = {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    }
    posts.push(post)
    fs.writeFileSync("./db.js", `module.exports = ${JSON.stringify(posts, null, 4)}`)
    return res.status(200).json({
        status: 200,
        data: posts,
    })
}

const update = (req, res) => {
    const post = posts.find(post => post.slug.toLowerCase() === req.params.slug)
    if (!post) {
        return res.status(404).json({
            errore: `Nessuna ricetta trovata con il nome ${slug}`
        })
    }
    post.title = req.body.title
    post.slug = req.body.slug
    post.content = req.body.content
    post.image = req.body.image
    post.tags = req.body.tags
    fs.writeFileSync("./db.js", `module.exports = ${JSON.stringify(posts, null, 4)}`)
    return res.status(200).json({
        status: 200,
        data: posts
    })
}

/* const destroy = (req, res) => {
    const post = posts.find(post => post.slug.toLowerCase() === req.params.slug)
    if (!post) {
        return res.status(404).json({
            errore: `Nessuna ricetta trovata con il nome ${slug}`
        })
    }
    const newPosts = posts.filter(post => post.slug !== req.params.slug)
    fs.writeFileSync("./db.js", `module.exports = ${JSON.stringify(newPosts, null, 4)}`)
    return res.status(200).json({
        status: 200,
        data: newPosts
    })
} */



module.exports = {
    index,
    show,
    store,
    update,
    destroy
}