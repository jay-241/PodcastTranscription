const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); 

exports.handler = async (event) => {
    try {
        const s3 = new AWS.S3(); 
        const actionId = uuidv4();
        const params = {
            Bucket: 'podcaststore2', 
            Key: `${actionId}.mp3`, 
            ContentType: 'audio/mpeg', 
            Expires: 240 
        };

        const preSignedURL = s3.getSignedUrl('putObject', params);

        const headers = {
            'Access-Control-Allow-Origin': '*', // Adjust in production
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        };

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ url: preSignedURL })
        };
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error generating pre-signed URL' })
        };
    }
};
