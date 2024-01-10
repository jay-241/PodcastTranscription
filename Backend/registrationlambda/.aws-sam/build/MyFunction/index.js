const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TableName = 'Users';

exports.handler = async (event) => {
    const requestBody = event.body;

    const { action, email, name, password } = requestBody;

    if (action === 'register') {
        return await registerUser(email, name, password);
    } else if (action === 'login') {
        return await loginUser(email, password);
    } else {
        return { statusCode: 400, body: JSON.stringify({ message: 'Invalid action' }) };
    }   
};

async function registerUser(email, name, password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        UserID: email,
        Email: email,
        Name: name,
        PasswordHash: hashedPassword
    };

    try {
        await dynamoDB.put({ TableName, Item: newUser }).promise();
        return { statusCode: 200, body: JSON.stringify({ message: 'User registered successfully' }) };
    } catch (error) {
        console.error('Error registering user:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error registering user' }) };
    }
}

async function loginUser(email, password) {
    try {
        const result = await dynamoDB.get({ TableName, Key: { UserID: email } }).promise();
        const user = result.Item;

        if (user && bcrypt.compareSync(password, user.PasswordHash)) {
            return { statusCode: 200, body: JSON.stringify({ message: 'Login successful' }) };
        } else {
            return { statusCode: 401, body: JSON.stringify({ message: 'Login failed' }) };
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error logging in' }) };
    }
}
