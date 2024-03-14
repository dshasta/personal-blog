import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

//Step 3 - Make the styling show up.
//Hint 1: CSS files are static files!
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

const blogPosts = [];


app.get("/", (req, res) => {
  // Pass the blogPosts array to the template
  res.render("index.ejs", { posts: blogPosts, activePage: 'home' });
});

app.get("/about", (req, res) => {
  res.render("about.ejs", { posts: blogPosts, activePage: 'about' });
});

// app.get("/post/:id", (req, res) => {
//   const postId = parseInt(req.params.id, 10); // Gets the index from the URL
//   const post = blogPosts[postId]; // Uses the index to access the specific post in the array
//   if (post) {
//     res.render("post.ejs", { post: post, postId: postId, activePage: null }); // If the post exists, render it
//   } else {
//     res.send("Post not found."); // Handle cases where the post doesn't exist
//   }
// });

app.get("/post/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10); // Convert the URL parameter to an integer
  if (postId >= 0 && postId < blogPosts.length) {
    const post = {...blogPosts[postId]}; // Make a shallow copy of the post object
    // Convert newline characters to <br> tags for HTML display
    post.contentForDisplay = post.content.replace(/\n/g, '<br>');

    // Render the post.ejs template, passing in the post object with the new contentForDisplay property
    // Also, pass the postId and activePage: null as before
    res.render("post.ejs", { post: post, postId: postId, activePage: null });
  } else {
    res.send("Post not found."); // Handle cases where the post doesn't exist
  }
});

app.post("/submit", (req, res) => {
  
  const newPost = {
    title: req.body.title,
    content: req.body.blogPost,
    date: new Date().toLocaleDateString('en-US') 
  };

  blogPosts.push(newPost);
  
  res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10); // Convert id from URL parameter to an integer
  if (postId >= 0 && postId < blogPosts.length) { // Check if id is valid
    blogPosts.splice(postId, 1); // Remove the post from the array
  }
  res.redirect("/"); // Redirect back to the homepage
});

app.get("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = blogPosts[postId];
  if (post) {
    res.render("edit.ejs", { post: post, postId: postId, activePage: null });
  } else {
    res.send("Post not found.");
  }
});

app.post("/update/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const updatedPost = {
    title: req.body.title,
    content: req.body.content,
    date: blogPosts[postId].date // Keep the original post date or update if necessary
  };

  if (postId >= 0 && postId < blogPosts.length) {
    blogPosts[postId] = updatedPost; // Update the post in the array
  }
  res.redirect("/post/" + postId); // Redirect to the updated post view
});





app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});