import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, CircularProgress, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import { BASE_URL } from '../config';

const UpdateAvatar = ({ user }) => {
    const [avatar, setAvatar] = useState(null);
    const isMobile = useMediaQuery("(max-width: 634px)");
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // State to control loading
    const [open, setOpen] = useState(false); // State to control dialog open/close
    const theme = useTheme();

    const handleClickOpen = () => {
        setOpen(true); // Open the dialog
    };

    const handleClose = () => {
        setOpen(false); // Close the dialog
        setMessage(''); // Reset message on close
        setAvatar(null); // Reset avatar on close
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage(''); // Reset message
        setLoading(true); // Set loading to true

        const formData = new FormData();
        formData.append('avatar', avatar);
        formData.append('userId', user._id);

        try {
            const response = await fetch(`${BASE_URL}api/users/avatar/${user._id}`, {
                method: 'PATCH',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json(); // Get error details from the response
                throw new Error(`Error: ${errorData.error || 'Something went wrong'}`);
            }

            const result = await response.json();
            setMessage('Avatar updated. Refresh to load new avatar.');
            handleClose();
        } catch (error) {
            setMessage(`Error updating avatar: ${error.message}`);
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    return (
        <div style={{ alignSelf: 'center', margin: 15 }}>
            <Button variant="outlined" onClick={handleClickOpen}>
            {isMobile ? <AiFillEdit /> :  'Edit Avatar'}
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Update Avatar
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <AiFillCloseCircle />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <Stack spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
                            <TextField
                                type="file"
                                accept="image/*"
                                onChange={(e) => setAvatar(e.target.files[0])}
                                required
                                sx={{ backgroundColor: theme.palette.background.stack, width: '100%' }} // Ensure consistent styling
                            />
                            <Button
                                type="submit"
                                variant="outlined"
                                sx={{ backgroundColor: theme.palette.background.stack }}
                                disabled={loading} // Disable button when loading
                            >
                                {loading ? <CircularProgress size={24} /> : 'Update Avatar'}
                            </Button>
                            {message && (
                                <Typography variant="body2" sx={{ textAlign: 'center', color: loading ? 'blue' : 'red' }}>
                                    {message}
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UpdateAvatar;
