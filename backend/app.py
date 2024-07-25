from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the CSV file
df = pd.read_csv('static/Steel_industry_data.csv', parse_dates=['date'])
df['date'] = pd.to_datetime(df['date'], format='%d/%m/%Y %H:%M')
df.set_index('date', inplace=True)


@app.route('/power_stats', methods=['GET'])
def power_usage():
    start_time = request.args.get('start_time')
    end_time = request.args.get('end_time')
    operation = request.args.get('operation')
    week_status = request.args.get('week_status')
    day_of_week = request.args.get('day_of_week')
    load_type = request.args.get('load_type')

    if not all([start_time, end_time, operation]):
        return jsonify({"error": "Missing parameters"}), 400

    try:
        start_date = pd.to_datetime(start_time, format='%d/%m/%Y %H:%M')
        end_date = pd.to_datetime(end_time, format='%d/%m/%Y %H:%M')
    except ValueError:
        return jsonify({"error": "Invalid datetime format. Use ISO format (e.g., 2020-07-24T00:38:00.000Z)"}), 400

    # filter by given params
    filtered_data = do_filtering(df, start_date, end_date, week_status, day_of_week, load_type)

    if filtered_data.empty:
        return jsonify({"error": "No data in specified datetime range"}), 404

    # perform data calculations
    result = do_calculations(operation, filtered_data)

    # prep data for return
    data = filtered_data.reset_index().to_dict(orient='records')

    return jsonify({
        "operation": operation,
        "result": result,
        "filtered_data": data,
        "start_date": start_date,
        "end_date": end_date
    })


def do_filtering(data, start_date, end_date, week_status, day_of_week, load_type):
    mask = (df.index >= start_date) & (df.index <= end_date)
    if week_status:
        mask &= df['WeekStatus'].isin(week_status)
    if day_of_week:
        mask &= df['Day_of_week'] == day_of_week
    if load_type:
        mask &= df['Load_Type'] == load_type
    filtered_data = df.loc[mask]

    # include columns
    columns_to_include = ['Usage_kWh', 'WeekStatus', 'Day_of_week', 'Load_Type']
    filtered_data = filtered_data[columns_to_include]

    # sort
    filtered_data = filtered_data.sort_index()
    return filtered_data


def do_calculations(operation, data):
    result = {}
    if 'mean' in operation:
        result['mean'] = data['Usage_kWh'].mean()
    if 'min' in operation:
        result['min'] = data['Usage_kWh'].min()
    if 'max' in operation:
        result['max'] = data['Usage_kWh'].max()
    if 'median' in operation:
        result['median'] = data['Usage_kWh'].median()
    if 'sum' in operation:
        result['sum'] = data['Usage_kWh'].sum()

    return result


if __name__ == '__main__':
    app.run()
