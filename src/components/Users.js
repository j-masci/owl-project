import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import api from '../api';
import Layout from './Layout';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Delete} from '@material-ui/icons';
import {uniq} from 'lodash';
import { Button } from '@material-ui/core';
import NewUser from "./NewUser";
import MUIAlert from '@mui/material/Alert';
import moment from "moment";

const fetchUsers = async withResult => {
    api.get('users').then(req => {
        if (req.ok) {
            withResult(req.data.payload);
        } else {
            // would have a better error handling strategy in a real app
            console.error("Fetch Users: ", req);
            alert("Failed to fetch users.");
        }
    })
}

const deleteUsers = async (ids, then) => {
    if ( ids.length > 0 ) {
        api.delete('users/delete', {ids: ids.join(',')}).then(req => {
            if (req.ok) {
                then();
            } else {
                console.error("Delete Users: ", req);
                alert("Failed to delete users.");
            }
        })
    }
}

const formatDate = (dateStr, inputFormat, outputFormat) => {

    if ( dateStr ) {
        const _date = moment(dateStr, inputFormat, false);
        if ( _date.isValid() ) {
            return _date.format(outputFormat);
        }
    }

    return '';
}

const Users = () => {

    const [users, setUsers] = useState([]);
    const [deleteIds, setDeleteIds] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [msg, setMsg] = useState("");

    const displayedUsers = users.filter(user => deleteIds.indexOf(user.id) < 0);

    useEffect(() => {
        fetchUsers(setUsers)
    }, []);

    const softDeleteUser = id => {
        setDeleteIds(prevIds => uniq([...prevIds, id]));
    }

    const clickSaveChanges = e => {
        deleteUsers(deleteIds, () => {
            fetchUsers(users => {
                setDeleteIds([]);
                setMsg("User(s) Deleted.");
                setUsers(users);
            })
        })
    }

    const addUser = async(user) => {

        const req = await api.post('users/add', user);
        if ( req.ok && ! req.data.error ) {
            fetchUsers(users => {
                setUsers(users)
                setMsg("User Inserted.");
                setModalOpen(false);
            });
            return [ true, "" ];
        }

        return [ false, req?.data?.error || "Network error."];
    }

    const canSave = users.length > 0 && users.length !== displayedUsers.length;

    return (
        <>
            <NewUser isOpen={modalOpen} closeModal={() => setModalOpen(false)} addUser={addUser}/>
            <Layout>
                <h2>
                    <a href="/">Home</a> > Users ({users.length})
                </h2>
                {canSave && (
                    <Alert severity="warning">
                        Users have been modified. Make sure to save your changes.
                    </Alert>
                )}
                {msg && (
                    <Alert onClose={() => setMsg('')}>{msg}</Alert>
                )}
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="right">Username</TableCell>
                                <TableCell align="right">First Name</TableCell>
                                <TableCell align="right">Last Name</TableCell>
                                <TableCell align="right">Date Of Birth</TableCell>
                                <TableCell align="right">Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedUsers.map((user) => {
                                const dob = formatDate(user.date_of_birth, 'YYYYMMDD', 'YYYY-MM-DD');
                                return (
                                    <TableRow
                                        key={user.id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row">
                                            {user.id}
                                        </TableCell>
                                        <TableCell align="right">{user.username}</TableCell>
                                        <TableCell align="right">{user.first_name}</TableCell>
                                        <TableCell align="right">{user.last_name}</TableCell>
                                        <TableCell align="right">{dob}</TableCell>
                                        <TableCell align="right">
                                            <Delete style={{cursor: "pointer"}} onClick={e => softDeleteUser(user.id)}/>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Buttons>
                    <Button variant="contained" onClick={e => setModalOpen(true)} style={{marginRight: 10}}>New User</Button>
                    <Button variant="contained" disabled={!canSave} onClick={clickSaveChanges}>Save Changes</Button>
                </Buttons>
            </Layout>
        </>
    )
}

const Alert = styled(MUIAlert)`
    margin: 10px 0;
`

const Buttons = styled.div`    
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: 15px;    
`

export default Users;