const errorMiddleware = (err, req, res, next) => {
    console.log("Error:", err.message);
    console.error(err.stack);
    res.status(500).send({
        message: "Something went wrong",
        error: err.message
    })  
}

module.exports = errorMiddleware