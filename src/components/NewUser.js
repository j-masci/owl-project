import React, {useMemo, useState} from "react";
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField as MUITextField} from '@material-ui/core';
import moment from 'moment';
import MUIAlert from '@mui/material/Alert';

const boxStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 5,
};

const checkDateFormat = dob => {
    return dob && moment(dob, "YYYY-MM-DD", true).isValid();
}

const TextField = props => {
    return <MUITextField margin="normal" variant="outlined" fullWidth={true} {...props} />
}

const NewUser = ({closeModal, isOpen, addUser}) => {

    const [ username, setUsername ] = useState('');
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ dob, setDob ] = useState('');
    const [ errors, setErrors ] = useState([]);

    const dateValid = useMemo(() => {
        return checkDateFormat(dob);
    }, [ dob ]);


    const handleSubmit = async () => {
        setErrors([]);
        if ( dob && ! dateValid ) {
            setErrors([
                "Date format must be: YYYY-MM-DD."
            ]);
        } else {

            if ( username && firstName && lastName && dob ) {

                const [ success, msg ] = await addUser({
                    username,
                    first_name: firstName,
                    last_name: lastName,
                    date_of_birth: dob.replaceAll('-', '')
                });

                if ( success ) {
                    setUsername('');
                    setFirstName('');
                    setLastName('');
                    setDob('');
                    setErrors([]);
                    closeModal();
                } else {
                    setErrors([msg]);
                }
            } else {
                setErrors(["Please fill in all fields."]);
            }
        }
    }

    return (
        <>
            {isOpen && (
                <Modal
                    open={isOpen}
                    onClose={closeModal}
                >
                    <Box sx={boxStyles}>
                        <Typography variant="h3" component="h2">
                            Add User
                        </Typography>
                        <form onSubmit={e => {
                            e.preventDefault();
                            handleSubmit();
                        }}>
                            <TextField
                                key="user"
                                label="Username"
                                required={true}
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                            <TextField
                                key="first"
                                label="First Name"
                                required={true}
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                            />
                            <TextField
                                key="last"
                                label="Last Name"
                                required={true}
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                            />
                            <TextField
                                key="dob"
                                label="Date Of Birth (yyyy-mm-dd)"
                                required={true}
                                value={dob}
                                onChange={e => setDob(e.target.value)}
                                error={dob && ! dateValid}
                            />
                            {errors && errors.map(error => (
                                <Alert severity="error" onClose={() => setErrors([])}>{error}</Alert>
                            ))}
                            <Button type="submit" variant="contained" style={{ margin: '10px 0' }} onClick={e => {
                                e.preventDefault();
                                handleSubmit();
                            }}>
                                Submit
                            </Button>
                        </form>
                    </Box>
                </Modal>
            )}
        </>
    )
}

const Alert = styled(MUIAlert)`
    margin: 10px 0;
`

export default NewUser;