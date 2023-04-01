export enum ToolStatus {
  AVAILABLE = 'AVAILABLE',
  REPARATION = 'REPARATION',
  HS = 'HS'
}
export interface BddTools {
  [id: string]: Tool;
}
export interface Tool {
  status?: ToolStatus;
  id: number;
  name: string;
  photo?: string;
  description?: string;
}

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

