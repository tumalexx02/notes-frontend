import { useState } from 'react';
import { Box, IconButton, ListItem, ListItemIcon, Menu, MenuItem, Typography, useTheme, Snackbar, Alert } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { deleteNote, makeNotePublic, makeNotePrivate, archiveNote, unarchiveNote } = useNotesStore();
  
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const open = Boolean(menuAnchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleCloseMenu();
    deleteNote(note.id);
    navigate('/');
  };

  const handlePublicToggle = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleCloseMenu();
    if (note.public_id) {
      await makeNotePrivate(note.id);
    } else {
      await makeNotePublic(note.id);
    }
  };

  const handleCopyLink = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleCloseMenu();
    navigator.clipboard.writeText(`${window.location.origin}/public/${note.public_id}`);
    setOpenSnackbar(true);
  };

  const handleArchiveToggle = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleCloseMenu();
    if (note.archived_at) {
      await unarchiveNote(note.id);
    } else {
      await archiveNote(note.id);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
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
      </ListItem>
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Ссылка успешно скопирована
        </Alert>
      </Snackbar>
    </>
  );
};

export default NoteListItem;
