async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    
    const loginData = {
      email: 'admin@desacilame.com',
      password: 'admin123'
    };
    
    console.log('Sending request with data:', loginData);
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    const responseData = await response.json();
    
    if (response.ok) {
      console.log('Login successful!');
      console.log('Response:', responseData);
    } else {
      console.log('Login failed with status:', response.status);
      console.log('Response:', responseData);
    }
    
  } catch (error) {
    console.error('Login failed!');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();