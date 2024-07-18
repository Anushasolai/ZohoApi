import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CircularProgress,
  Button,
  Container,
  Typography,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useWebSocket } from "../contexts/WebSocketContext";
import "../index.css";


interface ProfileStatus {
  id: number;
  status: string;
  profileId: number;
}

interface Profile {
  id: number;
  zohoProfileId: string;
  displayLabel: string;
  createdTime: string | null;
  modifiedTime: string | null;
  custom: boolean;
  statuses: ProfileStatus[];
}

const Home: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [profileId, setProfileId] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);
  const { status, setStatus } = useWebSocket();

  const fetchProfiles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v6/');
      console.log('API response:', response.data);
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };
  

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSyncProfile = async () => {
    setStatus("In Progress");
    try {
      const payload = { retryCount };
      await axios.post("http://localhost:8080/api/v6/sync", payload);
      setStatus("Completed");
      fetchProfiles();
    } catch (error) {
      console.error("Sync profile failed:", error);
      setStatus("Failed");
    }
  };

  const handleRetry = async (zohoProfileId: string) => {
    setStatus('');
    try {
      const profile = profiles.find(p => p.zohoProfileId === zohoProfileId); // This line should work
      if (profile) {
        await axios.post(`http://localhost:8080/api/v6/retry/${zohoProfileId}`, {
          retryCount: profile.statuses.filter(status => status.status === 'Retrying').length,
        });
      }
      handleSyncProfile();
    } catch (error) {
      console.error('Retry failed:', error);
      setStatus('Failed');
    }
  };

  const handleDeleteProfile = async (id: number) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v6/profile/${id}`
      );
      fetchProfiles();
    } catch (error) {
      console.error("Delete profile failed:", error);
    }
  };

  const handleCloseUpdateModal = () => {
    setOpen(false);
    setProfileId("");
    setRetryCount(0);
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put(`http://localhost:8080/api/v6/status/${profileId}`, {
        retryCount,
      });
      fetchProfiles();
      handleCloseUpdateModal();
    } catch (error) {
      console.error("Update profile failed:", error);
    }
  };

  const getStatus = (profile: Profile): string => {
    if (profile.statuses && profile.statuses.length > 0) {
      return profile.statuses[profile.statuses.length - 1].status;
    }
    return "N/A";
  };

  return (
    <Container className="container">
      <Typography variant="h4" gutterBottom>
        Sync Profile From API
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSyncProfile}>
        Sync Profile
      </Button>
      <div className="status-container">
        {status === "In Progress" && <CircularProgress />}
        {status === "Completed" && (
          <CheckCircleIcon className="status-icon" color="success" />
        )}
        {status === "Failed" && (
          <>
            <ErrorIcon className="status-icon" color="error" />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRetry(profileId)} // Pass the ID here
            >
              Retry
            </Button>
          </>
        )}
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Zoho Profile ID</TableCell>
              <TableCell>Display Label</TableCell>
              <TableCell>Created Time</TableCell>
              <TableCell>Modified Time</TableCell>
              <TableCell>Custom</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.id}</TableCell>
                <TableCell>{profile.zohoProfileId}</TableCell>
                <TableCell>{profile.displayLabel}</TableCell>
                <TableCell>{profile.createdTime}</TableCell>
                <TableCell>{profile.modifiedTime}</TableCell>
                <TableCell>{profile.custom ? "Yes" : "No"}</TableCell>
                <TableCell>{getStatus(profile)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDeleteProfile(profile.id)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setOpen(true);
                      setProfileId(profile.zohoProfileId);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={open} onClose={handleCloseUpdateModal}>
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <Typography variant="h6">Update Profile</Typography>
              <span className="modal-close" onClick={handleCloseUpdateModal}>
                &times;
              </span>
            </div>
            <div className="modal-body">
              <TextField
                label="Profile ID"
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                fullWidth
                margin="normal"
              />
              
            </div>
            <div className="modal-footer">
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateProfile}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default Home;






