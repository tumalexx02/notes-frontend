import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ListItemIcon, TextField } from "@mui/material";
import NoteList from '../NoteList/NoteList';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../../store/NotesStore';
import CreateIcon from '@mui/icons-material/Create';

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Sidebar = ({ searchQuery, setSearchQuery }: SidebarProps) => {
  const [newNoteName, setNewNoteName] = useState('');

  const { createNote } = useNotesStore();

  const navigate = useNavigate();

  async function onCreateBtnClick() {
    const note_id = await createNote(newNoteName);

    if (note_id) {
      setNewNoteName('');
      handleClose();
      navigate('/note/' + note_id);
    }
  }

  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  
  const handleClickOpen = () => {
    setOpenCreatePopup(true);
  };

  const handleClose = () => {
    setOpenCreatePopup(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: 300, backgroundColor: 'background.default', boxShadow: 1, borderRightColor: '#848484', borderRightWidth: 0.1 }}>
      <Box sx={{ p: 2, borderBottomColor: '#848484', borderBottomWidth: 0.1 }}>
        <TextField
          size='small'
          fullWidth
          label="Поиск по названию"
          type='search'
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <NoteList searchQuery={searchQuery} />
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2, borderTopColor: '#848484', borderTopWidth: 0.1 }}>
        <Button color='primary' variant='contained' onClick={handleClickOpen} sx={{ width: '100%' }}>
          <ListItemIcon sx={{mr: 1, minWidth: 'unset', color: 'inherit'}}>
            <CreateIcon sx={{ color: 'inherit' }} />
          </ListItemIcon>
          Создать заметку
        </Button>
      </Box>
      <Dialog open={openCreatePopup} onClose={handleClose}>
        <DialogTitle>Создание заметки</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Название"
            variant="standard"
            required
            onChange={(e) => setNewNoteName(e.target.value)}
            sx={{width: 400}}
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Button onClick={onCreateBtnClick} color="primary">
            Создать
          </Button>
          <Button onClick={handleClose} sx={{color: "text.secondary"}}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
