import alabanzaImg from '../assets/images/grupos/alabanza.jpeg';
import bautizmoImg from '../assets/images/grupos/bautizmo.jpeg';
import bienvenidaImg from '../assets/images/grupos/bienvenida.jpeg';
import referentesImg from '../assets/images/grupos/referentes.jpeg';

export interface ParticipantOption {
  id: string;
  name: string;
  image: string | null;
}

export const PARTICIPANTS: ParticipantOption[] = [
  { id: 'alabanza', name: 'Alabanza', image: alabanzaImg },
  { id: 'bautizmo', name: 'Bautizmo', image: bautizmoImg },
  { id: 'bienvenida', name: 'Bienvenida', image: bienvenidaImg },
  { id: 'referentes', name: 'Referentes', image: referentesImg },
  { id: 'damas', name: 'Damas', image: null },
  { id: 'caballeros', name: 'Caballeros', image: null },
  { id: 'escuela', name: 'Escuela Dominical', image: null },
  { id: 'ujieres', name: 'Ujieres', image: null },
];

export const REQUIRED_PER_GROUP = 4;
