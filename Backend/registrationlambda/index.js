const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TableName = 'Users';


const headers = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
};

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event));

    
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }

    let requestBody;

    // Check if the event.body is already parsed
    if (typeof event.body === 'object') {
        requestBody = event.body;
    } else {
        // Attempt to parse the event.body as JSON string
        try {
            requestBody = JSON.parse(event.body);
        } catch (error) {
            console.error('Error parsing event body:', error);
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ message: 'Invalid request body' })
            };
        }
    }

    console.log("Received body:", requestBody);

    const { action, email, name, password } = requestBody;

    if (action === 'register') {
        return await registerUser(email, name, password);
    } else if (action === 'login') {
        return await loginUser(email, password);
    } else {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message: 'Invalid action' })
        };
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
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: 'User registered successfully' })
        };
    } catch (error) {
        console.error('Error registering user:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: 'Error registering user' })
        };
    }
}

async function loginUser(email, password) {
    try {
        const result = await dynamoDB.get({ TableName, Key: { UserID: email } }).promise();
        const user = result.Item;

        if (user && bcrypt.compareSync(password, user.PasswordHash)) {
            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({ message: 'Login successful' })
            };
        } else {
            return {
                statusCode: 401,
                headers: headers,
                body: JSON.stringify({ message: 'Login failed' })
            };
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: 'Error logging in' })
        };
    }
}
