import React from "react";
import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import personsService from "./services/persons";
import Feedback from "./components/Feedback";
import "./index.css";

function App() {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [feedback, setFeedback] = useState({
    "message": null,
    "type": "",
  });

  useEffect(() => {
    personsService.getAll().then(personsList => {
      setPersons(personsList);
    });
  }, []);

  return (
    <div className='ml-10 mt-5'>
      <h1 className='text-xl font-bold mb-5'>Phonebook</h1>
      <Feedback feedback={feedback} />
      <Filter persons={persons} setFilteredPersons={setFilteredPersons} />
      <h2 className='text-lg font-bold my-5'>Add a new</h2>
      <PersonForm persons={persons} setFeedback={setFeedback} setPersons={setPersons}/>
      <h2 className='text-lg font-bold mt-5 mb-3'>Numbers</h2>
      <Persons persons={filteredPersons} setFeedback={setFeedback} setPersons={setPersons} />
    </div>
  );
}

export default App;
