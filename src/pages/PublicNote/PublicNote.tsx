import { Theme, useTheme } from '@mui/material';
import { Box, Typography, Divider } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FullNote, useNotesStore } from '../../store/NotesStore';
import api from '../../helpers/API';

interface NodeWithImage extends Node {
  imageUrl?: string;
}

const PublicNotePage = () => {
  const theme = useTheme();
  const { id } = useParams();

  const [note, setNote] = useState<FullNote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getPublicNote } = useNotesStore();
  const [nodeImages, setNodeImages] = useState<Record<number, string>>({});

  const loadImage = useCallback(async (nodeId: number) => {
    try {
      const response = await api.get(`/node/${nodeId}/image`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      setNodeImages(prev => ({ ...prev, [nodeId]: url }));
    } catch (error) {
      console.error('Failed to load image:', error);
    }
  }, []);

  useEffect(() => {
    const fetchNote = async () => {
      const newNote = await getPublicNote(String(id));
      if (newNote) {
        setNote(newNote);
        // Загружаем изображения для всех image нод
        newNote.nodes.forEach(node => {
          if (node.content_type === 'image' && node.content) {
            loadImage(node.id);
          }
        });
      }
      setIsLoading(false);
    };
    fetchNote();

    // Очищаем URL при размонтировании
    return () => {
      Object.values(nodeImages).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [id, getPublicNote, loadImage]);

  if (!note && !isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
          Такой заметки не существует, либо она ещё не опубликована
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'start', height: '100%', flexDirection: 'column', py: 8, width: 800 }}>
      <Typography variant="h3" sx={{ color: theme.palette.text.primary, textAlign: 'start', width: '100%', mb: 4 }}>
        {note?.title}
      </Typography>
      <Divider sx={{ width: "100%", mb: 4, backgroundColor: theme.palette.divider }} />
      {note?.nodes
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((node) => (
        <Box key={'id' + note.id + 'order' + node.order} sx={{ width: '100%' }}>
          {node.content_type === 'text' ? (
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.primary, 
                fontSize: '1.25rem', 
                mb: 2, 
                px: 2, 
                borderLeft: 5, 
                borderRight: 5, 
                borderColor: theme.palette.divider,
                py: 2
              }}
            >
              {node.content}
            </Typography>
          ) : nodeImages[node.id] ? (
            <Box sx={{ 
              width: '100%', 
              minHeight: 200,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              my: 2
            }}>
              <img 
                src={nodeImages[node.id]}
                alt="Node content" 
                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }} 
              />
            </Box>
          ) : null}
        </Box>
      ))}
    </Box>
  );
};

export { PublicNotePage }; 