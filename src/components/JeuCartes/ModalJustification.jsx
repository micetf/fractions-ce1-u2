/**
 * @fileoverview ModalJustification — fenêtre de justification verbale.
 *
 * Implémente la règle centrale des sessions B (fiches S2 et S6) :
 *   S2 (paires)   : « pour avoir le droit de garder la paire, vous devez
 *                    expliquer pourquoi c'est une paire. »
 *   S6 (triplets) : « il doit le justifier — 'ce sont un huitième parce que…' —
 *                    avant de le garder. Sans justification, les 3 cartes sont
 *                    remises face cachée. »
 *
 * Interface unifiée paires + triplets :
 *   - Mode paires   : passer carte1 + carte2 (rétrocompatibilité JeuMemory)
 *   - Mode triplets : passer cartes=[c1,c2,c3] + invite (JeuTriplets, JeuMemoryTriplets)
 *
 * La modale ne peut pas vérifier la qualité de la justification orale.
 * Elle délègue ce contrôle à l'élève ou au binôme, développant la métacognition.
 */

import PropTypes from "prop-types";
import Carte from "./Carte";
import { INVITE_JUSTIFICATION } from "../../config/jeu.config";

/**
 * @param {Object}    props
 * @param {Array}     [props.cartes]      - Tableau de CarteJeu (mode triplets : 3 cartes)
 * @param {Object}    [props.carte1]      - 1re carte (mode paires — rétrocompatibilité)
 * @param {Object}    [props.carte2]      - 2e carte (mode paires — rétrocompatibilité)
 * @param {string}    [props.invite]      - Texte d'invite affiché (optionnel)
 * @param {Function}  props.onConfirmer   - L'élève a justifié → groupe validé
 * @param {Function}  props.onAnnuler     - L'élève n'a pas justifié → groupe remis face cachée
 */
export default function ModalJustification({
    cartes,
    carte1,
    carte2,
    invite,
    onConfirmer,
    onAnnuler,
}) {
    // Normalisation : cartes prop prime sur carte1/carte2
    const cartesAffichees =
        cartes ?? (carte1 && carte2 ? [carte1, carte2] : []);
    const estTriplet = cartesAffichees.length === 3;
    const texteInvite = invite ?? INVITE_JUSTIFICATION;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titre"
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
                {/* ── En-tête ── */}
                <div className="text-center space-y-1">
                    <p className="text-2xl" aria-hidden="true">
                        🗣️
                    </p>
                    <h2
                        id="modal-titre"
                        className="font-bold text-slate-800 text-base leading-snug"
                    >
                        {estTriplet
                            ? "Explique pourquoi ces trois cartes vont ensemble !"
                            : "Explique pourquoi ces deux cartes vont ensemble !"}
                    </h2>
                    <p className="text-xs text-slate-500 italic">
                        {texteInvite}
                    </p>
                </div>

                {/* ── Aperçu des cartes ── */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                    {cartesAffichees.map((carte, i) => (
                        <div key={carte.id} className="flex items-center gap-2">
                            {i > 0 && (
                                <span
                                    className="text-xl text-slate-300"
                                    aria-hidden="true"
                                >
                                    +
                                </span>
                            )}
                            <Carte
                                id={carte.id}
                                fractionId={carte.fractionId}
                                type={carte.type}
                                nomLettres={carte.nomLettres}
                                denominateur={carte.denominateur}
                                etat="selectionnee"
                                taille={52}
                            />
                        </div>
                    ))}
                </div>

                {/* ── Aide scaffold ── */}
                <p className="text-xs text-center text-slate-400 italic">
                    {estTriplet
                        ? "Le tout est partagé en ___ parts égales. J'en prends une. C'est ___."
                        : "Pense à dire : le nombre de parts ET qu'une seule est coloriée."}
                </p>

                {/* ── Boutons de décision ── */}
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={onConfirmer}
                        className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600
              text-white font-semibold rounded-xl transition-colors text-sm"
                    >
                        {estTriplet
                            ? "✅ J'ai expliqué — je garde le triplet !"
                            : "✅ J'ai expliqué — je garde la paire !"}
                    </button>
                    <button
                        type="button"
                        onClick={onAnnuler}
                        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200
              text-slate-600 font-medium rounded-xl transition-colors text-sm"
                    >
                        {estTriplet
                            ? "🔄 Je n'ai pas encore expliqué — le triplet revient"
                            : "🔄 Je n'ai pas encore expliqué — la paire revient"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/** Shape réutilisable pour une CarteJeu */
const carteShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    fractionId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    nomLettres: PropTypes.string.isRequired,
    denominateur: PropTypes.number.isRequired,
});

ModalJustification.propTypes = {
    cartes: PropTypes.arrayOf(carteShape),
    carte1: carteShape,
    carte2: carteShape,
    invite: PropTypes.string,
    onConfirmer: PropTypes.func.isRequired,
    onAnnuler: PropTypes.func.isRequired,
};
