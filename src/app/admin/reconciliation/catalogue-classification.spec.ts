import {classify, Proposal, readableName} from './catalogue-classification';
import {CatalogueRecord} from './column-mapping';

const line = (overrides: Partial<CatalogueRecord>): CatalogueRecord => ({
  line: 2, barcode: '', type: '', title: '', subtitle: '', author: '', cote: '', year: '', id: '1', ...overrides,
});
const proposal = (record: Partial<CatalogueRecord>): Proposal => {
  const result = classify(line(record));
  if (result.kind !== 'item') {
    throw new Error(`not an item: ${JSON.stringify(result)}`);
  }
  return result.proposal;
};

describe('classify: the cote comes before the type code', () => {
  it('files a camera listed under the comics code as photo equipment', () => {
    const result = proposal({type: 'BDAD', title: 'BRIDGE LUMIX FZ100 25-600mm', subtitle: '+ 2eme accu', cote: 'NUMERIC8', barcode: '0000000001203'});
    expect(result).toEqual(jasmine.objectContaining({domain: 'photo', key: 'NUMERIC8', category: 'appareilsPhoto'}));
  });

  it('files a board game listed under the 3DS code as a board game', () => {
    expect(proposal({type: '3DS', title: 'Carcassonne Labyrinth', cote: 'ludo315'})).toEqual(jasmine.objectContaining({domain: 'boardGames', key: 'ludo315'}));
  });

  it('writes the photo cote without its spaces, typos aside', () => {
    expect(proposal({type: 'MPHO', title: 'Vidéo projecteur', cote: 'VPROJ 1'})).toEqual(jasmine.objectContaining({domain: 'photo', key: 'VPROJ1', category: 'videoProjecteur'}));
  });
});

describe('classify: video games', () => {
  it('keys a game by the number of its cote and tells its console from the type code', () => {
    expect(proposal({type: 'PS4', title: 'DESTINY', cote: 'PS4-1157'})).toEqual(jasmine.objectContaining({domain: 'videoGames', key: '1157', category: 'ps4', type: 'GAME', name: 'Destiny'}));
    expect(proposal({type: 'SW', title: 'Animal Crossing', cote: 'SW1285'}).key).toBe('1285');
  });

  it('reads the platform of a console pack from its name or its cote', () => {
    expect(proposal({type: 'CONSL', title: 'PACK WII 4', cote: 'CONSL-4'})).toEqual(jasmine.objectContaining({category: 'wii', type: 'CONSOLE'}));
    expect(proposal({type: 'CONSL', title: 'PSP Console Bleu', cote: 'CONSL-7'}).category).toBe('psp');
    expect(proposal({type: 'CONSL', title: 'PACK DSi noire', cote: 'CONSL-6'}).category).toBe('ds');
    expect(proposal({type: 'CONSL', title: 'Console Switch n°2', cote: 'SW-CONSL02'}).category).toBe('switch');
  });

  it('puts a pack of consoles of an unknown platform among the lines it cannot classify', () => {
    expect(classify(line({type: 'CONSL', title: 'Console mystère', cote: 'CONSL-99'}))).toEqual({kind: 'unclassified', code: 'CONSL (plateforme inconnue)'});
  });

  it('tells a controller from a game, and knows the other ways the database writes its cote', () => {
    const controller = proposal({type: 'XB1', title: 'Manette XB1', cote: 'XB1-MAN01'});
    expect(controller.type).toBe('ACCESSORY');
    expect(controller.otherKeys).toContain('xbx1man01');
    expect(proposal({type: 'PS4', title: 'Console PS4 N°2', cote: 'PS4-CONSL 02'}).otherKeys).toContain('conslps402');
  });

  it('keys a game with no number by the id of the software', () => {
    expect(proposal({type: 'SW', title: 'Mario Kart World', cote: '', id: '29590'}).key).toBe('cat29590');
  });
});

describe('classify: bricolage and others', () => {
  it('keys a tool by its barcode without the leading zeros, and files it by its code', () => {
    expect(proposal({type: 'PERC', title: 'BURIN PERFO', barcode: '0000000000839'})).toEqual(jasmine.objectContaining({domain: 'bricolage', key: '839', category: 'Perçage&Meulage', name: 'Burin Perfo'}));
  });

  it('files the outside games and the board games by their codes', () => {
    expect(proposal({type: 'PLN.R', title: 'Crokinole', barcode: '0000097651376'}).domain).toBe('outsideGames');
    expect(proposal({type: 'SCTJR', title: 'JUNGLE SPEED', barcode: '3571880000109'})).toEqual(jasmine.objectContaining({domain: 'boardGames', category: 'enfant'}));
    expect(proposal({type: 'LDSCT', title: 'Unlock! 4 Exotic Adventures', barcode: '3558380057888'}).category).toBe('escape');
  });

  it('counts the books for the next step', () => {
    expect(classify(line({type: 'ROM', title: 'PEINE PERDUE', cote: 'R-ADA'}))).toEqual({kind: 'book'});
  });
});

describe('classify: what is set aside, with its reason', () => {
  const reason = (record: Partial<CatalogueRecord>) => {
    const result = classify(line(record));
    return result.kind === 'ignored' ? result.reason : result.kind;
  };

  it('sets aside the placeholders of the software', () => {
    expect(reason({type: 'MATPC', title: 'Code Barre Dispo 520100 et +'})).toBe('Ligne vide du logiciel');
  });

  it('sets aside what the user asked not to see, whatever the code it hides under', () => {
    expect(reason({type: 'LDSCT', title: 'Synthétiseur CASIO CTK-80'})).toContain('Écarté à ta demande');
    expect(reason({type: 'LDMAG', title: 'PC JUNIOR N_2'})).toContain('Écarté à ta demande');
    expect(reason({type: 'MATPC', title: 'PC PORTABLE 3'})).toContain('Matériel informatique');
  });

  it('sets aside the comics, the music and film media, the magazines and the audio books', () => {
    expect(reason({type: 'BDJEU', title: 'GERONIMO STILTON', cote: 'ENF SER-STIL'})).toContain('BD');
    expect(reason({type: 'V-ET', title: 'LOUDEN UP NOW', cote: 'CVE-!!!'})).toContain('CD de musique');
    expect(reason({type: 'CO', title: 'TOP SECRET !', cote: 'DVD'})).toContain('DVD');
    expect(reason({type: 'PER', title: 'GEO', cote: 'P1-N196'})).toBe('Magazines');
    expect(reason({type: 'ENF', title: 'LES P’TITS LOUPS DU JAZZ', cote: 'CEN-PTI'})).toContain('CD pour enfants');
  });

  it('lists the codes it does not know', () => {
    expect(classify(line({type: 'ZZZ', title: 'Quelque chose'}))).toEqual({kind: 'unclassified', code: 'ZZZ'});
  });
});

describe('readableName', () => {
  it('writes an ALL CAPS title in readable case and drops the age mention', () => {
    expect(readableName('LE JEU DU ROI +4 ANS', '')).toBe('Le Jeu du Roi');
    expect(readableName('GOD OF WAR III', '')).toBe('God of War III');
    expect(readableName('FIFA 19 PS4', '')).toBe('FIFA 19 PS4');
  });

  it('joins the subtitle and leaves a title that is already readable alone', () => {
    expect(readableName('Astérix & Obélix', 'Baffez-les tous')).toBe('Astérix & Obélix Baffez-les tous');
  });
});
