import os
import json
import Analysis
from flask_cors import CORS
from collections import defaultdict
from flask import Flask, request, send_from_directory, jsonify

app = Flask(__name__, static_folder='./build/')
CORS(app)

analysis = Analysis.Analysis()


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """
    Serve the React application.

    If a specific path is requested and it exists in the static folder, serve that file.
    Otherwise, serve the index.html file to enable client-side routing.

    Args:
        path (str): The requested path.

    Returns:
        Response: The file from the static folder or the index.html file.
    """
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/get_tweets', methods=['POST'])
def get_tweets():
    """
    Get filtered tweets based on the request parameters.

    The request body should contain JSON data with the following structure:
    [
        {
            "timeFrame": "start_date end_date",
            "county": ["list_of_counties"],
            "accountType": ["list_of_account_types"]
        },
        {
            "retweets": true_or_false
        }
    ]

    Returns:
        Response: JSON object containing the filtered tweets.
    """
    request_body = request.get_json()
    retweets = True
    time_frame = None
    counties = None
    account_type_list = None

    try:
        retweets = request_body[1]['retweets']
        time_frame = request_body[0]['timeFrame'].split(' ')
        counties = request_body[0]['county']
        account_type_list = request_body[0]['accountType']
    except Exception as e:
        print(e, "Something went wrong with extracting time frame and county")

    tweets = analysis.get_filtered_tweets(time_frame, counties, account_type_list, retweets)
    return tweets


@app.route('/get_counts', methods=['POST'])
def get_counts():
    """
    Get the count of tweets per county based on the request parameters.

    The request body should contain JSON data with the following structure:
    [
        "start_date end_date",
        ["list_of_account_types"]
    ]

    Returns:
        Response: JSON object containing the count of tweets per county.
    """
    request_body = request.get_json()

    time_frame = None
    counties = None
    account_type_list = None

    try:
        time_frame = request_body[0].split(' ')
        counties = None
        account_type_list = request_body[1]
    except Exception as E:
        print(E, "Something went wrong with extracting time frame or account type")

    tweets = analysis.get_filtered_tweets(time_frame, counties, account_type_list)
    tweets = json.loads(tweets)
    county_tweet_counts = defaultdict(int)
    for tweet in tweets:
        county = tweet["location"]
        county_tweet_counts[county] += 1

    return jsonify({"counts": county_tweet_counts})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
