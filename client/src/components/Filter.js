/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

const Filter = ({ persons, setFilteredPersons }) => {
  const [filter, setFilter] = useState("");
    
  useEffect(() => {
    setFilteredPersons(filter.length === 0 ? persons : persons.filter(p => p.name.toLowerCase().includes(filter.trim().toLowerCase())));
  }, [filter, persons]);

  return (
    <div>
      <label className="font-semibold mr-3">Filter shown with</label>
      <input 
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
        value={filter} 
        onChange={({ target: { value } }) => setFilter(value)}     
      />
    </div>
  );
};

export default Filter;