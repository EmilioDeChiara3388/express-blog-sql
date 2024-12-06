const posts = require("../db.js")
const fs = require("fs")

const index = (req, res) => {
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
}

const show = (req, res) => {

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
}

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

const destroy = (req, res) => {
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
}


module.exports = {
    index,
    show,
    store,
    update,
    destroy
}