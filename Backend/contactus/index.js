const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const topicArn = process.env.TOPIC_ARN;
const headers = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,POST' 
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }

    try {
        
        const body = JSON.parse(event.body);

        const { name, email, issue } = body;

        const message = `Name: ${name}\nEmail: ${email}\nIssue: ${issue}`;

        const params = {
            Message: message,
            Subject: 'User Contact Submission',
            TopicArn: topicArn, 
        };

        await sns.publish(params).promise();
        return {
            statusCode: 200,
            headers: headers, 
            body: JSON.stringify({ message: 'Notification sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending notification:', error);
        return {
            statusCode: 500,
            headers: headers, 
            body: JSON.stringify({ message: 'Error sending notification' }),
        };
    }
};
