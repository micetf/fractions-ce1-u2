/**
 * @fileoverview Point d'entrée du module FormesSVG.
 *
 * Exports publics :
 *   - FormeImage   : point d'entrée recommandé pour M2 et M1.
 *                    Dispatcher vers le bon SVG selon fractionId + forme.
 *   - CarreSVG     : carré partagé en 2, 4 ou 8 parts.
 *   - DisqueSVG    : disque partagé en 2, 3, 4 ou 8 secteurs.
 *   - HexagoneSVG  : hexagone partagé en 3 ou 6 parts.
 *
 * Note : BandeSVG reste exporté depuis components/BandeRepertoire
 * (son contexte d'origine) et est réutilisé en interne par FormeImage.
 */

export { default as FormeImage } from "./FormeImage";
export { default as CarreSVG } from "./CarreSVG";
export { default as DisqueSVG } from "./DisqueSVG";
export { default as HexagoneSVG } from "./HexagoneSVG";
