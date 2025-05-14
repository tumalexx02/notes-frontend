import { Box, IconButton, TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import api from '../../helpers/API';

interface TextNodeProps {
  node: {
    id: number;
    content: string;
    type: string;
    order: number;
  };
  onDelete?: (nodeId: number) => void;
  isOnly?: boolean;
}

export const TextNode = ({ node, onDelete, isOnly }: TextNodeProps) => {
  const theme = useTheme();
  const [content, setContent] = useState(node.content);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const updateContent = useCallback(async (newContent: string) => {
    if (newContent === node.content) return;
    
    setSaving(true);
    try {
      await api.patch(`/node/${node.id}`, { content: newContent });
    } catch (error) {
      setContent(node.content);
      console.error('Failed to update node content:', error);
    } finally {
      setSaving(false);
    }
  }, [node.id, node.content]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== node.content) {
        updateContent(content);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, node.content, updateContent]);

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
        '&:hover .delete-button': { opacity: isOnly ? 0 : 1 },
        mb: 2
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TextField
        fullWidth
        multiline
        variant="standard"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={() => {
          setIsFocused(false);
          updateContent(content);
        }}
        onFocus={() => setIsFocused(true)}
        sx={{ 
          '& .MuiInput-root': {
            fontSize: '1rem',
            lineHeight: '1.5',
            py: 2,
            px: 2,
            borderLeft: 5,
            borderRight: 5,
            borderColor: (isHovered || isFocused) ? theme.palette.primary.main : theme.palette.divider,
            transition: 'border-color 0.2s',
            '&:before, &:after': {
              display: 'none'
            }
          }
        }}
      />
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