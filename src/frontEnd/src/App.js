import './App.css';
import Header from "./components/Header";
import Filters from "./components/Filters";
import TimeFrameSelector from "./components/TimeFrameSelector";
import Twitter from "./components/Twitter";
import React, { useState, useEffect } from 'react';
import WordCloud from "./components/WordCloud";
import GallerySwitch from "./components/Gallery";
import ContentHeader from './components/ContentHeader';
import FAQ from './components/faq';

import { Routes, Route, Link } from 'react-router-dom';

function MainApp() {

    const [tweets, setTweets] = useState([]);
    const Account_Type_Options = ["Academic", "Government", "Media", "Other", "Tourism"];
    const County_Options = ["Pasco", "Pinellas", "Hillsborough", "Manatee", "Sarasota"];
    const Word_Cloud_Options = ['Non Geo Single Terms', 'Non-Geo Single User', "Non-Geo Hashtags", 'Geo Single Terms', 'Geo Single User', "Geo Hashtags"];
    const Tweet_Filter_Options = ["With Retweets", "Without Retweets"];

    const [selectedFilters, setSelectedFilters] = useState({
        timeFrame: "2018-01-01 2025-01-07",
        accountType: [],
        county: [],
        wordCloud: [],
        retweetFilter: "Without Retweets", // default to no retweets 
    });

    /* 
    * Function to handle changes in the filters
    * @param {string} filterType - the type of filter being changed
    * @param {string} selectedOptions - the selected options for the filter
    * 
    * This function is called when a filter is changed. It updates the selectedFilters state with the new filter options.
    */
    const handleFilterChange = (filterType, selectedOptions) => {
        setSelectedFilters(prevState => ({
            ...prevState,
            [filterType]: Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]
        }));
    };

    // Set retweet filter on initial fetch. Ensuring it caches
    useEffect(() => {
        handleFilterChange('retweetFilter', "Without Retweets");  // Explicitly set "Without Retweets" as default
    }, []);

    /*
    * Function to handle changes in the time frame
    * @param {string} start - the start date of the time frame
    * @param {string} end - the end date of the time frame
    * 
    * This function is called when the time frame is changed. It updates the selectedFilters state with the new time frame.
    */
    const handleTimeFrameChange = (start, end) => {
        handleFilterChange('timeFrame', start + " " + end);
    };

    /*
    * Function to handle new tweets
    * @param {array} newTweets - the new tweets to display
    * 
    * This function is called when new tweets are fetched. It updates the tweets state with the new tweets.
    */
    const handleTweets = (newTweets) => {
        setTweets(newTweets);
    };

    const [clickedWord, setClickedWord] = useState("");

    /*
    * Function to handle clicks on words in the word cloud
    * @param {string} word - the word that was clicked
    * 
    * This function is called when a word in the word cloud is clicked. It updates the clickedWord state with the new word.
    */
    const handleWordClick = (word) => {
        setClickedWord(word)
    };

    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1400);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleFilterDropdown = () => {
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
    };

    const FilterDropdown = () => (
        <div className={`filter-dropdown ${isFilterDropdownOpen ? 'open' : ''}`}>
            <TimeFrameSelector
                startDate={selectedFilters.timeFrame.split(" ")[0]}
                endDate={selectedFilters.timeFrame.split(" ")[1]}
                onTimeFrameChange={handleTimeFrameChange}
            />
            <Filters
                options={Account_Type_Options}
                Title={"ACCOUNT TYPE"}
                information={"<ul><li><strong>Default:</strong> All Accounts are selected</li><li><strong>Functionality:</strong> Click an option to see tweets from accounts under that category.</li></ul>"}
                onChange={(selectedOptions) => handleFilterChange('accountType', selectedOptions)}
                changeTitleOnSelect={true}
            />
            <Filters
                options={Word_Cloud_Options}
                Title={"WORD CLOUD"}
                information={"<ul><li><strong>Default:</strong> Non Geo Hashtags Selected</li><li><strong>Functionality:</strong> Click an option to see the counts of hashtags under that category.</li></ul>"}
                onChange={(selectedOptions) => handleFilterChange('wordCloud', selectedOptions)}
                isMultiChoice={false}
                changeTitleOnSelect={true}
            />
            <Filters
                options={County_Options}
                Title={"COUNTY"}
                information={"<ul><li><strong>Default:</strong> All counties selected.</li><li><strong>Functionality:</strong> Upon hovering a county, the Map will display how many tweets are about that county.</li></ul>"}
                onChange={(selectedOptions) => handleFilterChange('county', selectedOptions)}
                changeTitleOnSelect={true}
            />
            <Filters 
                options={Tweet_Filter_Options} 
                Title={"RETWEETS"} 
                information={"<ul><li><strong>Default:</strong> Without Retweets</li><li><strong>Functionality:</strong> Select to include or exclude retweets in the displayed tweets.</li></ul>"} 
                onChange={(selectedOptions) => handleFilterChange('retweetFilter', selectedOptions[0])}
                isMultiChoice={false} 
                changeTitleOnSelect={true}
            />
        </div>
    );



    return (
        <div className="App">
            <header className="App-header">
                <Header />
            </header>
            <div className="Filters_Bar">
                {isMobile ? (
                    <>
                        <button className="filter-dropdown-toggle" onClick={toggleFilterDropdown}>
                            {isFilterDropdownOpen ? 'Hide Filters' : 'Show Filters'}
                        </button>
                        <FilterDropdown />
                    </>
                ) : (
                    <>
                        <TimeFrameSelector informationTitle='Time Frame ' onTimeFrameChange={handleTimeFrameChange} />
                        <Filters options={Word_Cloud_Options} Title={"WORD CLOUD"} informationTitle='Word Cloud Type ' information={"<ul><li><strong>Default:</strong> Non Geo Hashtags Selected</li><li><strong>Functionality:</strong> Click an option to see the counts of hashtags under that category.</li></ul>"} onChange={(selectedOptions) => handleFilterChange('wordCloud', selectedOptions)} isMultiChoice={false} changeTitleOnSelect={true} />
                        <Filters options={County_Options} informationTitle='Included Counties ' Title={"COUNTY"} information={"<ul><li><strong>Default:</strong> All counties selected.</li><li><strong>Functionality:</strong> Upon hovering a county, the Map will display how many tweets are about that county.</li></ul>"} onChange={(selectedOptions) => handleFilterChange('county', selectedOptions)} changeTitleOnSelect={true} />
                        <Filters options={Account_Type_Options} informationTitle='Account Types ' Title={"ACCOUNT TYPE"} information={"<ul><li><strong>Default:</strong> All Accounts are selected</li><li><strong>Functionality:</strong> Click an option to see tweets from accounts under that category.</li></ul>"} onChange={(selectedOptions) => handleFilterChange('accountType', selectedOptions)} changeTitleOnSelect={true} />
                        <Filters options={Tweet_Filter_Options} informationTitle='Retweet Filter ' Title={selectedFilters.retweetFilter} information={"<ul><li><strong>Default:</strong> Without Retweets</li><li><strong>Functionality:</strong> Select to include or exclude retweets in the displayed tweets.</li></ul>"} onChange={(selectedOptions) => handleFilterChange('retweetFilter', selectedOptions)} isMultiChoice={false} changeTitleOnSelect={true} />
                    </>
                )}
            </div>
            <div className="Body">
                <div className="Twitter_container">
                    <ContentHeader
                        title="Tweet Display"
                        content="Shows individual tweets related to red tide in the Tampa Bay area. Includes tweet content, date, location, and engagement metrics."
                        filters={"Affected by all filters."}
                    />
                    <Twitter selectedFilters={selectedFilters} onTweetsFetched={handleTweets} clickedWord={clickedWord}/>
                </div>
                <div className="Word_Cloud_container">
                    <ContentHeader title={"Word Cloud"} content={"Click on a word to see the tweets that contain it. Clicking a word will override your current search term."} filters={"Affected by all filters."} />
                    <WordCloud cloud_type={selectedFilters.wordCloud} tweets={tweets} onWordCloudClick={handleWordClick}/>
                </div>
                <div className="Map_container">
                    <GallerySwitch account_types={selectedFilters.accountType} date={selectedFilters.timeFrame} retweetFilter={selectedFilters.retweetFilter[0]} />
                </div>
            </div>
        </div>
    );
}

function App() {

    useEffect(() => {
        // Add Google Analytics script tag dynamically
        const script = document.createElement('script');
        script.src = "https://www.googletagmanager.com/gtag/js?id=G-X55VJPC56Q";
        script.async = true;
        document.head.appendChild(script);
    
        // Initialize Google Analytics
        window.dataLayer = window.dataLayer || [];
        function gtag(){ window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-X55VJPC56Q');
        
      }, []);

    return (
    <div>
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/faq">How to use this Dashboard</Link></li>
            </ul>
        </nav>
        <Routes>
            <Route path="/" element={<MainApp />} />
            <Route path="/faq" element={<FAQ />} />
        </Routes>
    </div>
    );
}

export default App;
