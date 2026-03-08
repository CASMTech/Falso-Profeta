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
    impostorClue: 'Eres un gran líder que liberó a un pueblo entero de la esclavitud. Recibiste leyes sagradas en una montaña.',
    icon: 'flame',
  },
  {
    id: 'david',
    name: 'David',
    description: 'El pastor que venció al gigante Goliat con una honda siendo muy joven. Luego se convirtió en el rey más amado de Israel y compuso los Salmos.',
    impostorClue: 'Eres un guerrero rey conocido por haber vencido a un enemigo mucho más grande que tú cuando eras joven.',
    icon: 'crown',
  },
  {
    id: 'solomon',
    name: 'Salomón',
    description: 'El rey más sabio que jamás vivió. Construyó el grandioso Templo de Jerusalén y gobernó con sabiduría proverbial. Autor de Proverbios.',
    impostorClue: 'Eres famoso por tu sabiduría sin igual. Construiste algo grandioso para Dios y escribiste palabras de sabiduría.',
    icon: 'star',
  },
  {
    id: 'abraham',
    name: 'Abraham',
    description: 'El padre de la fe. Dios le pidió sacrificar a su hijo Isaac pero lo detuvo en el último momento. Es el patriarca de tres grandes religiones.',
    impostorClue: 'Eres el padre espiritual de muchas naciones. Dios te hizo una prueba de fe extrema con tu ser más querido.',
    icon: 'person',
  },
  {
    id: 'noah',
    name: 'Noé',
    description: 'El hombre justo que construyó un arca enorme por mandato divino. Salvó a su familia y a una pareja de cada animal del diluvio universal.',
    impostorClue: 'Eres quien salvó a todos los animales de una gran catástrofe. Construiste algo masivo por orden de Dios.',
    icon: 'water',
  },
  {
    id: 'joseph',
    name: 'José',
    description: 'El soñador que tenía un manto de muchos colores. Sus hermanos lo vendieron como esclavo en Egipto, pero se convirtió en el segundo al mando del Faraón.',
    impostorClue: 'Fuiste traicionado y vendido por tu propia familia. Luego subiste al poder más alto gracias a interpretar sueños.',
    icon: 'eye',
  },
  {
    id: 'elijah',
    name: 'Elías',
    description: 'El profeta de fuego que desafió a 450 profetas de Baal en el monte Carmelo. Subió al cielo sin morir, llevado en un carro de fuego.',
    impostorClue: 'Eres un poderoso profeta asociado con el fuego. Subiste al cielo de una manera extraordinaria.',
    icon: 'flame',
  },
  {
    id: 'samson',
    name: 'Sansón',
    description: 'El hombre más fuerte del mundo. Su fuerza residía en su cabello que nunca había sido cortado. Fue traicionado por Dalila, quien reveló su secreto.',
    impostorClue: 'Tu fuerza sobrenatural es legendaria y venía de algo físico en tu cuerpo. Una mujer te traicionó revelando tu secreto.',
    icon: 'fitness',
  },
  {
    id: 'daniel',
    name: 'Daniel',
    description: 'El profeta que fue arrojado al foso de los leones por orar a Dios, pero salió ileso. Interpretó los sueños del rey Nabucodonosor.',
    impostorClue: 'Sobreviviste milagrosamente en un lugar con animales salvajes que normalmente te habrían matado.',
    icon: 'shield',
  },
  {
    id: 'jonah',
    name: 'Jonás',
    description: 'El profeta que huyó de Dios y fue tragado por un gran pez durante tres días. Luego predicó en Nínive y toda la ciudad se arrepintió.',
    impostorClue: 'Pasaste tres días dentro de un enorme animal marino. Después tuviste que predicar a una ciudad que no querías salvar.',
    icon: 'fish',
  },
  {
    id: 'esther',
    name: 'Ester',
    description: 'La reina judía que arriesgó su vida para salvar a su pueblo del genocidio planeado por Amán. Su valentía cambió el destino de toda una nación.',
    impostorClue: 'Eres un personaje de la realeza que usó tu posición de poder para salvar a todo tu pueblo de la muerte.',
    icon: 'diamond',
  },
  {
    id: 'mary',
    name: 'María',
    description: 'La madre de Jesús. El ángel Gabriel se le apareció anunciando que concebiría al Hijo de Dios siendo virgen. Estuvo al pie de la cruz.',
    impostorClue: 'Eres la madre del personaje más importante de toda la historia cristiana. Un ángel te anunció algo sobrenatural.',
    icon: 'heart',
  },
  {
    id: 'peter',
    name: 'Pedro',
    description: 'El pescador que Jesús llamó "la roca". Caminó sobre el agua, negó a Jesús tres veces, y luego se convirtió en el primer líder de la iglesia.',
    impostorClue: 'Fuiste un humilde pescador que se convirtió en líder de una comunidad de fe. Caminaste sobre algo imposible.',
    icon: 'key',
  },
  {
    id: 'paul',
    name: 'Pablo',
    description: 'Antes llamado Saulo, perseguía a los cristianos. Tuvo una visión deslumbrante de Jesús en el camino a Damasco que lo transformó por completo.',
    impostorClue: 'Tuviste una transformación radical: pasaste de ser el peor enemigo a ser el mayor defensor de una causa.',
    icon: 'mail',
  },
  {
    id: 'joshua',
    name: 'Josué',
    description: 'El sucesor de Moisés que conquistó la Tierra Prometida. Las murallas de Jericó cayeron cuando su ejército las rodeó tocando trompetas por siete días.',
    impostorClue: 'Fuiste el líder militar que conquisto la tierra prometida. Derribaste muros con un método completamente inusual.',
    icon: 'flag',
  },
  {
    id: 'ruth',
    name: 'Rut',
    description: 'La moabita leal que no abandonó a su suegra Noemí tras enviudar. Su fidelidad la llevó a casarse con Booz y ser bisabuela del rey David.',
    impostorClue: 'Eres extranjera que mostró una lealtad inquebrantable hacia alguien de tu familia política. Tu fidelidad fue premiada.',
    icon: 'leaf',
  },
];

export function getRandomCharacter(): BibleCharacter {
  return BIBLE_CHARACTERS[Math.floor(Math.random() * BIBLE_CHARACTERS.length)];
}
