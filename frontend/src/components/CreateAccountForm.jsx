import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {createAccount, reset} from '../features/accounts/accountSlice'
import {toast} from 'react-toastify' 
import Spinner from '../components/Spinner'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


function CreateAccountForm() {
    
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    const [formData, setFormData] = useState({
        accountName: '',
        accountType: '',
        assignedUsers: []
      })

      const { accountName, accountType, assignedUsers } = formData;

      const dispatch = useDispatch()


      const {account, isLoading, isError, isSuccess, message} = useSelector(
        (state) => state.account)

        useEffect(()=> {
            if (isError) {
              toast.error(message)
            }
            if (isSuccess) {
                toast('New account created')
            }
            dispatch(reset())
          }, [account, isError, isSuccess, message, dispatch])
      

      const onChange = (e) => 
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }))

      const onSubmit = (e) => {
        e.preventDefault()
        const accountData = {
            accountName, accountType, assignedUsers
        }
        dispatch(createAccount(accountData))
      }


    
  if (isLoading) {
    return <Spinner/>
  }

  return (
    <>
    <section className='heading'>
    <h5>
        Create a new account
      </h5>
      <form onSubmit={onSubmit}>

      <div className="form-group">
      <input type="text" className='formControl' id='accountName' name='accountName' value={accountName} 
        placeholder='enter account Name' onChange={onChange}/>
      </div>

      <div className="form-group">
      <input type="text" className='formControl' id='accountType' name='accountType' value={accountType} 
        placeholder='enter account type' onChange={onChange}/>
      </div>

      <div className="form-group">
        <button type='submit' className='btn'>Submit</button>
      </div>
      </form>

    </section>

    <section>
    <Button variant="primary" onClick={handleShow}>
        Create Account
      </Button>

      <Modal className='modal' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
    </>
  )
}

export default CreateAccountForm
