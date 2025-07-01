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
                            primary="This AI is built on a truncated MobileNet, a convolutional neural network that processes images!"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                            primary="Click 'Start Camera', then select the arrow that matches the direction in the image. These labeled images will be used to train the AI (see below)!"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                            primary="Once you've collected enough images, click 'Train' to teach the AI to recognize directions from screenshots."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                            primary="After training, click 'Start'. The AI will capture real-time screenshots and predict the direction based on what it sees."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                            primary="You'll see the predicted direction and the AI's confidence score updated live."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                            primary="If the AI makes a mistake, you can override it using the WASD or arrow keys."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                            primary="When training, ensure the images are clear. Avoid including hands, faces, busy backgrounds, or inconsistent surroundings."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                            primary="The background music changes based on prediction confidence, you’ll hear the intro, eating, or death jingle based on high, medium, or low accuracy!"
                            />
                        </ListItem>
                        </List>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
