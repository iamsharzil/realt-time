import { Fragment, Suspense, useEffect, lazy, useState } from 'react';
import Login from './Login';

const Globe = lazy(() => import('./Globe'));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // IN REAL WORLD APPLICATION, WE WILL IDEALLY BE USING COOKIES
    const token = localStorage.getItem('token');
    const parsedToken = JSON.parse(token);

    if (parsedToken) {
      fetch(`http://localhost:4000/me`, {
        headers: {
          // Use abc1234 to access globe
          Authorization: `Bearer ${parsedToken}`
        }
      })
        .then((res) => res.json())
        .then((user) => {
          if (user.authorized) {
            setIsLoggedIn(true);
          }
        })
        .catch((e) => {
          console.log('e', e);
        });
    }
  }, []);

  // IN REAL WORLD APPLICATION, POSSIBLY THERE COULD BE TWO ROUTES OR THERE WILL BE A LOGIN MODAL
  return (
    <Fragment>
      {isLoggedIn ? (
        <Suspense fallback={<div>loading...</div>}>
          <Globe />
        </Suspense>
      ) : (
        // IN REAL WORLD APPLICATION, WE WILL BE USING SOME KIND OF STATE MANAGEMENT
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </Fragment>
  );
}

export default App;
