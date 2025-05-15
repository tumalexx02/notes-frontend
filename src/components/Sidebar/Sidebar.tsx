import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ListItemIcon, TextField, Typography } from "@mui/material";
import NoteList from '../NoteList/NoteList';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../../store/NotesStore';
import CreateIcon from '@mui/icons-material/Create';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/UnarchiveOutlined';

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Sidebar = ({ searchQuery, setSearchQuery }: SidebarProps) => {
  const [newNoteName, setNewNoteName] = useState('');
  const [isArchive, setIsArchive] = useState(false);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);

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
  
  const handleClickOpen = () => {
    setOpenCreatePopup(true);
  };

  const handleClose = () => {
    setOpenCreatePopup(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: 300, backgroundColor: 'background.default', boxShadow: 1, borderRightColor: '#848484', borderRightWidth: 0.1 }}>
      <Box sx={{ p: 2, borderBottomColor: '#848484', borderBottomWidth: 0.1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {isArchive && <ArchiveIcon sx={{ color: 'text.secondary', fontSize: 20 }} />}
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {isArchive ? 'Архив заметок' : 'Заметки'}
          </Typography>
        </Box>
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
      <NoteList searchQuery={searchQuery} isArchive={isArchive} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2, borderTopColor: '#848484', borderTopWidth: 0.1 }}>
        {!isArchive && (
          <Button color='primary' variant='contained' onClick={handleClickOpen}>
            <ListItemIcon sx={{mr: 1, minWidth: 'unset', color: 'inherit'}}>
              <CreateIcon sx={{ color: 'inherit' }} />
            </ListItemIcon>
            Создать заметку
          </Button>
        )}
        <Button color='primary' variant='outlined' onClick={() => setIsArchive(!isArchive)}>
          <ListItemIcon sx={{mr: 1, minWidth: 'unset', color: 'inherit'}}>
            {isArchive ? <UnarchiveIcon sx={{ color: 'inherit' }} /> : <ArchiveIcon sx={{ color: 'inherit' }} />}
          </ListItemIcon>
          {isArchive ? 'Скрыть архив' : 'Показать архив'}
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
