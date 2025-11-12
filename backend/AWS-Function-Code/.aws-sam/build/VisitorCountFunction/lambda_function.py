import json
import boto3
from botocore.exceptions import ClientError
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def lambda_handler(event, context):
    """
    Lambda function to handle visitor count for resume website
    """
    try:
        # Get current count from DynamoDB
        response = table.get_item(Key={'id': 'visitor-count'})
        
        if 'Item' in response:
            current_count = int(response['Item']['count'])
        else:
            current_count = 0
        
        # Increment count
        new_count = current_count + 1
        
        # Update count in database
        table.put_item(Item={'id': 'visitor-count', 'count': new_count})
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, OPTIONS'
            },
            'body': json.dumps({'count': new_count})
        }
        
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Internal server error'})
        }
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Internal server error'})
        }

def get_visitor_count():
    """
    Helper function to get current visitor count (for testing)
    """
    try:
        response = table.get_item(Key={'id': 'visitor-count'})
        if 'Item' in response:
            return int(response['Item']['count'])
        return 0
    except ClientError:
        return 0