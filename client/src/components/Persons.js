/* eslint-disable @stylistic/js/linebreak-style */
import React from "react";

const Persons = ({ persons, onRemove }) =>
  persons.map((person) => (
    <div key={person.id} className="mb-3">
      <span className="mr-3">
        {person.name} / {person.number}
      </span>
      <button className="rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2" onClick={() => onRemove(person)}>Delete</button>
    </div>
  ));
    
Persons.propTypes = {
  persons: Array,
  onRemove: Function
};

export default Persons;