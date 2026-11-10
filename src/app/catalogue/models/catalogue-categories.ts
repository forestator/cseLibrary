export enum BricoCategories {
  MACHINE_BOIS = 'bois',
  MACONNERIE_CARRELAGE = 'Maçonnerie&Carrelage',
  PERCAGE = 'Perçage&Meulage',
  SCIES_CLOCHES = 'SciesCloches',
  JARDINAGE = 'Jardinage',
  NETTOYAGE = 'Nettoyage',
  PEINTURE_TAPISSERIE_MOQUETTE = 'Peinture&Tapisserie&Moquette',
  MECANIQUE = 'Mecanique',
  SOUDURE_PLOMBERIE = 'Soudure&Plomberie',
  ELECTRONIQUE = 'Electronique',
  REMORQUES = 'Remorques',
  DIVERS = 'Divers'
}

export enum SonoCategory {
  ARMOIRE1 = 'armoire1',
  ARMOIRE2 = 'armoire2',
  ARMOIRE3 = 'armoire3',
  ARMOIRE4 = 'armoire4',
  PERCO = 'percolateurs',
}

export enum PhotoCategory {
  APPAREIL_PHOTO = 'appareilsPhoto',
  ACCESSOIRES = 'accessoires',
  CAMESCOPES = 'camescopes',
  VIDEO_PROJECTEUR = 'videoProjecteur',
  DIVERS = 'divers'
}

/** Material icon shown on the category cards when the category has no picture. */
export const CATEGORY_ICONS: Readonly<Record<string, string>> = {
  [BricoCategories.MACHINE_BOIS]: 'carpenter',
  [BricoCategories.MACONNERIE_CARRELAGE]: 'foundation',
  [BricoCategories.PERCAGE]: 'hardware',
  [BricoCategories.SCIES_CLOCHES]: 'adjust',
  [BricoCategories.JARDINAGE]: 'yard',
  [BricoCategories.NETTOYAGE]: 'cleaning_services',
  [BricoCategories.PEINTURE_TAPISSERIE_MOQUETTE]: 'format_paint',
  [BricoCategories.MECANIQUE]: 'build',
  [BricoCategories.SOUDURE_PLOMBERIE]: 'plumbing',
  [BricoCategories.ELECTRONIQUE]: 'electrical_services',
  [BricoCategories.REMORQUES]: 'local_shipping',
  [BricoCategories.DIVERS]: 'category',
  [SonoCategory.ARMOIRE1]: 'speaker',
  [SonoCategory.ARMOIRE2]: 'graphic_eq',
  [SonoCategory.ARMOIRE3]: 'lightbulb',
  [SonoCategory.ARMOIRE4]: 'mic',
  [SonoCategory.PERCO]: 'coffee_maker',
  [PhotoCategory.APPAREIL_PHOTO]: 'photo_camera',
  [PhotoCategory.ACCESSOIRES]: 'camera_enhance',
  [PhotoCategory.CAMESCOPES]: 'videocam',
  [PhotoCategory.VIDEO_PROJECTEUR]: 'slideshow',
  [PhotoCategory.DIVERS]: 'category',
};
