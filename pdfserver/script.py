from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
from astrapy import DataAPIClient

app = Flask(__name__)

# Enable CORS
CORS(app)  # This allows requests from any origin (use cautiously in production)

# Initialize the Astra DB client
client = DataAPIClient(
    "AstraCS:dQuwMTRQnNUsXnXNCKBLcAkv:b63b92302d6a568c2cd604dcc17d63d25aedbd418c1ded6dea77a9961bbe7743"
)

# Connect to the database
db = client.get_database_by_api_endpoint(
    "https://cfd57702-c7fc-4238-a8f2-f8f46b7d476e-us-east-2.apps.astra.datastax.com",
    keyspace="default_keyspace"
)

# Specify the collection you want to query
collection_name = "demodata"  # Replace with your collection name
collection = db.get_collection(collection_name)

# Route to fetch all data from the collection
@app.route("/api/data", methods=["GET"])
def get_data():
    try:
        # Retrieve all documents from the collection
        documents = collection.find()
        # Convert cursor object to list for JSON serialization
        data_list = [doc for doc in documents]
        return jsonify({"success": True, "data": data_list})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
