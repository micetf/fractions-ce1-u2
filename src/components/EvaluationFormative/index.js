/**
 * @fileoverview Exports publics du module EvaluationFormative (M4).
 *
 * Sprint 11  : bilan de séquence S6 (RF-M4-06 à RF-M4-09).
 * Sprint 13a : persistance localStorage — useClasse + migration useBilanS6.
 * Sprint 13b : observables formatifs S1–S6 (RF-M4-01 à RF-M4-05).
 *              ModuleM4 devient le point d'entrée unique pour App.jsx.
 */

// ── Point d'entrée App.jsx ────────────────────────────────────────────────────
export { default as ModuleM4 } from "./ModuleM4";

// ── Sous-modules ──────────────────────────────────────────────────────────────
export { default as BilanS6 } from "./BilanS6";
export { default as ObservablesFormatifs } from "./ObservablesFormatifs";

// ── Composants ────────────────────────────────────────────────────────────────
export { default as GestionClasse } from "./GestionClasse";
export { default as SaisieAutoEval } from "./SaisieAutoEval";
export { default as SyntheseBilan } from "./SyntheseBilan";
export { default as AlerteCollective } from "./AlerteCollective";
export { default as FicheObservableEleve } from "./FicheObservableEleve";
export { default as SyntheseObservables } from "./SyntheseObservables";

// ── Hooks ─────────────────────────────────────────────────────────────────────
export { useBilanS6 } from "./useBilanS6";
export {
    useObservablesFormatifs,
    VALEURS,
    VALEURS_UI,
    CLE_OBSERVABLES,
} from "./useObservablesFormatifs";
