# Steel Industry Data Viewer

An application to do calculations on steel industry power usage over a configurable time range. This project contains a Python Flask to serve and API that uses pandas to interact with csv data, and a React JS frontend to allow users to call the API.

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install the backend requirements.

```bash
cd backend
pip install
python app.py
```
Use npm to to install the frontend requirements
```bash
cd frontend
npm install
npm run dev
```

## Future Plans
It would be nice to display a chart of the returned data to help users visualize how the data changes over time.

If this project requires handling more data in the future, it would be good to move from pandas to pyspark to allow for parallel and iterative processing on large datasets.

If the API needs to grow, the backend could be switched to use FastAPI which would allow for automatic generation of API documentation to help developers consume the API.

## License

[MIT](https://choosealicense.com/licenses/mit/)