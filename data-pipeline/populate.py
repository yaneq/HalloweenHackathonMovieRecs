import os
import csv
import weaviate

from dotenv import load_dotenv

load_dotenv()

WEAVIATE_CLUSTER_URL = os.getenv("WEAVIATE_CLUSTER_URL")
WEAVIATE_API_KEY = os.getenv("WEAVIATE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = weaviate.Client(
    url=WEAVIATE_CLUSTER_URL,
    auth_client_secret=weaviate.AuthApiKey(api_key=WEAVIATE_API_KEY),
    additional_headers={"X-OpenAI-Api-Key": OPENAI_API_KEY},
)

client.schema.delete_class("Movie")

class_obj = {
    "class": "Movie",
    "vectorizer": "text2vec-openai",
    "moduleConfig": {
        "text2vec-openai": {"model": "ada", "modelVersion": "002", "type": "text"}
    },
}

client.schema.create_class(class_obj)

f = open("../data/mymoviedb.csv", "r")
current_movie = None
try:
    with client.batch as batch:  # Initialize a batch process
        batch.batch_size = 100
        reader = csv.reader(f)

        # skip header
        next(reader)

        # Iterate through each row of data
        for movie in reader:
            current_movie = movie
            properties = {
                "release_date": movie[0],
                "title": movie[1],
                "summary": movie[2],
                "ratings_count": int(movie[4]),
                "rating_average": float(movie[5]),
                "genre": movie[7],
                "poster": movie[8],
            }

            if properties["rating_average"] > 7:
                batch.add_data_object(data_object=properties, class_name="Movie")
                print(f"Added {properties['title']} ({properties['rating_average']})")
            # print(f"{book[2]}: {uuid}", end='\n')
except Exception as e:
    print(f"something happened {e}. Failure at {current_movie}")

f.close()
