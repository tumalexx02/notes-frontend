import { List } from "@mui/material";
import NoteListItem from './NoteListItem/NoteListItem';
import { useNotesStore } from '../../store/NotesStore';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';


interface NoteListProps {
  searchQuery: string;
}

const NoteList = ({ searchQuery }: NoteListProps) => {
  const { notes, getNotes } = useNotesStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    getNotes();
  }, [accessToken, getNotes]);
  
  return (
    <List sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
      {notes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((note) => {
        if (searchQuery && !note.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return null;
        } else {
          return (
            <NoteListItem key={note.id} note={note} />
          );
        }
      })}
    </List>
  );
};

export default NoteList;