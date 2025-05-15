import { List } from "@mui/material";
import NoteListItem from './NoteListItem/NoteListItem';
import { useNotesStore } from '../../store/NotesStore';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';

interface NoteListProps {
  searchQuery: string;
  isArchive?: boolean;
}

const NoteList = ({ searchQuery, isArchive = false }: NoteListProps) => {
  const { notes, getNotes } = useNotesStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    getNotes();
  }, [accessToken, getNotes]);

  const filteredNotes = notes
    .filter(note => {
      const matchesArchive = isArchive ? !!note.archived_at : !note.archived_at;
      const matchesSearch = !searchQuery || note.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesArchive && matchesSearch;
    })
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  
  return (
    <List sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
      {filteredNotes.map((note) => (
        <NoteListItem key={note.id} note={note} />
      ))}
    </List>
  );
};

export default NoteList;