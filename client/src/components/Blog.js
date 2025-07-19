import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, onLikeClicked, onDeleteBlog, user }) => {
  const [visible, setVisibility] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  const detailsStyle = {
    marginBottom: '7px'
  };

  const handleLike = async () => {
    blog = { ...blog, likes: blog.likes + 1, user: blog.user.id };
    onLikeClicked(blog);
  }

  return (
    <div style={blogStyle} className='blog'>
      <b style={{ marginRight: '10px' }}>{blog.title} {blog.author}</b>
      <button style={{ marginRight: '10px' }} onClick={() => setVisibility(!visible)}>{visible ? 'Hide' : 'View'}</button>
      {blog?.user?.username === user?.username && <button onClick={() => onDeleteBlog(blog.id)}>Delete</button>}
      {visible && <div>
        <div style={detailsStyle}><a href={blog.url}>{blog.url}</a></div>
        <div style={detailsStyle}><span className='blog-likes'>{blog.likes}</span> <button onClick={handleLike}>like</button></div>
        <div>{blog?.user?.name}</div>
      </div>}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onLikeClicked: PropTypes.func.isRequired,
  onDeleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog