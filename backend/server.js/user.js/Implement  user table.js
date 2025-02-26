import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Pagination } from 'react-bootstrap';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [newUser, setNewUser] = useState({ name: '', email: '', dob: '', gender: '', country: '', role: '' });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users?page=${currentPage}`)
      .then(res => {
        setUsers(res.data.users);
        setTotalPages(res.data.pages);
      })
      .catch(error => console.error(error));
  }, [currentPage]);

  const handleAddUser = () => {
    axios.post('http://localhost:5000/api/users', newUser)
      .then(res => {
        alert(res.data.message);
        setNewUser({ name: '', email: '', dob: '', gender: '', country: '', role: '' });
        setCurrentPage(1);  // Reload users
      })
      .catch(error => alert('Error adding user'));
  };

  const handleEditUser = (id, updatedUser) => {
    axios.put(`http://localhost:5000/api/users/${id}`, updatedUser)
      .then(res => {
        alert(res.data.message);
        setCurrentPage(1);  // Reload users
      })
      .catch(error => alert('Error updating user'));
  };

  const handleDeleteUser = (id) => {
    axios.delete(`http://localhost:5000/api/users/${id}`)
      .then(res => {
        alert(res.data.message);
        setCurrentPage(1);  // Reload users
      })
      .catch(error => alert('Error deleting user'));
  };

  const handleCloneUser = (id, name) => {
    axios.post('http://localhost:5000/api/clone-user', { name })
      .then(res => {
        alert(res.data.message);
        setCurrentPage(1);  // Reload users
      })
      .catch(error => alert('Error cloning user'));
  };

  return (
    <div>
      <Form>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
        </Form.Group>
        {/* Add more fields for email, dob, etc. */}
        <Button onClick={handleAddUser}>Add User</Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Button onClick={() => handleEditUser(user._id, { ...user })}>Edit</Button>
                <Button onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                <Button onClick={() => handleCloneUser(user._id, user.name)}>Clone</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(totalPages).keys()].map(page => (
          <Pagination.Item key={page} active={page + 1 === currentPage} onClick={() => setCurrentPage(page + 1)}>
            {page + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default UserTable;
