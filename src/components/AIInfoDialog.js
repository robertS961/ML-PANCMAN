import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    IconButton,
    Button,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export default function AIInfoDialog() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* The About AI Button */}
            <Button
                variant="outlined"
                color="inherit"
                onClick={() => setOpen(true)}
            >
                About AI
            </Button>

            {/* The Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle
                    sx={{
                        m: 0,
                        p: 2,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                    }}
                >
                    How the AI Works
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpen(false)}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Box textAlign="center" px={2}>
                        <List sx={{ textAlign: "left", margin: "auto", maxWidth: 500 }}>
                            <ListItem>
                                <ListItemIcon>
                                    <FiberManualRecordIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="The AI is built on a truncated MobileNet. This is a convolutional neural network! This means the AI operates on images!"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <FiberManualRecordIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Hit 'Start Camera', then select the arrow for the direction that the image corresponds too. All of these images will train the AI(shown below)!"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <FiberManualRecordIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Once all the images are collected. Hit 'Train', this will train the AI to recognize the Image with that specific direction."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <FiberManualRecordIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="After 'Train', hit 'Start'. The AI will then take screen shots in real time. It will then predict the direction based off the screen shot."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <FiberManualRecordIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="You’ll see the predicted direction and the confidence of the AI in real time."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <FiberManualRecordIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="If the AI misreads the input you can overwrite it by using WASD or the arrow keys."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <FiberManualRecordIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Careful when training the AI to provide clear photos. Watch your hands, face, background, and variable surroundings."
                                />
                            </ListItem>
                        </List>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
