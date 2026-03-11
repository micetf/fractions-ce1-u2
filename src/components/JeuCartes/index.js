/**
 * @fileoverview Point d'entrée du module JeuCartes (M2).
 *
 * Exports publics :
 *   - JeuCartes           : conteneur M2 avec sélecteur de session A/B/C
 *   - JeuPaires           : plateau session A — sprint 2
 *   - JeuMemory           : plateau session B — sprint 3
 *   - JeuAutocorrectif    : plateau session C — sprint 4
 *   - Carte               : composant carte individuelle
 *   - CarteRetournable    : carte avec animation flip (session B)
 *   - ModalJustification  : fenêtre de justification verbale (session B)
 *   - TraceEcrite         : trace écrite institutionnalisée (session C)
 *   - FeedbackMessage     : retour pédagogique (sessions A et B)
 *   - useJeuPaires        : hook logique session A
 *   - useMemory           : hook logique session B
 *   - useAutocorrectif    : hook logique session C
 */

export { default as JeuCartes } from "./JeuCartes";
export { default as JeuPaires } from "./JeuPaires";
export { default as JeuMemory } from "./JeuMemory";
export { default as JeuAutocorrectif } from "./JeuAutocorrectif";
export { default as Carte } from "./Carte";
export { default as CarteRetournable } from "./CarteRetournable";
export { default as ModalJustification } from "./ModalJustification";
export { default as TraceEcrite } from "./TraceEcrite";
export { default as ImageFraction } from "./ImageFraction";
export { default as FeedbackMessage } from "./FeedbackMessage";
export { useJeuPaires } from "./useJeuPaires";
export { useMemory } from "./useMemory";
export { useAutocorrectif } from "./useAutocorrectif";
