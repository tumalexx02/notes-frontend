import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AxiosError } from 'axios';
import api, { PREFIX } from '../helpers/API';

export interface ShortNote {
  id: number
  user_id: string
  title: string
  created_at: string
  updated_at: string
  public_id: string
}

interface NotesState {
  notes: ShortNote[]
  getNotes: () => void
  createNote: (newNoteName: string) => number
  deleteNote: (noteId: number) => void
}

export const useNotesStore = create<NotesState>()(
  devtools(
    (set, get) => ({
      notes: [],
      getNotes: async () => {
        try {
          const response = await api.get(`${PREFIX}/note/list`);
          set({ notes: response.data.data })
        } catch (e) {
          if (e instanceof AxiosError) {
            console.error("Ошибка при получении заметок:", e);
          }
        }
      },
      createNote: async (newNoteName: string) => {
        try {
          const response = await api.post(`/note/create`, { 'title': newNoteName });
    
          const note_id = await response.data['note_id'];
    
          const noteResponse = await api.get(`/note/${note_id}`);
    
          const newNote = noteResponse.data.data;

          get().notes.push(newNote);

          return note_id
        } catch (e) {
           if (e instanceof AxiosError) {
            console.error("Ошибка при создании заметки:", e);
           }
        }
      },
      deleteNote: async (noteId: number) => {
        try {
          await api.delete(`/note/${noteId}`);
          set({ notes: get().notes.filter(note => note.id !== noteId) });
        } catch (e) {
          if (e instanceof AxiosError) {
            console.error("Ошибка при удалении заметки:", e);
          }
        }
      }
    })
  )
);
