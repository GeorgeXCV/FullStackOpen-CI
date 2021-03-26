import React from 'react'
import Button from './Button'

const Contacts = ({ filteredContacts, deleteContact }) => {
  return filteredContacts.map(contact =>
    (
      <p key={contact.id}>{contact.name} {contact.number} <Button text="Delete" handleClick={() => deleteContact(contact.name, contact.id)}/> </p>
    ))
}
export default Contacts