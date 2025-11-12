import azure.functions as func
import json
import os
from azure.cosmos import CosmosClient, exceptions

# --- Get Connection Details from Environment Variables ---

ENDPOINT = os.environ['COSMOS_ENDPOINT']
KEY = os.environ['COSMOS_KEY']
DATABASE_NAME = 'resumeDB'
CONTAINER_NAME = 'views'

def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    Azure Function to handle visitor count for resume website
    """
    try:
        # --- Initialize the Cosmos DB client ---
        # This is done *inside* the function to be stateless
        client = CosmosClient(ENDPOINT, KEY)
        database = client.get_database_client(DATABASE_NAME)
        container = database.get_container_client(CONTAINER_NAME)

        # --- This is the ID for our counter document in the database ---
        item_id = 'visitor-count'

        # --- 1. Get current count from Cosmos DB ---
        try:
            # Read the item. We use 'visitor-count' for both the ID and Partition Key
            item = container.read_item(item=item_id, partition_key=item_id)
            current_count = int(item.get('count', 0))
        except exceptions.CosmosResourceNotFoundError:
            # If the item doesn't exist, start at 0
            current_count = 0

        # --- 2. Increment count ---
        new_count = current_count + 1

        # --- 3. Update count in database ---
        new_item = {
            'id': item_id,  # 'id' is the unique ID
            'count': new_count
        }
        # 'upsert_item' will create or update the item
        container.upsert_item(body=new_item)

        # --- 4. Return the new count  ---
        return func.HttpResponse(
            body=json.dumps({'count': new_count}),
            status_code=200,
           
            headers={
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        )

    except Exception as e:
        # --- Handle any errors ---
        print(f"Unexpected error: {e}")
        return func.HttpResponse(
            body=json.dumps({'error': 'Internal server error'}),
            status_code=500,
            headers={
                'Access-Control-Allow-Origin': '*'
            }
        )