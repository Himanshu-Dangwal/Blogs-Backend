const Blog = require("../models/Blog")
const Comment = require("../models/Comment")
const User = require("../models/User")
//Fetch all blogs main screen
module.exports.fetchAllBlogs = async (req, res) => {
    const blogs = await Blog.find({})
    res.status(201).json(blogs)
    // res.status(201).json({message : "All blogs fetched"})
}

//Fetch All BLogs w.r.t a user
module.exports.fetchAllBlogsUser = async (req, res) => {
    const { id } = req.user
    console.log(req.user);
    console.log(id);
    const blogs = await Blog.find({ user: id })
    res.status(201).json(blogs)
    // res.status(201).json({message : "All blogs fetched"})
}


// Logged in user can add a blog
module.exports.addBlog = async (req, res) => {
    try {
      const { title, description, tag} = req.body; // Assuming you have these values in the request body
      const userId = req.user.id;
      // Create a new blog post object
      const newBlogPost = new Blog({
        title,
        description,
        tag,
        user: userId, // User ObjectId who created the blog post
        upvote: 0,
        downvote: 0,
        comments: [], // Initialize as an empty array for comments
      });
  
      // Save the new blog post
      await newBlogPost.save();
  
      res.status(201).json({ message: 'Blog post added successfully' });
    } catch (error) {
      console.error('Error adding blog post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

//Upvote a vlog
module.exports.voteBlog = async (req,res) => {
    
    const { voteType } = req.body;
    const userId = req.user.id
    const blogId = req.params.id
  
    try {
      // Find the blog post by its ObjectId
      const blog = await Blog.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      // Check if the user has already voted on this blog
    //   if (blog.votedBy.includes(userId)) {
    //     return res.status(400).json({ message: 'User has already voted on this blog' });
    //   }
  
      // Update the vote count based on voteType ('upvote' or 'downvote')
      if (voteType === 'upvote') {
        blog.upvotes++;
      } else if (voteType === 'downvote') {
        blog.downvotes++;
      } else {
        return res.status(400).json({ message: 'Invalid vote type' });
      }
  
      // Add the user to the votedBy array
    //   blog.votedBy.push(userId);
  
      // Save the updated blog post
      await blog.save();
  
      res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (error) {
      console.error('Error recording vote:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  







//To update a blog (Send Blogs id in req and auth token (to get the user id))

module.exports.updateBlog = async (req, res) => {
    try {
      const { title, description, tag } = req.body; // Include blogId, userId, title, description, and tag in the request body
      const userId = req.user.id;  
      const blogId = req.params.id;

      console.log(userId);
      console.log(blogId);
      // Find the blog post by its ObjectId
      const blog = await Blog.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      // Check if the user owns the blog post
      if (blog.user.toString() !== userId) {
        return res.status(403).json({ message: 'You do not have permission to update this blog post' });
      }
  
      // Update the blog post fields
      blog.title = title;
      blog.description = description;
      blog.tag = tag;
  
      // Save the updated blog post
      await blog.save();
  
      res.status(200).json({ message: 'Blog post updated successfully' });
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


//To delete a blog (Send Blogs id in req and auth token (to get the user id))
module.exports.deleteBlog = async (req, res) => {
    try {
      const userId = req.user.id; // Include blogId and userId in the request body
      const blogId = req.params.id;
      // Find the blog post by its ObjectId
      const blog = await Blog.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      // Check if the user owns the blog post
      if (blog.user.toString() !== userId) {
        return res.status(403).json({ message: 'You do not have permission to delete this blog post' });
      }
  
      // Delete the blog post
    //   await blog.remove();
    await Blog.findByIdAndDelete(blogId);
  
      res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  //Adding comments (nested as well as simple)

  // Function to add a comment to a blog post (including nested comments)
  module.exports.addCommentToBlog = async (req, res) => {
    try {
      const { message, parentCommentId } = req.body;
      const userId = req.user.id;
      const blogId = req.params.id;
  
      const blog = await Blog.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      const newComment = new Comment({
        user: userId,
        message: message,
        like: 0,
        isNested: !!parentCommentId,
        parentComment: parentCommentId,
        blog: blogId,
      });
  
      if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
          return res.status(404).json({ message: 'Parent comment not found' });
        }
        parentComment.comments.push(newComment);
        await parentComment.save();
        await newComment.save();
      } else {
        blog.comments.push(newComment);
        await newComment.save()
        await blog.save();
      }
  
      res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  