/**
 * @fileoverview Point d'entrée du module JeuCartes (M2).
 *
 * Exports publics :
 *
 * Composants conteneurs
 *   - JeuCartes                 : orchestre S2 paires + S6 triplets (sprint 10)
 *
 * Sessions paires S2
 *   - JeuPaires                 : session A — appariement visible (sprint 2)
 *   - JeuMemory                 : session B — memory paires (sprint 3)
 *   - JeuAutocorrectif          : session C — autocorrectif + trace écrite (sprint 4)
 *
 * Sessions triplets S6
 *   - JeuTriplets               : session A — appariement triplets visible (sprint 10)
 *   - JeuMemoryTriplets         : session B — memory triplets (sprint 10)
 *   - JeuAutocorrectifTriplets  : session C — autocorrectif + bilan (sprint 10)
 *
 * Composants partagés
 *   - Carte                     : carte individuelle (paires + triplets)
 *   - CarteRetournable          : carte avec animation flip (session B)
 *   - ModalJustification        : justification verbale
 *   - TraceEcrite               : trace écrite S2
 *   - FeedbackMessage           : retour pédagogique
 *   - ImageFraction             : SVG d'une fraction (gère le cas 'un')
 *
 * Hooks
 *   - useJeuPaires              : logique session A paires
 *   - useMemory                 : logique session B paires
 *   - useAutocorrectif          : logique session C paires
 *   - useJeuTriplets            : logique session A triplets
 *   - useMemoryTriplets         : logique session B triplets
 *   - useAutocorrectifTriplets  : logique session C triplets
 */

export { default as JeuCartes } from "./JeuCartes";
export { default as JeuPaires } from "./JeuPaires";
export { default as JeuMemory } from "./JeuMemory";
export { default as JeuAutocorrectif } from "./JeuAutocorrectif";
export { default as JeuTriplets } from "./JeuTriplets";
export { default as JeuMemoryTriplets } from "./JeuMemoryTriplets";
export { default as JeuAutocorrectifTriplets } from "./JeuAutocorrectifTriplets";
export { default as Carte } from "./Carte";
export { default as CarteRetournable } from "./CarteRetournable";
export { default as ModalJustification } from "./ModalJustification";
export { default as TraceEcrite } from "./TraceEcrite";
export { default as ImageFraction } from "./ImageFraction";
export { default as FeedbackMessage } from "./FeedbackMessage";
export { useJeuPaires } from "./useJeuPaires";
export { useMemory } from "./useMemory";
export { useAutocorrectif } from "./useAutocorrectif";
export { useJeuTriplets } from "./useJeuTriplets";
export { useMemoryTriplets } from "./useMemoryTriplets";
export { useAutocorrectifTriplets, PHASE_C } from "./useAutocorrectifTriplets";
