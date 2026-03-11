/**
 * @fileoverview Point d'entrée du module JeuCartes (M2).
 *
 * Exports publics :
 *   - JeuPaires      : plateau session A — sprint 2
 *   - Carte          : composant carte individuelle (réutilisable en M1 futur)
 *   - FeedbackMessage: retour pédagogique (réutilisable en sessions B et C)
 *   - useJeuPaires   : hook logique (réutilisable en sessions B et C)
 */

export { default as JeuPaires } from "./JeuPaires";
export { default as Carte } from "./Carte";
export { default as FeedbackMessage } from "./FeedbackMessage";
export { useJeuPaires } from "./useJeuPaires";
