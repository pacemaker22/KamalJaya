import axios from 'axios';


const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server

    return axios.create({
      baseURL:
        "https://www.kamaljaya.xyz",
      headers: req.headers,
    }); 
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/',
    });
  }
};

export default buildClient;