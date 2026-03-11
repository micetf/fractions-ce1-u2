/**
 * @fileoverview ModalJustification — fenêtre de justification verbale.
 *
 * Implémente la règle centrale de la session B (fiche S2) :
 * « pour avoir le droit de garder la paire, vous devez expliquer
 * pourquoi c'est une paire. Si vous n'expliquez pas, la paire revient
 * face cachée. »
 *
 * La justification verbale est une médiation langagière ciblée
 * (Consensus académique Grenoble) : elle force la verbalisation et
 * empêche la réussite par hasard seul.
 *
 * Cette modale est purement de confirmation — elle ne peut pas vérifier
 * la qualité de la justification orale. Elle délègue ce contrôle
 * à l'élève (ou au binôme partenaire), ce qui développe la métacognition.
 *
 * Formule scaffold attendue (fiche S2, lancement session 1) :
 * « Ces deux cartes vont ensemble parce que [la forme est partagée en
 * N parts égales et une seule part est coloriée]. »
 */

import PropTypes from "prop-types";
import Carte from "./Carte";

/**
 * @param {Object}   props
 * @param {import('./jeu.utils').CarteJeu} props.carte1     - Première carte de la paire
 * @param {import('./jeu.utils').CarteJeu} props.carte2     - Deuxième carte de la paire
 * @param {Function} props.onConfirmer   - Callback : l'élève a justifié → paire validée
 * @param {Function} props.onAnnuler     - Callback : l'élève n'a pas justifié → paire cachée
 * @returns {JSX.Element}
 */
export default function ModalJustification({
    carte1,
    carte2,
    onConfirmer,
    onAnnuler,
}) {
    return (
        /* Fond semi-transparent */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titre"
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-5">
                {/* ── En-tête ── */}
                <div className="text-center space-y-1">
                    <p className="text-2xl" aria-hidden="true">
                        🗣️
                    </p>
                    <h2
                        id="modal-titre"
                        className="font-bold text-slate-800 text-base leading-snug"
                    >
                        Explique pourquoi ces deux cartes vont ensemble !
                    </h2>
                    <p className="text-xs text-slate-500">
                        « Ces deux cartes vont ensemble parce que… »
                    </p>
                </div>

                {/* ── Aperçu des 2 cartes ── */}
                <div className="flex items-center justify-center gap-4">
                    <Carte
                        id={carte1.id}
                        fractionId={carte1.fractionId}
                        type={carte1.type}
                        nomLettres={carte1.nomLettres}
                        denominateur={carte1.denominateur}
                        etat="selectionnee"
                    />
                    <span
                        className="text-2xl text-slate-400"
                        aria-hidden="true"
                    >
                        +
                    </span>
                    <Carte
                        id={carte2.id}
                        fractionId={carte2.fractionId}
                        type={carte2.type}
                        nomLettres={carte2.nomLettres}
                        denominateur={carte2.denominateur}
                        etat="selectionnee"
                    />
                </div>

                {/* ── Aide scaffold ── */}
                <p className="text-xs text-center text-slate-400 italic">
                    Pense à dire : le nombre de parts ET qu'une seule est
                    coloriée.
                </p>

                {/* ── Boutons de décision ── */}
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={onConfirmer}
                        className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors text-sm"
                    >
                        ✅ J'ai expliqué — je garde la paire !
                    </button>

                    <button
                        type="button"
                        onClick={onAnnuler}
                        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-xl transition-colors text-sm"
                    >
                        🔄 Je n'ai pas encore expliqué — la paire revient
                    </button>
                </div>
            </div>
        </div>
    );
}

ModalJustification.propTypes = {
    carte1: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fractionId: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        nomLettres: PropTypes.string.isRequired,
        denominateur: PropTypes.number.isRequired,
    }).isRequired,
    carte2: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fractionId: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        nomLettres: PropTypes.string.isRequired,
        denominateur: PropTypes.number.isRequired,
    }).isRequired,
    onConfirmer: PropTypes.func.isRequired,
    onAnnuler: PropTypes.func.isRequired,
};
