export interface BibleCharacter {
  id: string;
  name: string;
  description: string;
  impostorClue: string;
  icon: string;
}

export const BIBLE_CHARACTERS: BibleCharacter[] = [
  {
    id: 'moses',
    name: 'Moisés',
    description: 'Libertador que habló cara a cara con Dios en el monte Sinaí. Dividió el Mar Rojo y guió al pueblo de Israel por el desierto durante 40 años.',
    impostorClue: 'Piedra. Puente. Desierto.',
    icon: 'flame',
  },
  {
    id: 'david',
    name: 'David',
    description: 'El pastor que venció al gigante Goliat con una honda siendo muy joven. Luego se convirtió en el rey más amado de Israel y compuso los Salmos.',
    impostorClue: 'Cuerdas. Corona. Sangre.',
    icon: 'crown',
  },
  {
    id: 'solomon',
    name: 'Salomón',
    description: 'El rey más sabio que jamás vivió. Construyó el grandioso Templo de Jerusalén y gobernó con sabiduría proverbial. Autor de Proverbios.',
    impostorClue: 'Dos. Uno. Silencio.',
    icon: 'star',
  },
  {
    id: 'abraham',
    name: 'Abraham',
    description: 'El padre de la fe. Dios le pidió sacrificar a su hijo Isaac pero lo detuvo en el último momento. Es el patriarca de tres grandes religiones.',
    impostorClue: 'Sin destino. Sin regreso. Sin límite.',
    icon: 'person',
  },
  {
    id: 'noah',
    name: 'Noé',
    description: 'El hombre justo que construyó un arca enorme por mandato divino. Salvó a su familia y a una pareja de cada animal del diluvio universal.',
    impostorClue: 'Madera. Paciencia. Diluvio.',
    icon: 'water',
  },
  {
    id: 'joseph',
    name: 'José',
    description: 'El soñador que tenía un manto de muchos colores. Sus hermanos lo vendieron como esclavo en Egipto, pero se convirtió en el segundo al mando del Faraón.',
    impostorClue: 'Pozo. Sueños. Trono.',
    icon: 'eye',
  },
  {
    id: 'elijah',
    name: 'Elías',
    description: 'El profeta de fuego que desafió a 450 profetas de Baal en el monte Carmelo. Subió al cielo sin morir, llevado en un carro de fuego.',
    impostorClue: 'Fuego. Sin tumba. Partida.',
    icon: 'flame',
  },
  {
    id: 'samson',
    name: 'Sansón',
    description: 'El hombre más fuerte del mundo. Su fuerza residía en su cabello que nunca había sido cortado. Fue traicionado por Dalila, quien reveló su secreto.',
    impostorClue: 'Secreto visible. Perdición oculta.',
    icon: 'fitness',
  },
  {
    id: 'daniel',
    name: 'Daniel',
    description: 'El profeta que fue arrojado al foso de los leones por orar a Dios, pero salió ileso. Interpretó los sueños del rey Nabucodonosor.',
    impostorClue: 'Fauces selladas. Noche intacta.',
    icon: 'shield',
  },
  {
    id: 'jonah',
    name: 'Jonás',
    description: 'El profeta que huyó de Dios y fue tragado por un gran pez durante tres días. Luego predicó en Nínive y toda la ciudad se arrepintió.',
    impostorClue: 'Huida circular. Mar abierto.',
    icon: 'fish',
  },
  {
    id: 'esther',
    name: 'Ester',
    description: 'La reina judía que arriesgó su vida para salvar a su pueblo del genocidio planeado por Amán. Su valentía cambió el destino de toda una nación.',
    impostorClue: 'Identidad oculta. Entrada prohibida.',
    icon: 'diamond',
  },
  {
    id: 'mary',
    name: 'María',
    description: 'La madre de Jesús. El ángel Gabriel se le apareció anunciando que concebiría al Hijo de Dios siendo virgen. Estuvo al pie de la cruz.',
    impostorClue: 'Sí eterno. Carga sin par.',
    icon: 'heart',
  },
  {
    id: 'peter',
    name: 'Pedro',
    description: 'El pescador que Jesús llamó "la roca". Caminó sobre el agua, negó a Jesús tres veces, y luego se convirtió en el primer líder de la iglesia.',
    impostorClue: 'Triple negación. Roca eterna.',
    icon: 'key',
  },
  {
    id: 'paul',
    name: 'Pablo',
    description: 'Antes llamado Saulo, perseguía a los cristianos. Tuvo una visión deslumbrante de Jesús en el camino a Damasco que lo transformó por completo.',
    impostorClue: 'Luz. Caída. Transformación.',
    icon: 'mail',
  },
  {
    id: 'joshua',
    name: 'Josué',
    description: 'El sucesor de Moisés que conquistó la Tierra Prometida. Las murallas de Jericó cayeron cuando su ejército las rodeó tocando trompetas por siete días.',
    impostorClue: 'Muros caídos. Sin espadas.',
    icon: 'flag',
  },
  {
    id: 'ruth',
    name: 'Rut',
    description: 'La moabita leal que no abandonó a su suegra Noemí tras enviudar. Su fidelidad la llevó a casarse con Booz y ser bisabuela del rey David.',
    impostorClue: 'Campo ajeno. Lealtad sin sangre.',
    icon: 'leaf',
  },
];

export function getRandomCharacter(): BibleCharacter {
  return BIBLE_CHARACTERS[Math.floor(Math.random() * BIBLE_CHARACTERS.length)];
}
