import { Box, IconButton } from '@mui/material';
import { Delete, Upload, KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { useCallback, useState, useEffect } from 'react';
import { useTheme } from '@emotion/react';
import api from '../../helpers/API';

interface ImageNodeProps {
  node: {
    id: number;
    content: string;
    type: string;
    order: number;
  };
  onDelete?: (nodeId: number) => void;
  onUpdateOrder?: (nodeId: number, oldOrder: number, newOrder: number) => Promise<void>;
  isOnly?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

export const ImageNode = ({ node, onDelete, onUpdateOrder, isOnly, isFirst, isLast }: ImageNodeProps) => {
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
      onDelete?.(node.id);
    } catch (error) {
      console.error('Failed to delete node:', error);
    }
  };

  return (
    <Box
      sx={{ 
        position: 'relative',
        width: '100%',
        '&:hover .control-button': { opacity: 1 },
        mb: 2
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ display: 'flex', position: 'absolute', flexDirection: 'column', left: -40, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
        {!isFirst && !isOnly && (
          <IconButton
            className="control-button"
            onClick={() => onUpdateOrder?.(node.id, node.order, node.order - 1)}
            sx={{
              opacity: 0,
              transition: 'opacity 0.2s',
              mb: 0.5
            }}
          >
            <KeyboardArrowUp />
          </IconButton>
        )}
        {!isLast && !isOnly && (
          <IconButton
            className="control-button"
            onClick={() => onUpdateOrder?.(node.id, node.order, node.order + 1)}
            sx={{
              opacity: 0,
              transition: 'opacity 0.2s'
            }}
          >
            <KeyboardArrowDown />
          </IconButton>
        )}
      </Box>
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