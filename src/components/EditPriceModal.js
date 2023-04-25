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
