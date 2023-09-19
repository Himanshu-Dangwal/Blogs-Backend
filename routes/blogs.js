const express = require("express");
const router = express.Router();
const {fetchUser} = require('../middlewares/fetchUser')
const {validateNewBlog} = require('../middlewares/validateNewBlog')
const {fetchAllBlogs,addBlog,updateBlog,deleteBlog} = require('../controllers/blogs')
const catchAsync = require('../utils/catchAsync')

router.get('/', fetchUser, catchAsync(fetchAllBlogs))

// Get all the notes using : POST /api/blogs/
router.post('/', fetchUser, validateNewBlog, catchAsync(addBlog))

// Update the notes using: PUT /api/blogs
router.put('/:id', fetchUser, validateNewBlog, catchAsync(updateBlog))

// Delete the notes using: PUT /api/blogs
router.delete('/:id', fetchUser, catchAsync(deleteBlog))

module.exports = router