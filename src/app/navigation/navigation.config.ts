import {Comissions} from '../models/common.model';
import {BoardGameCategory} from '../models/boardGame.model';
import {categoryLabel} from '../ludotheque/pipes/game-category-label.pipe';
import {Consoles, isLegacyConsole} from '../models/videoGames.model';
import {Libraries} from '../models/author.model';
import {BricoCategories, PhotoCategory, SonoCategory} from '../catalogue/models/catalogue-categories';

export interface NavLink {
  name: string;
  route: string;
  subList?: NavLink[];
  /** Rendered as a call to action in the side rail. */
  highlight?: boolean;
  /** Rendered discreetly, for entries that matter less (old consoles). */
  muted?: boolean;
}

export interface CommissionNav {
  id: Comissions;
  label: string;
  icon: string;
  route: string;
  summary: string;
  cover: string;
}

const COVERS = 'https://res.cloudinary.com/seo9axkp/image/upload/assets/categories/comissions';

export const COMMISSION_NAV: ReadonlyArray<CommissionNav> = [
  {
    id: Comissions.BIBLIOTHEQUE, label: 'Bibliothèque', icon: 'menu_book', route: '/bibliotheque',
    summary: 'Romans, BD, jeunesse : parcourez le catalogue par genre, série ou auteur.',
    cover: `${COVERS}/Forest_a_generic_image_for_a_library_category_in_my_application_cc76b336-fe9e-40fa-8dff-8060c9d4f8ec`,
  },
  {
    id: Comissions.LUDOTHEQUE, label: 'Ludothèque', icon: 'sports_esports', route: '/ludotheque',
    summary: 'Jeux de société, jeux vidéo et grands jeux à emprunter en famille.',
    cover: `${COVERS}/Forest_a_generic_image_for_a_boardgames_library_category_in_my__11426016-9902-42c4-9fb7-d9531246a7a9`,
  },
  {
    id: Comissions.BRICOLAGE, label: 'Bricolage', icon: 'handyman', route: '/bricolage',
    summary: 'Outillage, machines et remorques pour vos chantiers.',
    cover: `${COVERS}/Forest_a_generic_image_for_tools_that_can_be_borrowed_category__a256b2db-ca02-42e8-904c-ec806fefd797`,
  },
  {
    id: Comissions.SONOTHEQUE, label: 'Sonothèque', icon: 'speaker', route: '/sonotheque',
    summary: 'Enceintes, micros et matériel de sonorisation pour vos événements.',
    cover: `${COVERS}/Forest_a_generic_image_for_speakers_and_microphones_that_can_be_d71477b5-f554-45a5-a25c-47edea9160a8`,
  },
  {
    id: Comissions.NAUTISME, label: 'Nautisme', icon: 'kayaking', route: '/nautisme',
    summary: 'Paddles, kayaks et équipements nautiques.',
    cover: `${COVERS}/Forest_paddle_category_1739e8cc-4e73-475a-8805-961de1409771`,
  },
  {
    id: Comissions.PHOTO, label: 'Photo & vidéo', icon: 'photo_camera', route: '/photo',
    summary: 'Appareils photo, caméscopes et vidéoprojecteurs.',
    cover: `${COVERS}/Forest_a_generic_image_for_my_application_for_a_category_to_bor_6e97a15e-efb0-468d-b6e7-aeedeb84bcf6`,
  },
];

export type SectionId = Comissions | 'home';

/** The commission a URL belongs to ('home' for the landing page and unknown URLs). */
export function sectionOf(url: string): SectionId {
  const firstSegment = url.split('?')[0].split('/').filter(Boolean)[0];
  return COMMISSION_NAV.find(commission => commission.id === firstSegment)?.id ?? 'home';
}

/** Contextual links shown under the commission switcher. */
export function subMenuOf(section: SectionId): NavLink[] {
  switch (section) {
    case Comissions.LUDOTHEQUE:
      return [
        {name: 'Nouveautés', route: '/ludotheque/new', highlight: true},
        {
          name: 'Jeux de société', route: '/ludotheque/boardGames',
          subList: Object.values(BoardGameCategory).map(category => ({name: category, route: `/ludotheque/boardGames/${category}`})),
        },
        {
          name: 'Jeux vidéo', route: '/ludotheque/videoGames',
          subList: Object.values(Consoles).map(console => ({
            name: categoryLabel(console), route: `/ludotheque/videoGames/${console}`, muted: isLegacyConsole(console),
          })),
        },
        {name: 'Grands jeux', route: '/ludotheque/outsideGames'},
      ];
    case Comissions.SONOTHEQUE:
      return Object.values(SonoCategory).map(category => ({name: category, route: `/sonotheque/${category}`}));
    case Comissions.PHOTO:
      return Object.values(PhotoCategory).map(category => ({
        name: category === PhotoCategory.APPAREIL_PHOTO ? 'Appareils photo' : category, route: `/photo/${category}`,
      }));
    case Comissions.BIBLIOTHEQUE:
      return [
        {name: 'Nouveautés', route: '/bibliotheque/new', highlight: true},
        {name: 'Imaginaire', route: `/bibliotheque/${Libraries.IMAGINAIRE}`},
        {name: 'Inclassable', route: `/bibliotheque/${Libraries.INCLASSABLE}`},
        {name: 'Jeunesse', route: `/bibliotheque/${Libraries.LIBRAIRIE_JEUNESSE}`},
        {name: 'Adultes', route: `/bibliotheque/${Libraries.LITTERATURE_ADULTE}`},
      ];
    case Comissions.BRICOLAGE:
      return [
        {name: 'Machines à bois', route: `/bricolage/${BricoCategories.MACHINE_BOIS}`},
        {name: 'Carrelage', route: `/bricolage/${BricoCategories.MACONNERIE_CARRELAGE}`},
        {name: 'Perçage', route: `/bricolage/${BricoCategories.PERCAGE}`},
        {name: 'Scies cloches', route: `/bricolage/${BricoCategories.SCIES_CLOCHES}`},
        {name: 'Jardinage', route: `/bricolage/${BricoCategories.JARDINAGE}`},
        {name: 'Nettoyage', route: `/bricolage/${BricoCategories.NETTOYAGE}`},
        {name: 'Peinture', route: `/bricolage/${BricoCategories.PEINTURE_TAPISSERIE_MOQUETTE}`},
        {name: 'Mécanique', route: `/bricolage/${BricoCategories.MECANIQUE}`},
        {name: 'Soudure', route: `/bricolage/${BricoCategories.SOUDURE_PLOMBERIE}`},
        {name: 'Électronique', route: `/bricolage/${BricoCategories.ELECTRONIQUE}`},
        {name: 'Remorques', route: `/bricolage/${BricoCategories.REMORQUES}`},
        {name: 'Divers', route: `/bricolage/${BricoCategories.DIVERS}`},
      ];
    default:
      return [];
  }
}
