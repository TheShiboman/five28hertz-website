// Test script to create a user and test login
import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import fetchCookie from 'node-fetch-cookies';

async function testAuth() {
  console.log('Starting auth test...');
  
  // Create a cookie jar to store and manage cookies
  const cookieJar = new CookieJar();
  const cookieFetch = fetchCookie(cookieJar);
  
  // Test user login with existing user
  console.log('Attempting to login with existing user...');
  const loginResponse = await cookieFetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'testuser',
      password: 'password123',
    }),
  });
  
  if (loginResponse.status === 401) {
    console.log('Login failed, attempting to register new user...');
    // Test user registration
    const registerResponse = await cookieFetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
        email: 'testuser@example.com',
        fullName: 'Test User',
        role: 'PROPERTY_OWNER'
      }),
    });
    
    const registerData = await registerResponse.json();
    console.log('Registration response:', registerResponse.status, registerData);
  } else {
    const loginData = await loginResponse.json();
    console.log('Login response:', loginResponse.status, loginData);
  }
  
  // Test getting current user
  console.log('Attempting to get current user...');
  const userResponse = await cookieFetch('http://localhost:5000/api/user');
  
  if (userResponse.status === 401) {
    console.log('User not authenticated (401) - Session not persisting properly');
    console.log('Cookies in jar:', await cookieJar.getCookieString('http://localhost:5000'));
  } else {
    const userData = await userResponse.json();
    console.log('User data:', userData);
  }
}

testAuth().catch(err => console.error('Error in auth test:', err));