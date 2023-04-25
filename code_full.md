
### Price.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const priceSchema = new Schema(
  {
    ticker: { type: String, required: true },
    price: { type: Number, required: true },
    timestamp: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Price = mongoose.model("Price", priceSchema);

module.exports = Price;

### prices.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Price = require('../models/Price');

// Replace YOUR_API_KEY with your actual Alpha Vantage API key
const ALPHA_VANTAGE_API_KEY = '5JEXO6JFMUAJ2CG8';

// Get all prices
router.get('/', async (req, res) => {
  try {
    const prices = await Price.find();
    res.json(prices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get the latest MARA price and save it to the database
router.get('/update', async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MARA&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    const priceData = response.data['Global Quote'];
    const currentPrice = parseFloat(priceData['05. price']);

    const newPrice = new Price({
      price: currentPrice,
      timestamp: new Date(),
    });

    const savedPrice = await newPrice.save();
    res.json(savedPrice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single price by ID
router.get('/:id', async (req, res) => {
    try {
      const price = await Price.findById(req.params.id);
      if (!price) {
        return res.status(404).json({ message: 'Price not found' });
      }
      res.json(price);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Update a single price by ID
  router.patch('/:id', async (req, res) => {
    try {
      const price = await Price.findById(req.params.id);
      if (!price) {
        return res.status(404).json({ message: 'Price not found' });
      }
  
      if (req.body.price) {
        price.price = req.body.price;
      }
  
      const updatedPrice = await price.save();
      res.json(updatedPrice);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Delete a single price by ID
  router.delete('/:id', async (req, res) => {
    try {
      const price = await Price.findById(req.params.id);
      if (!price) {
        return res.status(404).json({ message: 'Price not found' });
      }
  
      await price.remove();
      res.json({ message: 'Price deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;

### app.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const pricesRouter = require("./routes/prices");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use("/prices", pricesRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

### index.html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
</html>

### manifest.json

{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}

### package.json

{
  "name": "mara-price-checker",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.3.6",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "mongoose": "^7.0.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "concurrently \"npm run start-frontend\" \"npm run start-backend\"",
    "start-frontend": "react-scripts start",
    "start-backend": "node backend/app.js",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "concurrently": "^8.0.1"
  }
}

### reportWebVitals.js

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

### index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

### PriceTable.js

// PriceTable.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import EditPriceModal from "./EditPriceModal";

const PriceTable = () => {
  const [prices, setPrices] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get("/prices");
      setPrices(data);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  const handleUpdate = () => {
    setSelectedPrice(null);
    fetchData();
  };

  const handleDelete = () => {
    setSelectedPrice(null);
    fetchData();
  };

  return (
    <div>
      <h2>Price Table</h2>
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Price</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price) => (
            <tr key={price._id}>
              <td>{price.ticker}</td>
              <td>{price.price}</td>
              <td>{new Date(price.timestamp).toLocaleString()}</td>
              <td>
                <button onClick={() => setSelectedPrice(price)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedPrice && (
        <EditPriceModal
          price={selectedPrice}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default PriceTable;

### EditPriceModal.js

import React, { useState } from "react";
import axios from "axios";

const EditPriceModal = ({ price, onUpdate, onDelete }) => {
  const [newPrice, setNewPrice] = useState(price.price);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/prices/${price._id}`, { price: newPrice });
      onUpdate();
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/prices/${price._id}`);
      onDelete();
    } catch (error) {
      console.error("Error deleting price:", error);
    }
  };

  return (
    <div>
      <h2>Edit Price</h2>
      <form onSubmit={handleSubmit}>
        <label>
          New Price:
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
        </label>
        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </form>
    </div>
  );
};

export default EditPriceModal;

### App.test.js

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

### setupTests.js

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

### App.js

import "./App.css";
import PriceTable from "./components/PriceTable";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MARA Price Checker</h1>
</header>
<main>
<PriceTable />
</main>
</div>
);
}

export default App;
