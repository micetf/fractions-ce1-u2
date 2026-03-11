/**
 * @fileoverview Composants placeholder pour les 5 modules.
 *
 * Stubs intentionnels du sprint 0 — remplacés sprint par sprint.
 * Permettent de vérifier la navigation sans erreur dès maintenant.
 */

import PropTypes from 'prop-types';

/**
 * Placeholder générique.
 * @param {{ module: string, titre: string, sprint: string }} props
 */
function Placeholder({ module, titre, sprint }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-8">
      <span className="text-6xl font-mono font-bold text-slate-200 select-none">
        {module}
      </span>
      <h1 className="text-2xl font-semibold text-slate-600">{titre}</h1>
      <span className="text-sm text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full">
        Implémentation — sprint {sprint}
      </span>
    </div>
  );
}

Placeholder.propTypes = {
  module: PropTypes.string.isRequired,
  titre:  PropTypes.string.isRequired,
  sprint: PropTypes.string.isRequired,
};

export function TableauDeBord()      { return <Placeholder module="M0" titre="Tableau de bord de séquence" sprint="13" />; }
export function ModelageInteractif() { return <Placeholder module="M1" titre="Modelage interactif"         sprint="5–8" />; }
export function JeuDeCartes()        { return <Placeholder module="M2" titre="Jeu de cartes interactif"    sprint="2–4 et 10" />; }
export function BandeRepertoire()    { return <Placeholder module="M3" titre="Bande-répertoire interactive" sprint="1" />; }
export function EvaluationFormative(){ return <Placeholder module="M4" titre="Évaluation formative et bilan" sprint="11–12" />; }
