import { useTheme } from '@emotion/react';
import { Box, Typography, TextField, Divider, Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, Alert } from '@mui/material';
import { Add, Image, Edit, ContentCopy, Public } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FullNote, useNotesStore } from '../../store/NotesStore';
import { TextNode } from '../../components/TextNode/TextNode';
import { ImageNode } from '../../components/ImageNode/ImageNode';
import api from '../../helpers/API';

const NotePage = () => {
  const theme = useTheme();
  const { id } = useParams();

  const [note, setNote] = useState<FullNote | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { getNote, getNotes } = useNotesStore();

  useEffect(() => {
    const fetchNote = async () => {
      const newNote = await getNote(Number(id));
      if (newNote) {
        setNote(newNote);
      }
    };
    fetchNote();
  }, [id]);

  const handleAddNode = async (type: 'text' | 'image') => {
    try {
      const response = await api.post('/node', {
        "note_id": Number(id),
        "content_type": type,
        "content": "",
        "order": note?.nodes.length ? Math.max(...note.nodes.map(n => n.order)) + 1 : 0
      });
      
      if (note) {
        setNote({
          ...note,
          nodes: [...note.nodes, response.data]
        });
      }
      
      const updatedNote = await getNote(Number(id));
      if (updatedNote) {
        setNote(updatedNote);
      }
    } catch (error) {
      console.error('Failed to add node:', error);
    }
  };

  const handleDeleteNode = useCallback((nodeId: number) => {
    if (!note) return;
    
    setNote({
      ...note,
      nodes: note.nodes.filter(node => node.id !== nodeId)
    });
    
    api.delete(`/node/${nodeId}`);
  }, [note]);

  const handleUpdateTitle = async () => {
    try {
      await api.patch(`/note/${id}`, { title: newTitle });
      const updatedNote = await getNote(Number(id));
      if (updatedNote) {
        setNote(updatedNote);
      }
      await getNotes();
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Failed to update title:', error);
    }
  };

  const handleOpenEditTitle = () => {
    setNewTitle(note?.title || '');
    setIsEditingTitle(true);
  };

  const handleUpdateNodeOrder = useCallback(async (nodeId: number, oldOrder: number, newOrder: number) => {
    if (!note) return;

    const updatedNodes = [...note.nodes];
    const movingNode = updatedNodes.find(n => n.id === nodeId);
    if (!movingNode) return;

    const targetNode = updatedNodes.find(n => n.order === newOrder);
    if (!targetNode) return;

    try {
      await api.patch(`/note/${id}/order`, {
        old_order: oldOrder,
        new_order: newOrder
      });

      movingNode.order = newOrder;
      targetNode.order = oldOrder;

      setNote({
        ...note,
        nodes: updatedNodes
      });
    } catch (error) {
      console.error('Failed to update node order:', error);
    }
  }, [id, note]);

  const handleCopyLink = () => {
    if (note?.public_id) {
      navigator.clipboard.writeText(`${window.location.origin}/public/${note.public_id}`);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      width: '100%',
      height: '100%',
      pb: 4
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'start', 
        alignItems: 'start', 
        flexDirection: 'column', 
        py: 8, 
        width: '100%',
        height: '100%',
        maxWidth: 800,
        px: 2
      }}>
        {note?.public_id && (
          <Box color={theme.palette.text.secondary} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Button
              startIcon={<ContentCopy />}
              onClick={handleCopyLink}
              size="small"
              sx={{color: theme.palette.text.secondary}}
            >
              Скопировать ссылку
            </Button>
          </Box>
        )}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%', 
            mb: 4,
            position: 'relative',
            '&:hover .edit-button': { opacity: 1 }
          }}
        >
          <Typography variant="h3" sx={{ color: theme.palette.text.primary, textAlign: 'start', flex: 1 }}>
            {note?.title}
          </Typography>
          <IconButton
            className="edit-button"
            onClick={handleOpenEditTitle}
            sx={{
              position: 'absolute',
              right: -40,
              opacity: 0,
              transition: 'opacity 0.2s',
              color: 'white'
            }}
          >
            <Edit />
          </IconButton>
        </Box>
        <Divider sx={{ width: "100%", mb: 4, backgroundColor: theme.palette.divider }} />
        {note?.nodes
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((node, index) => (
          <Box key={node.id} sx={{ width: '100%' }}>
            {node.content_type === 'text' ? (
              <TextNode 
                node={{ ...node, type: 'text', content: node.content || '' }} 
                onDelete={handleDeleteNode}
                onUpdateOrder={handleUpdateNodeOrder}
                isFirst={index === 0}
                isLast={index === note.nodes.length - 1}
                isOnly={note.nodes.length === 1}
              />
            ) : (
              <ImageNode 
                node={{ ...node, type: 'image', content: node.content || '' }}
                onDelete={handleDeleteNode}
                onUpdateOrder={handleUpdateNodeOrder}
                isFirst={index === 0}
                isLast={index === note.nodes.length - 1}
                isOnly={note.nodes.length === 1}
              />
            )}
          </Box>
        ))}
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            startIcon={<Add />}
            onClick={() => handleAddNode('text')}
          >
            Добавить текстовую ячейку
          </Button>
          <Button
            startIcon={<Image />}
            onClick={() => handleAddNode('image')}
          >
            Добавить изображение
          </Button>
        </Stack>

        <Dialog open={isEditingTitle} onClose={() => setIsEditingTitle(false)}>
          <DialogTitle>Редактирование заголовка</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Название"
              variant="standard"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              sx={{width: 400}}
            />
          </DialogContent>
          <Divider />
          <DialogActions sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Button onClick={handleUpdateTitle} color="primary">
              Сохранить
            </Button>
            <Button onClick={() => setIsEditingTitle(false)} sx={{color: "text.secondary"}}>
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>

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
      </Box>
    </Box>
  );
};

export { NotePage };
