import axios from 'axios'
const baseUrl = '/api/persons'

async function getAll () {
  const request = await axios.get(baseUrl)
  return request.data
}

async function create (newContact)  {
  const request =  await axios.post(baseUrl, newContact)
  return request.data
}

async function update (id, newContact) {
  const request = await axios.put(`${baseUrl}/${id}`, newContact)
  return request.data
}

async function deleteContact (id) {
  const request = await axios.delete(`${baseUrl}/${id}`)
  return request.data
}

export default { getAll, create, update, deleteContact }