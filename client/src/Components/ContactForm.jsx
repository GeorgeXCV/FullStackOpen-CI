import React from 'react'
import Button from './Button'

const ContactForm = ({ newName, handleNameChange, newNumber, handleNumberChange, addPerson }) => {
  return (
    <form>
      <div>
          Name: <input type="text" value={newName} onChange={handleNameChange} />
          Number: <input type="text" value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <Button text="Add" handleClick={addPerson}/>
      </div>
    </form>
  )
}

export default ContactForm