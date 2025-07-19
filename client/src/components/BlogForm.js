import { useState } from 'react';
import blogService from '../services/blogs';
import PropTypes from 'prop-types';

const BlogForm = ({ postSubmission }) => {
  const initialPropertiesValues = {
    title: '',
    author: '',
    url: '',
  };

  const [blog, setBlog] = useState(initialPropertiesValues);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newBlog = await blogService.create(blog);
      postSubmission(newBlog, 'Blog created successfully', 'success');
      setBlog(initialPropertiesValues);
    } catch (error) {
      postSubmission(null, 'Failed to create blog', 'error');
    }
  }

  const handleChange = (target, field) => {
    setBlog(oldBlog => ({ ...oldBlog, [field]: target.value }));
  }

  return (
    <>
      <h3>Create new blog</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>title</label>
          <input id='blog-title' name="title" value={blog.title} onChange={({ target }) => handleChange(target, 'title')}  />
        </div>
        <div>
          <label>author</label>
          <input id='blog-author' name="author" value={blog.author} onChange={({ target }) => handleChange(target, 'author')}  />
        </div>
        <div>
          <label>url</label>
          <input id='blog-url' name="url" value={blog.url} onChange={({ target }) => handleChange(target, 'url')}  />
        </div>
        <button id='blog-submit-btn' type="submit">Create</button>
      </form>
    </>
  );
}

BlogForm.propTypes = {
  postSubmission: PropTypes.func.isRequired,
}

export default BlogForm;