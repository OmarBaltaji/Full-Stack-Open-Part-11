import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonForm from "../components/PersonForm";
import personsService from "../services/persons";

jest.mock("../services/persons.js");

afterEach(() => {
  jest.clearAllMocks();
});

test("<PersonForm /> updates parent state and calls onAddNew", async () => {
  const user = userEvent.setup();
  const setFeedback = jest.fn();
  const setPersons = jest.fn();

  const mockName = "test user 4";
  const mockNumber = "213-1412410";
  const mockCreatedPerson = { name: mockName, number: mockNumber };

  personsService.create.mockResolvedValueOnce(mockCreatedPerson);

  const { container } = render(<PersonForm persons={[]} setFeedback={setFeedback} setPersons={setPersons} />);

  const inputName = container.querySelector("#person-name");
  const inputNumber = container.querySelector("#person-number");
  const saveButton = screen.getByText("Add");

  await user.type(inputName, mockName);
  await user.type(inputNumber, mockNumber);

  await user.click(saveButton);

  await waitFor(() => {
    expect(personsService.create).toHaveBeenCalledTimes(1);
    expect(personsService.create).toHaveBeenCalledWith(mockCreatedPerson);

    expect(setPersons).toHaveBeenCalledWith([mockCreatedPerson]);
    expect(setFeedback).toHaveBeenCalledWith({ "message": `Added ${mockCreatedPerson.name}`, "type": "success" });

    expect(inputName.value).toBe("");
    expect(inputNumber.value).toBe("");
  });
});

test("updates existing person after confirmation", async () => {
  const user = userEvent.setup();
  const setFeedback = jest.fn();
  const setPersons = jest.fn();

  const existingPerson = { id: "1", name: "John Doe", number: "123" };

  const updatedPerson = { id: "1", name: "John Doe", number: "999" };

  jest.spyOn(window, "confirm").mockReturnValue(true);
  personsService.update.mockResolvedValueOnce(updatedPerson);

  const { container } = render(<PersonForm persons={[existingPerson]} setPersons={setPersons} setFeedback={setFeedback} />);

  const inputName = container.querySelector("#person-name");
  const inputNumber = container.querySelector("#person-number");
  const saveButton = screen.getByText("Add");

  await user.type(inputName, updatedPerson.name);
  await user.type(inputNumber, updatedPerson.number);

  await user.click(saveButton);

  await waitFor(() => {
    expect(personsService.update).toHaveBeenCalledWith({
      ...existingPerson,
      number: updatedPerson.number
    });

    expect(setPersons).toHaveBeenCalledWith([updatedPerson]);

    expect(setFeedback).toHaveBeenCalledWith({ message: `Phone number of ${updatedPerson.name} updated!`, type: "success" });

    expect(inputName.value).toBe("");
    expect(inputNumber.value).toBe("");
  });
});

test("cancelling update does nothing", async () => {
  const user = userEvent.setup();
  const setFeedback = jest.fn();
  const setPersons = jest.fn();
  
  const existingPerson = { id: "1", name: "John Doe", number: "123" };
  
  jest.spyOn(window, "confirm").mockReturnValue(false);

  const { container } = render(<PersonForm persons={[existingPerson]} setPersons={setPersons} setFeedback={setFeedback} />);

  const inputName = container.querySelector("#person-name");
  const inputNumber = container.querySelector("#person-number");
  const saveButton = screen.getByText("Add");

  await user.type(inputName, existingPerson.name);
  await user.type(inputNumber, "999");

  await user.click(saveButton);

  await waitFor(() => {
    expect(personsService.update).not.toHaveBeenCalled();

    expect(setPersons).not.toHaveBeenCalled();
    expect(setFeedback).not.toHaveBeenCalled();

    // Form is not reset
    expect(inputName.value).toBe(existingPerson.name);
    expect(inputNumber.value).toBe("999");
  });
});