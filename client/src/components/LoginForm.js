import { useState } from 'react';
import loginService from '../services/login';
import PropTypes from 'prop-types';
import Notification from './Notification';
import blogService from '../services/blogs';

const LoginForm = ({ postLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (target, field) => {
    setCredentials(oldCredentials => ({ ...oldCredentials, [field]: target.value }));
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login(credentials);
      postLogin(user);
      localStorage.setItem('loggedUserInfo', JSON.stringify(user));
      blogService.setToken(user.token);
    } catch (error) {
      setMessage(error.response.data.error);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  }

  return (
    <>
      {message && <Notification message={message} className='error' />}
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>username</label>
          <input id="username" name="username" value={credentials.username} onChange={({ target }) => handleChange(target, 'username')}  />
        </div>
        <div>
          <label>password</label>
          <input id="password" type="password" name="password" value={credentials.password} onChange={({ target }) => handleChange(target, 'password')} />
        </div>
        <button id="login-button" type="submit">Login</button>
      </form>
    </>
  )
}

LoginForm.propTypes = {
  postLogin: PropTypes.func.isRequired
}

export default LoginForm;