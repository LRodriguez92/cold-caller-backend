# S3 Express Directory Bucket Lifecycle Configuration Documentation

## Overview
- **Bucket Type**: S3 Express Directory Bucket
- **Purpose**: Temporary storage for audio files with automatic deletion
- **Environment**: [ENVIRONMENT]

## Lifecycle Configuration
```json
{
    "Rules": [
        {
            "Expiration": {
                "Days": 1
            },
            "ID": "Delete temporary audio files",
            "Filter": {
                "Prefix": ""
            },
            "Status": "Enabled"
        }
    ]
}
```

## Behavior
- All objects in the bucket will be automatically deleted after 1 day
- No prefix filter, applies to all objects
- Deletion occurs automatically via S3 Lifecycle rules

## IAM Policy Template
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowAccessRegionalEndpointAPIs",
            "Effect": "Allow",
            "Action": [
                "s3express:DeleteBucket",
                "s3express:DeleteBucketPolicy",
                "s3express:CreateBucket",
                "s3express:PutBucketPolicy",
                "s3express:GetBucketPolicy",
                "s3express:ListAllMyDirectoryBuckets",
                "s3express:PutLifecycleConfiguration",
                "s3express:GetLifecycleConfiguration"
            ],
            "Resource": "*"
        },
        {
            "Sid": "AllowCreateSession",
            "Effect": "Allow",
            "Action": "s3express:CreateSession",
            "Resource": "*"
        }
    ]
}
```

## Monitoring & Verification
To verify the configuration:
```bash
# Check lifecycle configuration
aws s3api get-bucket-lifecycle-configuration \
    --region [REGION] \
    --bucket [BUCKET_NAME]

# List bucket contents
aws s3 ls s3://[BUCKET_NAME]/
```

## Important Notes
- Objects cannot be recovered after deletion
- Deletion may occur slightly after the 1-day mark due to S3's eventual consistency
- No additional cost for lifecycle rules
- S3 Express directory buckets do not support:
  - Storage class transitions
  - Versioning
  - Tag-based lifecycle rules

## Maintenance
- Regularly verify lifecycle rules are working
- Monitor CloudWatch metrics for deletion events
- Review storage costs periodically

## Related AWS CLI Commands
```bash
# Apply lifecycle configuration
aws s3api put-bucket-lifecycle-configuration \
    --region [REGION] \
    --bucket [BUCKET_NAME] \
    --lifecycle-configuration file://lifecycle-config.json \
    --checksum-algorithm crc32c

# Get current configuration
aws s3api get-bucket-lifecycle-configuration \
    --region [REGION] \
    --bucket [BUCKET_NAME]
```

## Contact
- Maintainer: [TEAM_NAME]
- For internal contact information, see internal documentation
