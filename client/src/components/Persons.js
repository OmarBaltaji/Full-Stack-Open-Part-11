/* eslint-disable react/prop-types */
import React from "react";
import personsService from "../services/persons";
import { notify } from "../utils/notification";

const Persons = ({ persons, setPersons, setFeedback }) => {
  const onRemove = (person) => {
    const confirm = window.confirm(`Delete ${person.name} ?`);
    if (confirm) {
      personsService.deletePerson(person.id).then(() => {
        setPersons(persons.filter(p => p.id !== person.id));
      });
      notify(`Deleted ${person.name}`, setFeedback);
    }
  }; 

  return (
    <div className="persons-container">
      {
        persons.map((person) => (
          <div key={person.id} className="mb-3 person-wrapper">
            <span className="mr-3">
              {person.name} / {person.number}
            </span>
            <button className="rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2" onClick={() => onRemove(person)}>Delete</button>
          </div>
        ))
      }
    </div>
  );
};


export default Persons;