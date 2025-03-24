import React, { useState } from 'react';
import '../styling/TimeFrameSelector.css';
import InformationTip from "./InformationTip";
import { preventDefault } from "leaflet/src/dom/DomEvent";

/**
 * TimeFrameSelector component for selecting a date range.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.onTimeFrameChange - Callback function to handle changes in the selected time frame.
 * @param {string} [props.informationTitle] - The title of the information tip.
 */
function TimeFrameSelector({ onTimeFrameChange, informationTitle }) {

    const today = new Date();
    const year = today.getFullYear();

    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    const todayFormatted = `${year}-${month}-${day}`;

    // State for start and end dates
    const [startDate, setStartDate] = useState('2018-01-01');
    const [endDate, setEndDate] = useState('2025-01-07');

    // Minimum date for start and end dates
    // This controls how far forward and back you can scroll 
    const minDate = '2018-01-01';
    const maxDate = '2025-01-07';

    /**
     * Handles the change of the start date input.
     * @param {Event} e - The change event.
     */
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        onTimeFrameChange(e.target.value, endDate);
    };

    /**
     * Handles the change of the end date input.
     * @param {Event} e - The change event.
     */
    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        onTimeFrameChange(startDate, e.target.value);
    };

    return (
        <div>
            <InformationTip title={informationTitle} information={"<ul> <li><strong>Default:</strong> From 2018 to Present Day</li>  <li><strong>Functionality:</strong> specify a time frame to see tweets from.</li> </ul>"} />
            <div className="time-frame-selector clearfix">
                <label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        onKeyDown={(e) => (preventDefault(e))}
                        // min and max date fields are used to limit the date range here
                        min={minDate}
                        max={endDate}
                    />
                </label>
                <label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        onKeyDown={(e) => (preventDefault(e))}
                        min={startDate}
                        max={maxDate}
                    />
                </label>
            </div>
        </div>
    );
}

export default TimeFrameSelector;
