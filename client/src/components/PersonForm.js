import React from "react";

const PersonForm = ({ onAddNew, newName, newNumber, onChange }) =>  (
  <form onSubmit={onAddNew}>
    <div className="mb-3">
      <label className="font-semibold mr-3">Name</label> 
      <input 
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
        value={newName}
        onChange={({ target: { value } }) => onChange(value, "name")} 
      />
    </div>
    <div>
      <label className="font-semibold mr-3">Number</label>
      <input 
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
        value={newNumber}
        onChange={({ target: { value } }) => onChange(value, "number")} 
      />
    </div>
    <div className="my-3">
      <button className="rounded bg-slate-500 hover:bg-slate-700 text-white px-4 py-2" type='submit'>Add</button>
    </div>
  </form>
);

PersonForm.propTypes = {
  onAddNew: Function,
  newName: String,
  newNumber: String,
  onChange: Function
};

export default PersonForm;