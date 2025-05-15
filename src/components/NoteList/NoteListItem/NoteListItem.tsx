import { useState } from 'react';
import { Box, IconButton, ListItem, ListItemIcon, Menu, MenuItem, Typography, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';
import MoreIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { ShortNote, useNotesStore } from '../../../store/NotesStore';

const NoteListItem = ({ note }: { note: ShortNote }) => {
  const theme = useTheme();
  const { deleteNote, makeNotePublic, makeNotePrivate, archiveNote, unarchiveNote } = useNotesStore();
  
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(menuAnchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleDelete = () => {
    handleCloseMenu();
    deleteNote(note.id);
  };

  const handlePublicToggle = async () => {
    handleCloseMenu();
    if (note.public_id) {
      await makeNotePrivate(note.id);
    } else {
      await makeNotePublic(note.id);
    }
  };

  const handleCopyLink = () => {
    handleCloseMenu();
    navigator.clipboard.writeText(`${window.location.origin}/public/${note.public_id}`);
    console.log(note.public_id);
  };

  const handleArchiveToggle = async () => {
    handleCloseMenu();
    if (note.archived_at) {
      await unarchiveNote(note.id);
    } else {
      await archiveNote(note.id);
    }
  };

  return (
    <ListItem
      component={NavLink}
      to={`/note/${note.id}`}
      sx={{
        '&.active': {
          backgroundColor: theme.palette.action.selected,
          '&:hover': { backgroundColor: theme.palette.action.selected },
        },
        '&:hover': { backgroundColor: theme.palette.action.hover },
        color: 'text.primary',
        borderBottomColor: '#848484',
        borderBottomWidth: 0.1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1,
          width: '100%',
          alignItems: 'center',
          px: 0.25,
          py: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            alignItems: 'start',
            gap: 0.25,
            overflow: 'hidden',
            width: '100%',
          }}
        >
          <Typography
            variant="body1"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 'medium', width: '100%' }}
          >
            {note.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'text.secondary', width: '100%' }}
          >
            {new Date(note.created_at).toLocaleDateString()}
          </Typography>
        </Box>

        <IconButton onClick={handleOpenMenu} sx={{ flexShrink: 0 }}>
          <MoreIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={menuAnchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 200,
            backgroundColor: theme.palette.background.default,
            borderRadius: 2,
            boxShadow: 1,
          },
        }}
      >
        {note.public_id && (
          <MenuItem onClick={handleCopyLink} sx={{ fontSize: '14px' }}>
            <ListItemIcon>
              <ContentCopyIcon color='primary' />
            </ListItemIcon>
            Скопировать ссылку
          </MenuItem>
        )}
        <MenuItem onClick={handlePublicToggle} sx={{ fontSize: '14px' }}>
          <ListItemIcon>
            {note.public_id ? <LockIcon color='primary' /> : <PublicIcon color='primary' />}
          </ListItemIcon>
          {note.public_id ? 'Сделать приватной' : 'Опубликовать'}
        </MenuItem>
        <MenuItem onClick={handleArchiveToggle} sx={{ fontSize: '14px' }}>
          <ListItemIcon>
            {note.archived_at ? <UnarchiveIcon color='primary' /> : <ArchiveIcon color='primary' />}
          </ListItemIcon>
          {note.archived_at ? 'Разархивировать' : 'Архивировать'}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ fontSize: '14px' }}>
          <ListItemIcon>
            <DeleteIcon color='primary' />
          </ListItemIcon>
          Удалить
        </MenuItem>
      </Menu>
    </ListItem>
  );
};

export default NoteListItem;
