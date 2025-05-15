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
  public_id: string | null | undefined
  archived_at: string | null | undefined
}

export interface FullNote {
  id: number
  user_id: string
  title: string
  nodes: NoteNode[]
  created_at: string
  updated_at: string
  public_id: string
  archived_at: string | null
}

export interface NoteNode {
  id: number
  note_id: number
  order: number
  content_type: contentType
  content?: string
}

export type contentType = 'text' | 'image'

interface NotesState {
  notes: ShortNote[]
  getNotes: () => void
  createNote: (newNoteName: string) => number
  deleteNote: (noteId: number) => void
  getNote: (noteId: number) => FullNote
  getPublicNote: (publicId: string) => FullNote
  makeNotePublic: (noteId: number) => void
  makeNotePrivate: (noteId: number) => void
  archiveNote: (noteId: number) => void
  unarchiveNote: (noteId: number) => void
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
      },
      getNote: async (noteId: number): Promise<FullNote | undefined> => {
        try {
          const response = await api.get(`/note/${noteId}`);
          return response.data.data;
        } catch (e) {
          if (e instanceof AxiosError) {
            console.error("Ошибка при получении заметки:", e);
          }
        }
      },
      getPublicNote: async (publicId: string): Promise<FullNote | undefined> => {
        try {
          const response = await api.get(`${PREFIX}/public/${publicId}`);
          return response.data;
        } catch (e) {
          if (e instanceof AxiosError) {
            console.error("Ошибка при получении публичной заметки:", e);
          }
        }
      },
      makeNotePublic: async (noteId: number) => {
        try {
          const response = await api.patch(`${PREFIX}/note/${noteId}/public`);
          set({
            notes: get().notes.map(note =>
              note.id === noteId ? { ...note, public_id: response.data['public_id'] } : note
            )
          });
        } catch (e) {
          if (e instanceof AxiosError) {
            console.error("Ошибка при публикации заметки:", e);
          }
        }
      },
      makeNotePrivate: async (noteId: number) => {
        try {
          await api.patch(`${PREFIX}/note/${noteId}/private`);
          set({
            notes: get().notes.map(note =>
              note.id === noteId ? { ...note, public_id: null } : note
            )
          });
        } catch (e) {
          if (e instanceof AxiosError) {
            console.error("Ошибка при скрытии заметки:", e);
          }
        }
      },
      archiveNote: async (noteId: number) => {
        try {
          await api.patch(`${PREFIX}/note/${noteId}/archive`);
          set({
            notes: get().notes.map(note =>
              note.id === noteId ? { ...note, archived_at: new Date().toISOString() } : note
            )
          });
        } catch (e) {
          if (e instanceof AxiosError) {
            console.error("Ошибка при архивации заметки:", e);
          }
        }
      },
      unarchiveNote: async (noteId: number) => {
        try {
          await api.patch(`${PREFIX}/note/${noteId}/unarchive`);
          set({
            notes: get().notes.map(note =>
              note.id === noteId ? { ...note, archived_at: null } : note
            )
          });
        } catch (e) {
          if (e instanceof AxiosError) {
            console.error("Ошибка при разархивации заметки:", e);
          }
        }
      }
    })
  )
);
