import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, CircularProgress, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import { BASE_URL } from '../config';

const UpdateAvatar = ({ user }) => {
    const [avatar, setAvatar] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const isMobile = useMediaQuery("(max-width: 634px)");
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setMessage('');
        setAvatar(null);
        setImagePreview(null);
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
                const errorData = await response.json();
                throw new Error(`Error: ${errorData.error || 'Something went wrong'}`);
            }
    
            const result = await response.json();
            console.log(result); // Log the result for debugging
            setMessage('Avatar updated. Refreshing the page...'); // Notify user
            handleClose(); // Close the dialog
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Error updating avatar:', error); // Log the error
            setMessage(`Error updating avatar: ${error.message}`);
        } finally {
            setLoading(false); // Ensure loading is set to false
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setMessage("File size should not exceed 2 MB.");
                setAvatar(null);
                setImagePreview(null);
                return;
            }
            setAvatar(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div style={{ alignSelf: 'center', margin: 15 }}>
            <Button variant="outlined" onClick={handleClickOpen}>
                {isMobile ? <AiFillEdit /> : 'Edit Avatar'}
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>
                    Update Avatar

                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <Stack spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
                            {imagePreview && (
                                <Box
                                    component="img"
                                    src={imagePreview}
                                    alt="Avatar Preview"
                                    sx={{ width: 200, height: 200, borderRadius: '50%', marginBottom: 2 }}
                                />
                            )}
                            <TextField
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                sx={{ backgroundColor: theme.palette.background.stack, width: '100%' }}
                            />

                            <Button
                                type="submit"
                                variant="outlined"
                                sx={{ backgroundColor: theme.palette.background.stack }}
                                disabled={loading}
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
