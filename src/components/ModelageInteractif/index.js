/**
 * @fileoverview Point d'entrée du module ModelageInteractif (M1).
 *
 * Exports publics :
 *   - ModelageInteractif  : conteneur M1 (sélecteur de séance) — branché dans App.jsx
 *   - ModelageS1          : modelage séance 1 (1/2, 1/4, 1/8)
 *   - FormePartageeSVG    : SVG générique (réutilisable M1 S3/S4/S5)
 *   - CorpusMiseEnCommun  : 3 corpus phase ④ séance 1
 *   - useModelageS1       : hook logique séance 1
 *   - ETAPE, FRACTIONS_S1, FORMES_S1 : constantes
 */

export { default as ModelageInteractif } from "./ModelageInteractif";
export { default as ModelageS1 } from "./ModelageS1";
export { default as FormePartageeSVG } from "./FormePartageeSVG";
export { default as CorpusMiseEnCommun } from "./CorpusMiseEnCommun";
export {
    useModelageS1,
    ETAPE,
    FRACTIONS_S1,
    FORMES_S1,
    texteModelage,
} from "./useModelageS1";
