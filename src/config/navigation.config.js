/**
 * @fileoverview Gestion de la navigation par état React.
 *
 * Choix technique : navigation par useState plutôt que react-router-dom.
 * Justification : l'application est un outil de classe mono-utilisateur,
 * sans besoin de deep-linking, de navigation arrière navigateur, ni d'URL
 * partageables. Un switch de vues par état est plus simple et élimine
 * une dépendance.
 *
 * Si le besoin de deep-linking émerge (ex. : lien direct vers /modelage
 * pour un usage TBI), la migration vers react-router-dom reste triviale.
 */

/**
 * Identifiants des vues disponibles.
 * Correspondent aux 5 modules du SRS.
 * @readonly
 * @enum {string}
 */
export const VUES = {
  TABLEAU_DE_BORD:     'tableau_de_bord',   // M0
  MODELAGE:            'modelage',           // M1
  JEU_DE_CARTES:       'jeu_de_cartes',      // M2
  BANDE_REPERTOIRE:    'bande_repertoire',   // M3
  EVALUATION:          'evaluation',         // M4
};

/**
 * Libellés de navigation pour chaque vue.
 * @type {Record<string, {label: string, module: string}>}
 */
export const NAV_CONFIG = {
  [VUES.TABLEAU_DE_BORD]:  { label: 'Tableau de bord', module: 'M0' },
  [VUES.MODELAGE]:         { label: 'Modelage',         module: 'M1' },
  [VUES.JEU_DE_CARTES]:    { label: 'Jeu de cartes',    module: 'M2' },
  [VUES.BANDE_REPERTOIRE]: { label: 'Répertoire',       module: 'M3' },
  [VUES.EVALUATION]:       { label: 'Évaluation',       module: 'M4' },
};

/** Vue affichée au démarrage de l'application. */
export const VUE_INITIALE = VUES.TABLEAU_DE_BORD;
