const Blogs = require("../models/Blogs")

//Fetch all blogs main screen
module.exports.fetchAllBlogs = async (req, res) => {
    const blogs = await Blogs.find({})
    res.status(201).json(blogs)
    // res.status(201).json({message : "All blogs fetched"})
}

//Fetch All BLogs w.r.t a user
module.exports.fetchAllBlogsUser = async (req, res) => {
    const { id } = req.user
    const blogs = await Blogs.find({ user: id })
    res.status(201).json(blogs)
    // res.status(201).json({message : "All blogs fetched"})
}

module.exports.addBlog = async (req, res) => {
    const { id } = req.user
    const { title, description, tag } = req.body
    const blogs = new Blogs({
        title, description, tag, user: id
    })
    const resp = await blogs.save()
    res.status(201).json(resp)
}

module.exports.updateBlog = async (req, res) => {
    const { id } = req.params
    const  userId  = req.user.id
    const blog = await Blogs.findById(id)
    if (!blog) {
        // return res.status(400).json({ message: "Note not found !" })
        res.status(404).json({message : "blog not found"})
    }
    if (blog.user.toString() !== userId) {
        res.status(401).json({message : "Unauthorized access"})
    }
    const updateBlog = await Blogs.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true })
    res.status(201).json(updatedBlog)
}

module.exports.deleteBlog = async (req, res) => {
    const { id } = req.params
    const  userId  = req.user.id
    const blog = await Blogs.findById(id)
    if (!note) {
        res.status(404).json({message : "blog not found"})
    }
    if (note.user.toString() !== userId) {
        res.status(401).json({message : "Unauthorized access"})
    }
    const deletedBlog = await Blogs.findByIdAndDelete(id)
    res.status(201).json({message: `${deletedBlog.title} deleted successfully`, blog: deletedBlog})
}