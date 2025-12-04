import { Era } from './types';

// Eras and Scenes configuration.
// Display names are in Spanish as requested.
// Prompts are in English for optimal model performance.

export const ERAS: Era[] = [
  {
    id: 'ancient-egypt',
    name: 'Antiguo Egipto',
    scenes: [
      { id: 'pyramids', name: 'Construyendo las Pirámides', prompt: 'standing in front of the Great Sphinx and Pyramids of Giza in Ancient Egypt, wearing traditional linen Egyptian clothing, golden sunlight, desert sands', icon: 'Landmark' },
      { id: 'pharaoh', name: 'Trono del Faraón', prompt: 'sitting on a golden throne in an Ancient Egyptian palace, wearing a pharaoh headdress and jewelry, surrounded by hieroglyphs and luxury', icon: 'Crown' },
      { id: 'nile', name: 'Navegando el Nilo', prompt: 'standing on a wooden reed boat sailing down the Nile River in Ancient Egypt, lush palm trees on the banks, sunset', icon: 'Sailboat' },
    ]
  },
  {
    id: 'renaissance',
    name: 'El Renacimiento',
    scenes: [
      { id: 'artist', name: 'Estudio de Arte', prompt: 'posing in a Renaissance art studio in Florence, holding a paint palette, wearing velvet renaissance clothing, sunlight streaming through window', icon: 'Palette' },
      { id: 'venice', name: 'Góndola en Venecia', prompt: 'riding a gondola in 16th century Venice canals, wearing masquerade ball attire, historic architecture, water reflections', icon: 'Ship' },
      { id: 'library', name: 'Biblioteca Antigua', prompt: 'reading a scroll in a grand Renaissance library with high ceilings and endless books, wearing scholarly robes', icon: 'Book' },
    ]
  },
  {
    id: 'victorian',
    name: 'Inglaterra Victoriana',
    scenes: [
      { id: 'street', name: 'Calles de Londres', prompt: 'standing on a cobblestone street in Victorian London, foggy atmosphere, gas lamps glowing, wearing a top hat and coat or victorian dress', icon: 'Building' },
      { id: 'tea', name: 'Hora del Té', prompt: 'sitting in a lush Victorian garden having high tea, porcelain cups, wearing elegant lace Victorian fashion', icon: 'Coffee' },
      { id: 'train', name: 'Estación de Vapor', prompt: 'standing next to a massive steam train engine in a Victorian station, smoke and steam, industrial vibe, steampunk elements', icon: 'Train' },
    ]
  },
  {
    id: 'roaring-20s',
    name: 'Los Años 20',
    scenes: [
      { id: 'jazz', name: 'Club de Jazz', prompt: 'in a lively 1920s speakeasy jazz club, Art Deco decorations, wearing a flapper dress or tuxedo, moody lighting', icon: 'Music' },
      { id: 'car', name: 'Coche Clásico', prompt: 'leaning against a vintage 1920s luxury car, city street at night, Great Gatsby style glamour', icon: 'Car' },
    ]
  },
  {
    id: 'environments',
    name: 'Ambientes y Ocio',
    scenes: [
      { id: 'mountain', name: 'Montaña', prompt: 'standing on a snowy mountain peak, wearing high-tech winter gear, breathtaking alpine view, blue sky', icon: 'Mountain' },
      { id: 'forest', name: 'Bosque', prompt: 'walking through a mystical ancient forest, dappled sunlight through tall trees, ferns, nature aesthetic', icon: 'Trees' },
      { id: 'boardwalk', name: 'Paseo Marítimo', prompt: 'walking on a sunny beach boardwalk, ocean waves in background, summer vibes, casual beachwear, seagulls', icon: 'Sun' },
      { id: 'mall', name: 'Centro Comercial', prompt: 'standing in a massive futuristic shopping mall atrium, glass roof, escalators, busy atmosphere, holding shopping bags', icon: 'ShoppingBag' },
      { id: 'concert', name: 'Concierto', prompt: 'on stage at a massive rock concert, bright spotlights, crowd cheering in background, holding a microphone or guitar', icon: 'Mic' },
      { id: 'gym', name: 'Gimnasio', prompt: 'working out in a high-end modern gym, lifting weights, wearing athletic sportswear, mirrors and equipment background', icon: 'Dumbbell' },
    ]
  }
];