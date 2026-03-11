/**
 * @fileoverview Point d'entrée du module ModelageInteractif (M1).
 *
 * Exports publics — organisés par sprint :
 *
 * Sprint 5 — Séance 1 (1/2, 1/4, 1/8)
 *   - ModelageInteractif   : conteneur M1 (sélecteur de séance) — branché dans App.jsx
 *   - ModelageS1           : modelage séance 1
 *   - CorpusMiseEnCommun   : 3 corpus phase ④ séance 1
 *   - FormePartageeSVG     : SVG générique (carré, rectangle, disque, éventail, hexagone)
 *   - useModelageS1        : hook logique séance 1
 *   - ETAPE, FRACTIONS_S1, FORMES_S1, texteModelage : constantes et helpers S1
 *
 * Sprint 6 — Séance 3 (1/3, 1/6 — disque, hexagone, rectangle)
 *   - ModelageS3           : modelage séance 3
 *   - CorpusMiseEnCommunS3 : 3 points phase ④ séance 3
 *   - ContreExempleSVG     : disque en 3 parts inégales (contre-exemple prescrit fiche S3)
 *   - useModelageS3        : hook logique séance 3
 *   - FRACTIONS_S3, FORMES_S3 : constantes S3
 *
 * Sprint 7 — Séance 4 (1/5, 1/10 — bande, répertoire complet)
 *
 * Sprint 8 — Séance 5 (écriture fractionnaire en chiffres, triplets)
 *   - ModelageS5           : modelage séance 5 (2 onglets)
 *   - CarteFractionSVG     : carte symbolique 1/N avec états progressifs
 *   - CorpusMiseEnCommunS5 : triplets + tableau de décomposition phase ④
 *   - useModelageS5        : hook logique séance 5
 *   - FRACTIONS_S5, ETAPE_S5 : constantes S5
 *   - ModelageS4              : modelage séance 4 (3 onglets)
 *   - CorpusMiseEnCommunS4    : 3 points phase ④ séance 4
 *   - BandeRepertoireVisuelle : 7 lignes révélables pour la phase ③b
 *   - useModelageS4           : hook logique séance 4
 *   - FRACTIONS_S4, ORDRE_REPERTOIRE : constantes S4
 */

// ── Conteneur principal ───────────────────────────────────────────────────────
export { default as ModelageInteractif } from "./ModelageInteractif";

// ── SVG partagé (toutes séances) ──────────────────────────────────────────────
export { default as FormePartageeSVG } from "./FormePartageeSVG";

// ── Sprint 5 — Séance 1 ───────────────────────────────────────────────────────
export { default as ModelageS1 } from "./ModelageS1";
export { default as CorpusMiseEnCommun } from "./CorpusMiseEnCommun";
export {
    useModelageS1,
    ETAPE,
    FRACTIONS_S1,
    FORMES_S1,
    texteModelage,
} from "./useModelageS1";

// ── Sprint 6 — Séance 3 ───────────────────────────────────────────────────────
export { default as ModelageS3 } from "./ModelageS3";
export { default as CorpusMiseEnCommunS3 } from "./CorpusMiseEnCommunS3";
export { default as ContreExempleSVG } from "./ContreExempleSVG";
export { useModelageS3, FRACTIONS_S3, FORMES_S3 } from "./useModelageS3";

// ── Sprint 7 — Séance 4 ───────────────────────────────────────────────────────
export { default as ModelageS4 } from "./ModelageS4";
export { default as CorpusMiseEnCommunS4 } from "./CorpusMiseEnCommunS4";
export { default as BandeRepertoireVisuelle } from "./BandeRepertoireVisuelle";
export { useModelageS4, FRACTIONS_S4, ORDRE_REPERTOIRE } from "./useModelageS4";
// ── Sprint 8 — Séance 5 (écriture fractionnaire, triplets) ───────────────────
export { default as ModelageS5 } from "./ModelageS5";
export { default as CarteFractionSVG } from "./CarteFractionSVG";
export { default as CorpusMiseEnCommunS5 } from "./CorpusMiseEnCommunS5";
export {
    useModelageS5,
    FRACTIONS_S5,
    ETAPE_S5,
    texteModelageS5,
    INDEX_MODELAGE_INITIAL,
} from "./useModelageS5";
