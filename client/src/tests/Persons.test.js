import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Persons from "../components/Persons";
import userEvent from "@testing-library/user-event";
import personsService from "../services/persons";

jest.mock('../services/persons.js');

const persons = [
  {
    id: '1',
    name: 'test user 1',
    number: '213-120391'
  },
  {
    id: '2',
    name: 'test user 2',
    number: '213-125511'
  },
  {
    id: '3',
    name: 'test user 3',
    number: '213-120645'
  },
];

afterEach(() => {
  jest.clearAllMocks();
});

describe("<Persons />", () => {
  test("renders correct number of person entries", () => {
    const setPersons = jest.fn();
    const setFeedback = jest.fn();
    const { container } = render(<Persons persons={persons} setPersons={setPersons} setFeedback={setFeedback} />);

    const element = container.querySelector('.persons-container');
    expect(element).toBeDefined();  

    const personsDivs = container.querySelectorAll('.person-wrapper');
    expect(personsDivs.length).toBe(persons.length);
  });

  test("displays name and number for each person", () => {
    const setPersons = jest.fn();
    const setFeedback = jest.fn();
    render(<Persons persons={persons} setPersons={setPersons} setFeedback={setFeedback} />);

    persons.forEach(person => {
      expect(screen.getByText(`${person.name} / ${person.number}`)).toBeInTheDocument();
    });
  });

  test("deletes a person after confirmation", async () => {
    const setPersons = jest.fn();
    const setFeedback = jest.fn();
    const personsToDelete = persons[0];
    
    window.confirm = jest.fn(() => true);
    personsService.deletePerson.mockResolvedValueOnce();

    render(<Persons persons={persons} setPersons={setPersons} setFeedback={setFeedback} />);

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(`Delete ${personsToDelete.name} ?`);
      expect(personsService.deletePerson).toHaveBeenCalledWith(personsToDelete.id);
      expect(setPersons).toHaveBeenCalled();
      expect(setFeedback).toHaveBeenCalledWith({"message": `Deleted ${personsToDelete.name}`, "type": "success"});
    });
  });

  test("canceling delete does nothing", async () => {
    const setPersons = jest.fn();
    const setFeedback = jest.fn();
    
    window.confirm = jest.fn(() => false);

    render(<Persons persons={persons} setPersons={setPersons} setFeedback={setFeedback} />);

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(personsService.deletePerson).not.toHaveBeenCalled();
      expect(setPersons).not.toHaveBeenCalled();
      expect(setFeedback).not.toHaveBeenCalled();
    });
  });

  test("render empty container when no persons", () => {
    const setPersons = jest.fn();
    const setFeedback = jest.fn();
    
    const { container } = render(<Persons persons={[]} setPersons={setPersons} setFeedback={setFeedback} />);

    const personsItems = container.querySelectorAll('.person-wrapper');
    expect(personsItems.length).toBe(0);
  });
});
