from datetime import datetime
from bson import json_util
import pymongo
import json
import os 
from dotenv import load_dotenv

load_dotenv()

class Analysis:
    MONGO_URI = os.getenv("MONGO_URI")
    connection = pymongo.MongoClient(MONGO_URI)

    def get_filtered_tweets(self, time_frame=None, counties=None, account_type_list=None, retweets=True):
        """
        We want this function to filter based on requested params
        :param retweets: Should we include retwweets?
        :param account_type_list: what type of account is sending out the tweets
        :param time_frame: this either goes in increments of 1 Day, week, month, year
                    or the user can give you a custom upper and lower bound
        :param counties: a single or list of selected florida counties that we will filter from
        :return: a dataframe with those rows
        """
        db = self.connection.tweets
        tweets = db.all_tweets
        query = {}

        account_types = {
            "government": "gov",
            "academic": "acad",
            "media": "media",
            "tourism": "tourbiz",
            "other": "other"
        }

        if counties or account_type_list or time_frame:
            if retweets is not None:
                if not retweets:
                    query["is_retweet"] = False  # This includes only original tweets
            if account_type_list:
                if len(account_type_list) > 0:
                    current_account_types = [account_types[account.lower()] for account in account_type_list]
                    query["label"] = {"$in": current_account_types}
                else:
                    query = {}
            if len(time_frame) == 2:
                start_date_str, end_date_str = time_frame
                start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
                end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
                query['time'] = {'$gte': start_date, '$lte': end_date}

            if counties:
                query["location"] = {"$in": counties}

            cursor = tweets.find(query)
        else:
            cursor = tweets.find()

        results = []
        for doc in cursor:
            del doc["_id"]
            json_string = json.dumps(doc, default=json_util.default)
            results.append(json_string)

        json_array = '[' + ', '.join(results) + ']'
        return json_array

