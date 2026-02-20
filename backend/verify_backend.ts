import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
    try {
        console.log('Starting Backend Verification...');

        // 1. Register User
        const username = `testuser${Date.now()}`;
        const password = 'password123';
        console.log(`Registering user: ${username}`);
        try {
            await axios.post(`${API_URL}/users/register`, { username, password });
            console.log('✅ User registered successfully');
        } catch (err: any) {
            if (err.response && err.response.status === 409) {
                console.log('⚠️ User already exists, proceeding to login');
            } else {
                throw err;
            }
        }

        // 2. Login User
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/users/login`, { username, password });
        const token = loginRes.data.token;
        console.log('✅ Login successful, token received');

        // 3. Create Product (Requires Auth)
        console.log('Creating product...');
        const product = {
            name: `Test Product ${Date.now()}`,
            price: 100,
            description: 'A test product'
        };
        const productRes = await axios.post(`${API_URL}/products`, product, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const createdProduct = productRes.data;
        console.log('✅ Product created successfully:', createdProduct);

        // 4. Get Users (to get a valid userId for order)
        console.log('Fetching users...');
        const usersRes = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const users = usersRes.data;
        const testUser = users.find((u: any) => u.username === username);
        if (!testUser) throw new Error('Registered user not found in user list');
        console.log('✅ User found for order creation:', testUser.id);

        // 5. Create Order
        console.log('Creating order...');
        const order = {
            userId: testUser.id,
            productIds: [createdProduct._id],
            totalAmount: 100
        };
        const orderRes = await axios.post(`${API_URL}/orders`, order, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Order created successfully:', orderRes.data);

        console.log('🎉 All backend verifications passed!');
    } catch (error: any) {
        console.error('❌ Verification Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
};

runVerification();
