# TODO: SignalWire-ElevenLabs Integration

## AWS S3 Integration for Audio Files
1. Setup AWS S3
   - [ ] Create AWS account if not exists
   - [ ] Create S3 bucket for temporary audio files
   - [ ] Configure bucket lifecycle rules for automatic cleanup
   - [ ] Set up IAM user with minimal required permissions
   - [ ] Get AWS credentials (access key and secret)

2. Project Dependencies
   - [ ] Install AWS SDK: `npm install aws-sdk`
   - [ ] Add AWS credentials to environment variables:
     ```
     AWS_ACCESS_KEY_ID=
     AWS_SECRET_ACCESS_KEY=
     AWS_REGION=
     AWS_BUCKET_NAME=
     ```

3. Code Implementation
   - [ ] Create S3 service module for handling uploads/deletions
   - [ ] Modify ElevenLabs integration to use S3 URLs
   - [ ] Add error handling for S3 operations
   - [ ] Implement automatic cleanup after playback
   - [ ] Add logging for S3 operations

4. Testing
   - [ ] Test S3 upload/delete operations
   - [ ] Test SignalWire playback with S3 URLs
   - [ ] Verify automatic file cleanup
   - [ ] Test error scenarios

5. Documentation
   - [ ] Document S3 setup process
   - [ ] Update API documentation with S3 integration
   - [ ] Add configuration instructions to README
