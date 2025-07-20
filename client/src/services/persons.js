import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(res => res.data);
};

const create = (newPersonObj) => {
  const request = axios.post(baseUrl, newPersonObj);
  return request.then(res => res.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then(res => res.status);
};

const update = (personObject) => {
  const request = axios.put(`${baseUrl}/${personObject.id}`, personObject);
  return request.then(res => res.data);
};


const personsService = { getAll, create, deletePerson, update };

export default personsService;