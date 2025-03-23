from flask import Flask, request, render_template, jsonify
from flask_cors import CORS

import pickle
import re
import nltk
from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords
import pandas as pd
import requests


TMDB_API_KEY = 'bf575d5ad0d91975ac9e6b574e58153c'
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

app=Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])  # Adjust frontend URL if needed



# Load the data and model
with open('movie_list.pkl', 'rb') as f:
    data = pickle.load(f)
with open('similarity.pkl', 'rb') as f:
    similarity = pickle.load(f)

df = pd.DataFrame(data)  # Convert dictionary to Pandas DataFrame
# df_html = df.to_html(classes='table table-striped')

def get_movie_poster(movie_id):
    url = f"{TMDB_BASE_URL}/movie/{movie_id}?api_key={TMDB_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        poster_path = data.get('poster_path')
        if poster_path:
            return f"https://image.tmdb.org/t/p/w500{poster_path}"
    return None
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/search-movies', methods=['POST', 'OPTIONS'])
def search_movies():
    if request.method == 'OPTIONS':  # Handle preflight
        return jsonify({"message": "CORS preflight successful"}), 200
    
    data = request.get_json()
    movie_name = data.get("movie_val")
    
    if not movie_name:
        return jsonify({"error": "No movie provided"}), 400
    
    # Your movie recommendation logic here...
    
    return jsonify({"message": f"Recommendations for {movie_name}"}), 200

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()  # Get JSON data from the request
    movie = data.get('movie_val')  # Extract movie name from the JSON

    # Check if the movie exists in df['title']
    movie_row = df[df['title'].str.lower() == movie.lower()]  # Case-insensitive match

    if movie_row.empty:
        return jsonify({"error": "Movie not found"}), 404  # Handle missing movie

    index = movie_row.index[0]  # Now it's safe to access index
    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])

    result = []
    poster = []

    for i in distances[1:7]:  # Get top 6 recommendations
        recommended_movie = df.iloc[i[0]]
        result.append(recommended_movie.title)
        movie_id = recommended_movie.id
        poster.append(get_movie_poster(movie_id))

    return jsonify({"result": result, "poster_url": poster}), 200

if __name__ == '__main__':
    app.run(debug=True)
