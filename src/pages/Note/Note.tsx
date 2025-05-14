import { useTheme } from '@emotion/react';
import { Box, Typography, TextField, Divider, Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Add, Image, Edit } from '@mui/icons-material';
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

  return (
    <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'start', height: '100%', flexDirection: 'column', py: 8, width: 800 }}>
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
        .map((node) => (
        <Box key={'id' + note.id + 'order' + node.order} sx={{ width: '100%' }}>
          {node.content_type === 'text' ? (
            <TextNode 
              node={{ ...node, type: 'text', content: node.content || '' }} 
              onDelete={handleDeleteNode}
              isOnly={note.nodes.length === 1}
            />
          ) : (
            <ImageNode 
              node={{ ...node, type: 'image', content: node.content || '' }}
              onDelete={handleDeleteNode}
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
    </Box>
  );
};

export { NotePage };
