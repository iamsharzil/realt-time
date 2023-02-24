import React, { useState } from 'react';
import './login.css';

const Login = ({ setIsLoggedIn }) => {
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, password } = e.target;
    const nameValue = name.value;
    const passwordValue = password.value;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: nameValue, password: passwordValue })
    };

    fetch(`http://localhost:4000/login`, requestOptions)
      .then((res) => res.json())
      .then((user) => {
        if (user.token) {
          localStorage.setItem('token', JSON.stringify(user.token));
          setIsLoggedIn(true);
        } else {
          setError('Invalid credentials');
        }
      })
      .catch((e) => {
        console.log('e', e);
      });
  };

  return (
    <div className="login">
      <div className="box">
        <form onSubmit={onSubmit}>
          <input placeholder="kisi" name="name" type={'text'} className="name" />
          <input placeholder="secret" name="password" type={'password'} className="password" />
          <button className="btn" type="submit">
            Submit
          </button>
          {error && <span className="error">{error}</span>}
        </form>
      </div>
    </div>
  );
};

export default Login;
