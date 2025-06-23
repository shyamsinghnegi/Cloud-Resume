#!/bin/bash

# Cloud Resume Frontend Deployment Script
set -e

# Configuration
STACK_NAME="cloud-resume-frontend"
REGION="ap-south-1"
WEBSITE_DIR="website"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Cloud Resume Frontend Deployment${NC}"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo -e "${RED}❌ AWS CLI not configured. Please run 'aws configure'${NC}"
    exit 1
fi

# Check if website files exist
if [ ! -d "$WEBSITE_DIR" ]; then
    echo -e "${RED}❌ Website directory '$WEBSITE_DIR' not found${NC}"
    exit 1
fi

# Deploy CloudFormation stack
echo -e "${YELLOW}📦 Deploying infrastructure...${NC}"
sam deploy \
    --template-file template.yaml \
    --stack-name $STACK_NAME \
    --capabilities CAPABILITY_IAM \
    --region $REGION \
    --no-confirm-changeset \
    --no-fail-on-empty-changeset

# Get bucket name from stack outputs
echo -e "${YELLOW}🔍 Getting bucket name...${NC}"
BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
    --output text)

if [ -z "$BUCKET_NAME" ]; then
    echo -e "${RED}❌ Could not get bucket name from stack outputs${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Bucket name: $BUCKET_NAME${NC}"

# Upload website files to S3
echo -e "${YELLOW}📤 Uploading website files to S3...${NC}"
aws s3 sync $WEBSITE_DIR s3://$BUCKET_NAME \
    --region $REGION \
    --delete \
    --cache-control "text/html:max-age=300,public" \
    --cache-control "text/css:max-age=31536000,public" \
    --cache-control "application/javascript:max-age=31536000,public"

# Get CloudFront distribution ID
echo -e "${YELLOW}🔍 Getting CloudFront distribution ID...${NC}"
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text)

# Create CloudFront invalidation
if [ ! -z "$DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}🔄 Creating CloudFront invalidation...${NC}"
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    echo -e "${GREEN}✅ Invalidation created: $INVALIDATION_ID${NC}"
else
    echo -e "${RED}❌ Could not get CloudFront distribution ID${NC}"
fi

# Get website URL
WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text)

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Website URL: $WEBSITE_URL${NC}"
echo -e "${YELLOW}⏳ Note: CloudFront deployment may take 10-15 minutes to complete${NC}"

# Display all outputs
echo -e "\n${YELLOW}📋 Stack Outputs:${NC}"
aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
    --output table