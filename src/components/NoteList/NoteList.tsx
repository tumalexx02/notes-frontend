import { List } from "@mui/material";
import NoteListItem from './NoteListItem/NoteListItem';
import { Note } from '../../layout/Main/Main';


interface NoteListProps {
  notes: Note[];
  searchQuery: string;
}

const NoteList = ({ notes, searchQuery }: NoteListProps) => {
  return (
    <List sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
      {notes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((note) => {
        if (searchQuery && !note.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return null;
        } else {
          return (
            <NoteListItem key={note.id} note={note} notes={notes} />
          );
        }
      })}
    </List>
  );
};

export default NoteList;