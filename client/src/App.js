import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import './index.css'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackClass, setFeedbackClass] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserInfo = localStorage.getItem('loggedUserInfo');

    if (loggedUserInfo) {
      const userInfo = JSON.parse(loggedUserInfo);
      setUser(userInfo);
      blogService.setToken(userInfo.token);
    }
  }, [])

  const postLogin = (user) => {
    setUser(user);
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('loggedUserInfo');
  }

  const postSubmission = (newBlog, message, className) => {
    if (newBlog) {
      newBlog = { ...newBlog, user };
      setBlogs(oldBlogs => [...oldBlogs, newBlog]);
    }
    blogFormRef.current.toggleVisibility();
    setFeedbackMessage(message);
    setFeedbackClass(className);
    setTimeout(() => {
      setFeedbackMessage(null);
      setFeedbackClass(null);
    }, 5000);
  }

  const onLikeClicked = async (blog) => {
    const updatedBlog = await blogService.update(blog);
    setBlogs((oldBlogs) => {
      return oldBlogs.map(blog => {
        if (blog.id === updatedBlog.id) {
          return updatedBlog;
        }
        return blog;
      });
    });
  }

  const onDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await blogService.deleteBlog(id);
      setBlogs((oldBlogs) => oldBlogs.filter(blog => blog.id !== id));
    }
  }

  return (
    <div>
      {!user && <LoginForm postLogin={postLogin} />}
      {user &&
        <>
          <button onClick={handleLogout}>Logout</button>
          <h2>blogs</h2>
          <Notification message={feedbackMessage} className={feedbackClass} />
          <p><strong>Logged in as {user.name}</strong></p>
          <Togglable buttonLabel="Add new blog" ref={blogFormRef}>
            <BlogForm postSubmission={postSubmission} />
          </Togglable>
          <br />
          <ul>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} onLikeClicked={onLikeClicked} onDeleteBlog={onDeleteBlog} user={user} />
            )}
          </ul>
        </>
      }
    </div>
  )
}

export default App