/* eslint-disable react/prop-types */
import React, { useState } from "react";
import personsService from "../services/persons";
import { notify } from "../utils/notification";

const PersonForm = ({ persons, setPersons, setFeedback }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const onAddNew = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase().trim());
    if (existingPerson) {
      updatePerson(existingPerson);
      return;
    }

    personsService.create({ name: newName, number: newNumber })
      .then((createdPerson) => {
        setPersons(persons.concat(createdPerson));
        notify(`Added ${createdPerson.name}`, setFeedback);
        clearForm();
      })
      .catch(() => {
        notify("Error while adding new person", setFeedback, "error");
      });
  };

  const updatePerson = (person) => {
    const confirm = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`);
    if (confirm) {
      personsService.update({ ...person, number: newNumber })
        .then((updatedPerson) => {
          setPersons(persons.map((p) => p.id === updatedPerson.id ? updatedPerson : p));
          notify(`Phone number of ${updatedPerson.name} updated!`, setFeedback);
          clearForm();
        })
        .catch((error) => {
          console.error(error);
          notify(`Information of ${person.name} has already been removed from server`, setFeedback, "error");
          setPersons(persons.filter(p => p.name !== person.name));
        });
    }
  };

  const handleOnChange = (value, field) => {
    switch(field) {
    case "name":
      setNewName(value);
      break;
    case "number":
      setNewNumber(value);
      break;
    default:
      break;
    }
  };

  const clearForm = () => {
    setNewName("");
    setNewNumber("");
  };

  return (
    <form onSubmit={onAddNew}>
      <div className="mb-3">
        <label className="font-semibold mr-3">Name</label> 
        <input
          id="person-name" 
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
          value={newName}
          onChange={({ target: { value } }) => handleOnChange(value, "name")} 
        />
      </div>
      <div>
        <label className="font-semibold mr-3">Number</label>
        <input 
          id="person-number"
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
          value={newNumber}
          onChange={({ target: { value } }) => handleOnChange(value, "number")} 
        />
      </div>
      <div className="my-3">
        <button className="rounded bg-slate-500 hover:bg-slate-700 text-white px-4 py-2" type='submit'>Add</button>
      </div>
    </form>
  );
};

export default PersonForm;