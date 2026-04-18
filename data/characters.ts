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
    impostorClue: 'Lo que estaba escrito en piedra pasó primero por tus manos. Fuiste el puente entre dos mundos que no podían tocarse.',
    icon: 'flame',
  },
  {
    id: 'david',
    name: 'David',
    description: 'El pastor que venció al gigante Goliat con una honda siendo muy joven. Luego se convirtió en el rey más amado de Israel y compuso los Salmos.',
    impostorClue: 'Tus manos conocieron las cuerdas antes que la corona, y la sangre antes que el trono.',
    icon: 'crown',
  },
  {
    id: 'solomon',
    name: 'Salomón',
    description: 'El rey más sabio que jamás vivió. Construyó el grandioso Templo de Jerusalén y gobernó con sabiduría proverbial. Autor de Proverbios.',
    impostorClue: 'Cuando dos reclamaban lo mismo, tu respuesta reveló la verdad sin necesidad de prueba alguna.',
    icon: 'star',
  },
  {
    id: 'abraham',
    name: 'Abraham',
    description: 'El padre de la fe. Dios le pidió sacrificar a su hijo Isaac pero lo detuvo en el último momento. Es el patriarca de tres grandes religiones.',
    impostorClue: 'Partiste sin saber adónde ibas. Lo más costoso que un hombre puede ofrecer fue lo que se te pidió.',
    icon: 'person',
  },
  {
    id: 'noah',
    name: 'Noé',
    description: 'El hombre justo que construyó un arca enorme por mandato divino. Salvó a su familia y a una pareja de cada animal del diluvio universal.',
    impostorClue: 'La madera y el tiempo fueron tus aliados. Cuando el cielo se abrió, tú ya llevabas días esperando.',
    icon: 'water',
  },
  {
    id: 'joseph',
    name: 'José',
    description: 'El soñador que tenía un manto de muchos colores. Sus hermanos lo vendieron como esclavo en Egipto, pero se convirtió en el segundo al mando del Faraón.',
    impostorClue: 'Lo que tus propios hermanos usaron para hundirte fue exactamente lo que Dios usó para elevarte.',
    icon: 'eye',
  },
  {
    id: 'elijah',
    name: 'Elías',
    description: 'El profeta de fuego que desafió a 450 profetas de Baal en el monte Carmelo. Subió al cielo sin morir, llevado en un carro de fuego.',
    impostorClue: 'Nunca probaste la muerte. Partiste de este mundo sin dejar atrás lo que todos dejan.',
    icon: 'flame',
  },
  {
    id: 'samson',
    name: 'Sansón',
    description: 'El hombre más fuerte del mundo. Su fuerza residía en su cabello que nunca había sido cortado. Fue traicionado por Dalila, quien reveló su secreto.',
    impostorClue: 'Tu mayor poder vivía donde menos lo habrían buscado, y eso fue tu perdición.',
    icon: 'fitness',
  },
  {
    id: 'daniel',
    name: 'Daniel',
    description: 'El profeta que fue arrojado al foso de los leones por orar a Dios, pero salió ileso. Interpretó los sueños del rey Nabucodonosor.',
    impostorClue: 'Las fauces que debían devorarte esa noche permanecieron quietas por una razón que nadie pudo explicar.',
    icon: 'shield',
  },
  {
    id: 'jonah',
    name: 'Jonás',
    description: 'El profeta que huyó de Dios y fue tragado por un gran pez durante tres días. Luego predicó en Nínive y toda la ciudad se arrepintió.',
    impostorClue: 'Huiste de lo que debías hacer, y el camino que tomaste te devolvió exactamente al punto de partida.',
    icon: 'fish',
  },
  {
    id: 'esther',
    name: 'Ester',
    description: 'La reina judía que arriesgó su vida para salvar a su pueblo del genocidio planeado por Amán. Su valentía cambió el destino de toda una nación.',
    impostorClue: 'Tu verdadera identidad fue un secreto que, al revelarse, lo cambió todo. Entraste donde nadie entraba sin permiso.',
    icon: 'diamond',
  },
  {
    id: 'mary',
    name: 'María',
    description: 'La madre de Jesús. El ángel Gabriel se le apareció anunciando que concebiría al Hijo de Dios siendo virgen. Estuvo al pie de la cruz.',
    impostorClue: 'Dijiste sí cuando el cielo preguntó. Cargaste algo que ningún ser humano antes ni después ha cargado.',
    icon: 'heart',
  },
  {
    id: 'peter',
    name: 'Pedro',
    description: 'El pescador que Jesús llamó "la roca". Caminó sobre el agua, negó a Jesús tres veces, y luego se convirtió en el primer líder de la iglesia.',
    impostorClue: 'Tres veces dijiste no. Tres veces te devolvieron la misma pregunta. Y sobre tu nombre se construyó algo que no cae.',
    icon: 'key',
  },
  {
    id: 'paul',
    name: 'Pablo',
    description: 'Antes llamado Saulo, perseguía a los cristianos. Tuvo una visión deslumbrante de Jesús en el camino a Damasco que lo transformó por completo.',
    impostorClue: 'Una luz te tumbó al suelo y te levantó siendo una persona completamente distinta a la que cayó.',
    icon: 'mail',
  },
  {
    id: 'joshua',
    name: 'Josué',
    description: 'El sucesor de Moisés que conquistó la Tierra Prometida. Las murallas de Jericó cayeron cuando su ejército las rodeó tocando trompetas por siete días.',
    impostorClue: 'Los muros no cayeron por espadas ni por fuerza. Lo que los derrumbó jamás sería considerado un arma.',
    icon: 'flag',
  },
  {
    id: 'ruth',
    name: 'Rut',
    description: 'La moabita leal que no abandonó a su suegra Noemí tras enviudar. Su fidelidad la llevó a casarse con Booz y ser bisabuela del rey David.',
    impostorClue: 'Recogiste lo que otros dejaron caer en el campo, y eso te condujo al lugar donde menos imaginabas terminar.',
    icon: 'leaf',
  },
];

export function getRandomCharacter(): BibleCharacter {
  return BIBLE_CHARACTERS[Math.floor(Math.random() * BIBLE_CHARACTERS.length)];
}
