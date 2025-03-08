// Sidebar.tsx
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField } from "@mui/material";
import NoteList from '../NoteList/NoteList';
import { Note } from '../../layout/Main/Main';
import { useState } from 'react';
import api from '../../helpers/API';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  notes: Note[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setNotes: (notes: Note[]) => void;
}

interface NoteResult {
  data: Note
}

const Sidebar = ({ notes, searchQuery, setSearchQuery, setNotes }: SidebarProps) => {
  const [newNoteName, setNewNoteName] = useState('');

  const navigate = useNavigate();

  async function createNote() {
    try {
      const response = await api.post(`/note/create`, { 'title': newNoteName });

      const note_id = await response.data['note_id'];

      const noteResponse = await api.get<NoteResult>(`/note/${note_id}`);

      const newNote = noteResponse.data.data;

      setNotes(notes.concat(newNote));
      setNewNoteName('');
      handleClose();
      navigate('/note/' + note_id);
    } catch (e) {
       if (e instanceof AxiosError) {
        console.error("Ошибка при создании заметки:", e);
       }
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
      <NoteList notes={notes} searchQuery={searchQuery} />
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2, borderTopColor: '#848484', borderTopWidth: 0.1 }}>
        <Button color='primary' variant='contained' onClick={handleClickOpen} sx={{ width: '100%' }}>
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
            type="text"
            variant="standard"
            required
            onChange={(e) => setNewNoteName(e.target.value)}
            sx={{width: 400}}
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Button onClick={createNote} color="primary">
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