import { Box, IconButton } from '@mui/material';
import { Delete, Upload } from '@mui/icons-material';
import { useCallback, useState, useEffect } from 'react';
import { useTheme } from '@emotion/react';
import api from '../../helpers/API';

interface ImageNodeProps {
  node: {
    id: number;
    type: string;
    content: string;
  };
  onDelete: (id: number) => void;
  isOnly: boolean;
}

export const ImageNode = ({ node, onDelete, isOnly }: ImageNodeProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  console.log(node);

  const loadImage = useCallback(async () => {
    try {
      const response = await api.get(`/node/${node.id}/image`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      setImageUrl(url);
    } catch (error) {
      console.error('Failed to load image:', error);
    }
  }, [node.id]);

  useEffect(() => {
    if (node.content) {
      loadImage();
    }
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [loadImage, node.content]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      await api.patch(`/node/${node.id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const tempUrl = URL.createObjectURL(file);
      setImageUrl(tempUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  }, [node.id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/node/${node.id}`);
      onDelete(node.id);
    } catch (error) {
      console.error('Failed to delete node:', error);
    }
  };

  return (
    <Box
      sx={{ 
        position: 'relative',
        width: '100%',
        mb: 2,
        '&:hover .delete-button': { opacity: isOnly ? 0 : 1 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ 
        width: '100%', 
        minHeight: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        border: !imageUrl ? `1px solid ${theme.palette.divider}` : 'none'
      }}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Node content" 
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }} 
          />
        ) : (
          <label htmlFor={`image-upload-${node.id}`}>
            <input
              id={`image-upload-${node.id}`}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <IconButton component="span">
              <Upload />
            </IconButton>
          </label>
        )}
      </Box>
      <IconButton
        className="delete-button"
        onClick={handleDelete}
        disabled={isOnly}
        sx={{
          position: 'absolute',
          right: -40,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
      >
        <Delete />
      </IconButton>
    </Box>
  );
}; 