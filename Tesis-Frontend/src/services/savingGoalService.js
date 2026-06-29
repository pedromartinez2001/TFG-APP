import axios from "./axios";

const getAll = async () => {
  const request = await axios.get("/saving-goal");
  return request.data;
};

const create = async (savingGoal) => {
  const request = await axios.post("/saving-goal", savingGoal);
  return request.data;
};

const update = async (id, data) => {
  const request = await axios.put(`/saving-goal/${id}`, data);
  return request.data;
};

const deleteData = async (id) => {
  const request = await axios.delete(`/saving-goal/${id}`);
  return request.data;
};

export default { getAll, create, update, deleteData };