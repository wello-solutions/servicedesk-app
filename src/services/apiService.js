import axios from 'axios';

export const fetchData = async (endpoint, method = 'GET', data = null) => {
  try {
    const auth = JSON.parse(sessionStorage.getItem('auth'));
    
    if (!auth || !auth.email || !auth.password || !auth.domain) {
      throw new Error('Invalid or missing authentication data');
    }

    const authString = `${auth.email.trim()}:${auth.password.trim()}@${auth.domain.trim()}`;
    const authKey = btoa(authString);

    const config = {
      url: endpoint,
      method,
      headers: {
        'Authorization': `Basic ${authKey}`,
        'Accept': 'application/json',
      },
      data,
    };

    const response = await axios(config);
    return response.data;

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};