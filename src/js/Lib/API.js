// Global config
const baseUrl = 'http://localhost:1234';
// Global settings for GET Methods
const getOptions = {
  method: 'GET',
  mode: 'cors',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
};
// Global settings for POST Methods
const postOptions = {
  method: 'POST',
  mode: 'cors',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
};

const API = {
  login: (data) => {
    const url = `${baseUrl}/login`;
    // Use spread operator to add body data to global POST Config
    const options = {
      ...postOptions,
      body: JSON.stringify(data)
    };

    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            response.json().then(json => resolve(json));
          } else {
            response.json().then(json => reject(json));
          }
        })
        .catch(err => reject(err));
    });
  },
  logout: () => {
    const url = `${baseUrl}/logout`;

    return new Promise((resolve, reject) => {
      fetch(url, postOptions)
        .then(response => response.json())
        .then((json) => {
          resolve(json);
        }).catch((err) => {
          reject(err);
        });
    });
  },
  session: () => {
    const url = `${baseUrl}/session`;
    return new Promise((resolve, reject) => {
      fetch(url, getOptions)
        .then(response => response.json())
        .then((json) => {
          resolve(json);
        }).catch((err) => {
          reject(err);
        });
    });
  }
};

export default API;
