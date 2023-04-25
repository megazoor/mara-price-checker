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
        const { data } = await axios.get("http://localhost:5000/prices");
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
