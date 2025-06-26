import React, { useState } from "react";
import { useAtom } from "jotai";
import { imgSrcArrAtom } from "../GlobalState";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AllTrainingImages() {
  const [imgSrcArr, setImgSrcArr] = useAtom(imgSrcArrAtom);
  const [imgToDelete, setImgToDelete] = useState(null);

  const handleDelete = (index) => {
    setImgToDelete(index);
  };
 
  const confirmDelete = () => {
    if (imgToDelete !== null) {
      const updatedImages = imgSrcArr.filter((_, idx) => idx !== imgToDelete);
      setImgSrcArr(updatedImages);
      setImgToDelete(null);
    }
  };
  const cancelDelete = () => {
    setImgToDelete(null);
  };

  if (!imgSrcArr.length) {
    return (
      <Box textAlign="center" p={2}>
        <Typography variant="h6">No training images captured yet</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom align="center">
        All Training Images
      </Typography>
      <Grid container spacing={2} style={{ maxHeight: "400px", overflowY: "auto" }}>
        {imgSrcArr.map((img, index) => (
          <Grid item xs={3} key={index}>
            <Paper style={{ padding: "4px", textAlign: "center", position: "relative" }}>
              <IconButton
                aria-label="delete"
                onClick={() => handleDelete(index)}
                sx={{
                  position: "absolute",
                  top: "4px",
                  right: "20px",
                  color: "red",
                  fontSize: "1.5rem",
                  zIndex: 1,
                  "&:hover": {
                    bgcolor: "white",
                    border: "2px solid black",
                    borderRadius: "50%",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
                    transform: "scale(1.25)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <DeleteIcon fontSize="large" />
              </IconButton>
              <img src={img.src} alt={img.label} style={{ maxWidth: "100%" }} />
              <Typography variant="caption" style={{ 
                fontSize: "1rem", 
                display: "block", 
                marginTop: "8px", 
                fontWeight: 600, 
                textTransform: "uppercase",
                }}
                >
                {img.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Confirm Delete Dialog */}
      <Dialog open={imgToDelete !== null} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this image? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} variant="outlined">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


