/**
 * @fileoverview Composant racine — navigation par useState.
 *
 * Pas de react-router-dom : switch de vues par état React.
 * Voir src/config/navigation.config.js pour la justification.
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { VUES, NAV_CONFIG, VUE_INITIALE } from './config/navigation.config';
import {
  TableauDeBord,
  ModelageInteractif,
  JeuDeCartes,
  BandeRepertoire,
  EvaluationFormative,
} from './components/placeholders';

/** Correspondance vue → composant */
const COMPOSANTS = {
  [VUES.TABLEAU_DE_BORD]:  TableauDeBord,
  [VUES.MODELAGE]:         ModelageInteractif,
  [VUES.JEU_DE_CARTES]:    JeuDeCartes,
  [VUES.BANDE_REPERTOIRE]: BandeRepertoire,
  [VUES.EVALUATION]:       EvaluationFormative,
};

/**
 * Barre de navigation horizontale.
 * Temporaire — intégrée dans M0 au sprint 13.
 * @param {{ vueActive: string, onNaviguer: (vue: string) => void }} props
 */
function NavBar({ vueActive, onNaviguer }) {
  return (
    <nav className="bg-slate-800 text-white px-6 py-3 flex items-center gap-2">
      <span className="font-semibold text-slate-300 text-sm mr-4 shrink-0">
        Fractions CE1
      </span>
      <div className="flex gap-1 flex-wrap">
        {Object.entries(NAV_CONFIG).map(([vue, { label, module }]) => (
          <button
            key={vue}
            onClick={() => onNaviguer(vue)}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors',
              vueActive === vue
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700',
            ].join(' ')}
          >
            <span className="text-xs font-mono opacity-60">{module}</span>
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

NavBar.propTypes = {
  vueActive:  PropTypes.string.isRequired,
  onNaviguer: PropTypes.func.isRequired,
};

/**
 * Composant racine de l'application.
 * @returns {JSX.Element}
 */
export default function App() {
  const [vueActive, setVueActive] = useState(VUE_INITIALE);
  const Composant = COMPOSANTS[vueActive];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar vueActive={vueActive} onNaviguer={setVueActive} />
      <main className="flex-1">
        <Composant />
      </main>
    </div>
  );
}
