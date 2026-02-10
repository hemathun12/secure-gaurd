
const BASE_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
    const username = `testuser_${Date.now()}`;
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Testing with: ${username}, ${email}, ${password}`);

    // 1. Register
    console.log('\n--- Registering ---');
    try {
        const regRes = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const regData = await regRes.json();
        console.log('Status:', regRes.status);
        console.log('Response:', regData);

        if (regRes.status !== 201) {
            console.error('Registration failed!');
            return;
        }

        // 2. Login
        console.log('\n--- Logging in ---');
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const loginData = await loginRes.json();
        console.log('Status:', loginRes.status);
        console.log('Response:', loginData);

        if (loginRes.status !== 200) {
            console.error('Login failed!');
            return;
        }

        const token = loginData.token;

        // 3. Get Me
        console.log('\n--- Getting Me ---');
        const meRes = await fetch(`${BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const meData = await meRes.json();
        console.log('Status:', meRes.status);
        console.log('Response:', meData);

        if (meRes.status === 200) {
            console.log('\nSUCCESS: Auth flow working correctly!');
        } else {
            console.error('Get Me failed!');
        }

    } catch (error) {
        console.error('Error during test:', error);
    }
}

testAuth();
