const AWS = require('aws-sdk');
const transcribeService = new AWS.TranscribeService();
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const s3Record = event.Records[0].s3;
    const audioFileKey = s3Record.object.key;
    
    const transcriptionBucket = 'scriptstore2';
    const transcriptionKey = `transcriptions/${Date.now()}.json`; 
    
    try {
        const transcriptionJobName = `Transcription_${Date.now()}`;
        const transcriptionParams = {
            LanguageCode: 'en-US', 
            Media: {
                MediaFileUri: `s3://${s3Record.bucket.name}/${audioFileKey}`,
            },
            TranscriptionJobName: transcriptionJobName,
            OutputBucketName: transcriptionBucket, 
            OutputKey: transcriptionKey, 
        };
        
        await transcribeService.startTranscriptionJob(transcriptionParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify('Transcription job started successfully.'),
        };
    } catch (error) {
        console.error('Error starting transcription:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error starting transcription.'),
        };
    }
};
