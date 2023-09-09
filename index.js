// BLOG SERVER
import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";


const app = express();
const port = 3000;

// MIDDLEWARES
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


// CONNECTION 
async function dbConnection(){
    try {
       await mongoose.connect("mongodb://127.0.0.1:27017/correcteurDB");
        console.log("Connected to db");
    } catch (error) {
        console.log(error.message);
        console.log("Connection error");
    }
}
// dbConnection();

// SCHEMA -----------------------------------------------
const articleSchema = new mongoose.Schema(
    
    {
        title: {
            type: String,
            required: [true, "Title is required"]
        },

        content: {
            type: String,
            required: [true, "Content is required"]
        },

        like: {
            type: Number,
            default: 0
        },

        unlike: {
            type: Number,
            default: 0
        }
    },

    {
        timestamps: true
    });

const Article = mongoose.model("Article", articleSchema);

// --------------------------------------------------------
app.get("/", (req, res)=>{
    res.render("index.ejs");
});

app.get("/articles", async (req, res)=>{
    dbConnection();
    res.render("posts.ejs",
    {
        articles: await Article.find({})
    });
});

app.get("/articles/:id", async (req, res)=>{
    dbConnection();
    const { id } = req.params; 
    
    const article = await Article.findOne({_id: id});
    res.render("article.ejs", 
    {
        article: article
    });
});

app.get("/compose", (req, res)=>{
    res.render("compose.ejs");
});

app.post("/compose", (req, res)=>{
    const newArticle = new Article(req.body);
    dbConnection();
    newArticle.save();
    res.redirect("/articles");
});

app.get("/article", (req, res)=>{
    res.render("article.ejs");
});
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});