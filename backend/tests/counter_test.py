import unittest
from unittest.mock import patch, MagicMock
import sys
import os
import json

# Get the current test file's directory
current_file = os.path.abspath(__file__)
tests_dir = os.path.dirname(current_file)
backend_dir = os.path.dirname(tests_dir)
src_dir = os.path.join(backend_dir, 'src')

# Verify we're in the right structure
print(f"Test file: {current_file}")
print(f"Tests directory: {tests_dir}")
print(f"Backend directory: {backend_dir}")
print(f"Source directory: {src_dir}")

# Add src directory to Python path
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

# Verify the lambda function file exists
lambda_file = os.path.join(src_dir, 'lambda_function.py')
if not os.path.exists(lambda_file):
    raise FileNotFoundError(f"lambda_function.py not found at: {lambda_file}")

# Import the lambda function
try:
    from lambda_function import lambda_handler, get_visitor_count
    print("✅ Successfully imported lambda functions")
except ImportError as e:
    print(f"❌ Import failed: {e}")
    print(f"Python path: {sys.path}")
    print(f"Files in src directory: {os.listdir(src_dir) if os.path.exists(src_dir) else 'Not found'}")
    raise

class TestVisitorCounter(unittest.TestCase):
    """Test cases for visitor counter Lambda function"""
    
    def setUp(self):
        """Set up test environment"""
        os.environ['TABLE_NAME'] = 'test-visitor-count'
    
    @patch('lambda_function.table')
    def test_lambda_handler_first_visitor(self, mock_table):
        """Test handling first visitor (no existing count)"""
        # Mock DynamoDB response for new visitor
        mock_table.get_item.return_value = {}
        mock_table.put_item.return_value = {}
        
        event = {}
        context = {}
        
        response = lambda_handler(event, context)
        
        # Assertions
        self.assertEqual(response['statusCode'], 200)
        self.assertIn('count', response['body'])
        
        body = json.loads(response['body'])
        self.assertEqual(body['count'], 1)
        
        # Verify CORS headers
        self.assertEqual(response['headers']['Access-Control-Allow-Origin'], '*')
        print("✅ First visitor test passed")
    
    @patch('lambda_function.table')
    def test_lambda_handler_existing_visitors(self, mock_table):
        """Test handling when visitors already exist"""
        # Mock DynamoDB response for existing count
        mock_table.get_item.return_value = {'Item': {'count': 42}}
        mock_table.put_item.return_value = {}
        
        event = {}
        context = {}
        
        response = lambda_handler(event, context)
        
        # Assertions
        self.assertEqual(response['statusCode'], 200)
        body = json.loads(response['body'])
        self.assertEqual(body['count'], 43)
        print("✅ Existing visitors test passed")
    
    @patch('lambda_function.table')
    def test_lambda_handler_dynamodb_error(self, mock_table):
        """Test handling DynamoDB errors"""
        from botocore.exceptions import ClientError
        
        # Mock DynamoDB error
        mock_table.get_item.side_effect = ClientError(
            error_response={'Error': {'Code': 'ResourceNotFoundException'}},
            operation_name='GetItem'
        )
        
        event = {}
        context = {}
        
        response = lambda_handler(event, context)
        
        # Assertions
        self.assertEqual(response['statusCode'], 500)
        body = json.loads(response['body'])
        self.assertIn('error', body)
        print("✅ Error handling test passed")

if __name__ == '__main__':
    unittest.main(verbosity=2)