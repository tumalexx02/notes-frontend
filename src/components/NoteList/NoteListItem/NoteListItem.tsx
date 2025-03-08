import { Box, IconButton, ListItem, Typography, useTheme } from '@mui/material';
import { Note } from '../../../layout/Main/Main';
import { NavLink } from 'react-router-dom';
import MoreIcon from '@mui/icons-material/MoreVert';
import api, { PREFIX } from '../../../helpers/API';
import { AxiosError } from 'axios';

const NoteListItem = ({ note }: { note: Note, notes: Note[] }) => {
  const theme = useTheme();

  async function deleteNote() {
    try {
      await api.delete(`${PREFIX}/note/${note.id}`);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.error("Ошибка при удалении заметки:", e);
      }
    }
  }

  // TODO: Create NotesStorage with all notes functions

  return (
    <ListItem
      component={NavLink}
      to={`/note/${note.id}`}
      sx={{ "&.active": { backgroundColor: theme.palette.action.selected, "&:hover": { backgroundColor: theme.palette.action.selected } }, "&:hover": {backgroundColor: theme.palette.action.hover}, color: 'text.primary', borderBottomColor: '#848484', borderBottomWidth: 0.1 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1,
          width: '100%',
          alignItems: 'center',
          px: 0.25,
          py: 1
        }}
      >
        <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', alignItems: 'start', gap: 0.25, overflow: 'hidden', width: '100%' }}>
          <Typography variant="body1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 'medium', width: '100%' }}>{note.title}</Typography>
          <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'text.secondary', width: '100%' }}>{new Date(note.created_at).toLocaleDateString()}</Typography>
        </Box>

        <IconButton onClick={deleteNote} sx={{ flexShrink: 0 }}>
          <MoreIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default NoteListItem;