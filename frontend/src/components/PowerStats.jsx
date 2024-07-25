"use client"

import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Button from "@mui/material/Button"
import {Box, Paper, Typography} from "@mui/material";

const PowerStats = () => {
  const [startDate, setStartDate] = useState(new Date('2018-01-01 00:00'));
  const [endDate, setEndDate] = useState(new Date('2019-01-01 00:00'));
  const [checkboxes, setCheckboxes] = useState({
    mean: false,
    max: false,
    min: false,
    median: false,
    sum: false
  })
  const [load, setLoad] = useState('');
  const [day, setDay] = useState('');

  const [result, setResult] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleLoadChange = (event) => {
    setLoad(event.target.value);
  };
  const handleDayChange = (event) => {
    setDay(event.target.value);
  };

  const getCheckedItems = (checkboxStates) => {
    return Object.keys(checkboxStates)
      .filter(key => checkboxStates[key])
      .join(', ');
  };

  const handleCheck = (event) => {
    const { name, checked } = event.target;
    setCheckboxes(prevState => ({
      ...prevState,
          [name]: checked
    }));
  }

  const headers = ["Day","Load Type","Usage","Week Status", "Date"]

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const formattedStartDate = moment(startDate).format('DD/MM/YYYY HH:mm');
      const formattedEndDate = moment(endDate).format('DD/MM/YYYY HH:mm');
      const response = await axios.get('http://localhost:5000/power_stats', {
        params: {
          start_time: formattedStartDate,
          end_time: formattedEndDate,
          operation: getCheckedItems(checkboxes),
          day_of_week: day,
          load_type: load
        },
      });
      setResult(response.data);
      setData(response.data.filtered_data);

    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Filters:</h1>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={2}
      >
        <table>
            <tbody>
            <tr>
              <td>
                <label>Start Date: </label>
              </td>
              <td>
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MM/dd/yyyy h:mm aaaa"
                  className="border border-black"
                />
              </td>
              <td><label className="pl-8">Day of Week</label></td>
              <td>
                <select name="day_of_week" value={day} onChange={handleDayChange}>
                  <option value="">All days</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>End Date: </label>
              </td>
              <td>
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MM/dd/yyyy h:mm aaaa"
                  className="border border-black"
                />
              </td>
              <td><label className="pl-8">Load Type</label></td>
              <td>
                <select name="load_type" value={load} onChange={handleLoadChange}>
                  <option value="">All loads</option>
                  <option value="Light_Load">Light Load</option>
                  <option value="Medium_Load">Medium Load</option>
                  <option value="Maximum_Load">Maximum Load</option>
                </select>
              </td>
            </tr>
            </tbody>
          </table>
        <div className="flex flex-col items-center justify-center">
          <div className="flex">
            <label className="flex items-center mr-4">
              Include Mean
              <input type="checkbox" name="mean" checked={checkboxes.mean} onChange={handleCheck} />
            </label>
            <label className="flex items-center mr-4">
              Include Max
              <input type="checkbox" className="ml-1" name="max" checked={checkboxes.max} onChange={handleCheck} />
            </label>
            <label className="flex items-center">
              Include Min
              <input type="checkbox" className="ml-1" name="min" checked={checkboxes.min} onChange={handleCheck} />
            </label>
          </div>
          <div className="flex mt-2">
            <label className="flex items-center mr-4">
              Include Median
              <input type="checkbox" className="ml-1" name="median" checked={checkboxes.median} onChange={handleCheck} />
            </label>
            <label className="flex items-center">
              Include Sum
              <input type="checkbox" className="ml-1" name="sum" checked={checkboxes.sum} onChange={handleCheck} />
            </label>
          </div>
        </div>
      </Box>
      <div>
        <Button onClick={fetchStats} variant="contained" disabled={loading}>
          {loading ? 'Loading...' : 'Get Stats'}
        </Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div>
        {result && (
          <div>
            {result.result && typeof result.result === 'object' && (
              <div>
                <h1>Statistics:</h1>
                {result.result.mean !== undefined && <Typography>Mean: {result.result.mean.toFixed(2)}</Typography>}
                {result.result.min !== undefined && <Typography>Min: {result.result.min.toFixed(2)}</Typography>}
                {result.result.max !== undefined && <Typography>Max: {result.result.max.toFixed(2)}</Typography>}
                {result.result.sum !== undefined && <Typography>Sum: {result.result.sum.toFixed(2)}</Typography>}
                {result.result.median !== undefined && <Typography>Median: {result.result.median.toFixed(2)}</Typography>}
              </div>
            )}
            <div>
              <h2>Filtered Data:</h2>
              {data?.map((item, index) => (
                <div key={index}>{JSON.stringify(item)}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerStats;