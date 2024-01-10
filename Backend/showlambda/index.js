const AWS = require('aws-sdk');
const s3 = new AWS.S3();


const headers = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,GET'
};

exports.handler = async (event) => {
    const bucketName = 'scriptstore2'; 
    const folderName = 'transcriptions'; 
    const fileExtension = '.json';

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }

    try {
        const listObjectsResponse = await s3.listObjectsV2({ Bucket: bucketName, Prefix: `${folderName}/` }).promise();

        const jsonObjects = listObjectsResponse.Contents.filter((object) => {
            return object.Key.endsWith(fileExtension);
        });

        if (jsonObjects.length === 0) {
            console.log('No JSON files found in the folder.');
            return {
                statusCode: 404,
                headers: headers,
                body: JSON.stringify('No JSON files found in the folder.'),
            };
        }

        const responses = [];

        for (let i = 0; i < jsonObjects.length; i++) {
            const objectKey = jsonObjects[i].Key;
            const jsonFile = await s3.getObject({ Bucket: bucketName, Key: objectKey }).promise();
            const jsonContent = JSON.parse(jsonFile.Body.toString());

            const transcript = jsonContent.results.transcripts[0].transcript;

            const formattedTranscript = `Transcript ${i + 1}\n\n${transcript}`;
            console.log(formattedTranscript);

            responses.push(formattedTranscript);
        }

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ transcripts: responses }),
        };
    } catch (error) {
        console.error('Error processing JSON files:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify('Error processing JSON files.'),
        };
    }
};
