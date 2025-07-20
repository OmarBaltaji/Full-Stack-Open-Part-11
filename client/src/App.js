/* eslint-disable @stylistic/js/linebreak-style */
import React from "react";
import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import personsService from "./services/persons";
import Feedback from "./components/Feedback";
import { notify } from "./utils/notification";
import "./index.css";

function App() {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [feedback, setFeedback] = useState({
    "message": null,
    "type": "",
  });

  useEffect(() => {
    personsService.getAll().then(personsList => {
      setPersons(personsList);
    });
  }, []);

  useEffect(() => {
    setFilteredPersons(filter.length === 0 ? persons : persons.filter(p => p.name.toLowerCase().includes(filter.trim().toLowerCase())));
  }, [filter, persons]);

  const clearForm = () => {
    setNewName("");
    setNewNumber("");
  };

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
    <div className='ml-10 mt-5'>
      <h1 className='text-xl font-bold mb-5'>Phonebook</h1>
      <Feedback feedback={feedback} />
      <Filter filter={filter} setFilter={setFilter} />
      <h2 className='text-lg font-bold my-5'>Add a new</h2>
      <PersonForm onAddNew={onAddNew} newName={newName} newNumber={newNumber} onChange={handleOnChange} />
      <h2 className='text-lg font-bold mt-5 mb-3'>Numbers</h2>
      <Persons persons={filteredPersons} onRemove={onRemove} />
    </div>
  );
}

export default App;
