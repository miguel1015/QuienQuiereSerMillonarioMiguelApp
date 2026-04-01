import alabanzaImg from '../assets/images/grupos/alabanza.png';
import bautismoImg from '../assets/images/grupos/bautismo.jpeg';
import bienvenidaImg from '../assets/images/grupos/bienvenida.jpeg';
import cafeImg from '../assets/images/grupos/cafe.jpeg';
import caminoKidsImg from '../assets/images/grupos/caminoKids.jpeg';
import danzaImg from '../assets/images/grupos/danza.png';
import referentesImg from '../assets/images/grupos/referentes.jpeg';

export interface ParticipantOption {
  id: string;
  name: string;
  image: string | null;
}

export const PARTICIPANTS: ParticipantOption[] = [
  { id: 'alabanza', name: 'Alabanza', image: alabanzaImg },
  { id: 'bautismo/Medios', name: 'Bautismo/Medios', image: bautismoImg },
  { id: 'bienvenida', name: 'Bienvenida', image: bienvenidaImg },
  { id: 'referentes', name: 'Referentes', image: referentesImg },
  { id: 'danza', name: 'Danza', image: danzaImg },
  { id: 'Cafe', name: 'Cafe', image: cafeImg },
  { id: 'Camino KIDS', name: 'Camino KIDS', image: caminoKidsImg },
  { id: 'Protocolo', name: 'Protocolo', image: null },
];

export const REQUIRED_PER_GROUP = 4;
