/**
 * @fileoverview FeedbackMessage — retour pédagogique après validation de paire.
 *
 * Affiche le feedback correct ou incorrect selon le résultat de la tentative.
 *
 * Feedback CORRECT :
 *   Formule scaffold issue de la fiche S2, section "Lancement — modélisation express" :
 *   « Ces deux cartes vont ensemble parce que je vois une forme partagée
 *   en [N] parts égales et une seule part est coloriée. C'est bien [un quart]. »
 *   → adaptée en formule scaffold élève.
 *
 * Feedback INCORRECT :
 *   Issu du rôle enseignant fiche S2 :
 *   « Combien de parts vois-tu ici ? Laquelle est coloriée ? »
 *
 * Ce composant est purement présentationnel — la logique est dans useJeuPaires.
 */

import PropTypes from "prop-types";
import { feedbackCorrect, FEEDBACK_INCORRECT } from "../../config/jeu.config";
import { getFractionById } from "../../config/fractions.config";
import { CARTE_UN } from "../../config/jeu.config";

/**
 * @param {Object}      props
 * @param {'correct'|'incorrect'|null} props.resultat    - Résultat de la dernière tentative
 * @param {string|null} props.fractionValidee - fractionId de la paire validée (si correct)
 * @param {number}      props.pairesOk        - Nombre de paires correctement trouvées
 * @param {number}      props.totalPaires     - Nombre total de paires du jeu
 * @param {boolean}     props.termine         - Toutes les paires trouvées
 * @returns {JSX.Element|null}
 */
export default function FeedbackMessage({
    resultat,
    fractionValidee,
    pairesOk,
    totalPaires,
    termine,
}) {
    // ── Jeu terminé ────────────────────────────────────────────────────────────
    if (termine) {
        return (
            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-2xl" aria-hidden="true">
                    🎉
                </span>
                <div>
                    <p className="font-semibold text-emerald-800">
                        Toutes les paires trouvées !
                    </p>
                    <p className="text-sm text-emerald-600">
                        {pairesOk} paire{pairesOk > 1 ? "s" : ""} associée
                        {pairesOk > 1 ? "s" : ""} correctement.
                    </p>
                </div>
            </div>
        );
    }

    // ── Aucun résultat en cours ─────────────────────────────────────────────────
    if (!resultat) {
        return (
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500">
                <span aria-hidden="true">👆</span>
                Clique sur une carte-image, puis sur le mot qui lui correspond.
            </div>
        );
    }

    // ── Feedback CORRECT ────────────────────────────────────────────────────────
    if (resultat === "correct" && fractionValidee) {
        const donnees =
            fractionValidee === CARTE_UN.id
                ? CARTE_UN
                : getFractionById(fractionValidee);

        const message = donnees
            ? feedbackCorrect(donnees.nomLettres, donnees.denominateur)
            : "Bravo, bonne paire !";

        return (
            <div className="flex items-start gap-3 px-4 py-3 bg-emerald-50 border border-emerald-300 rounded-xl">
                <span className="text-2xl mt-0.5" aria-hidden="true">
                    ✅
                </span>
                <div>
                    <p className="font-semibold text-emerald-800 text-sm">
                        {message}
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                        {pairesOk} / {totalPaires} paire
                        {pairesOk > 1 ? "s" : ""}
                    </p>
                </div>
            </div>
        );
    }

    // ── Feedback INCORRECT ──────────────────────────────────────────────────────
    return (
        <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-300 rounded-xl">
            <span className="text-2xl mt-0.5" aria-hidden="true">
                🤔
            </span>
            <p className="font-medium text-amber-800 text-sm">
                {FEEDBACK_INCORRECT}
            </p>
        </div>
    );
}

FeedbackMessage.propTypes = {
    resultat: PropTypes.oneOf(["correct", "incorrect", null]),
    fractionValidee: PropTypes.string,
    pairesOk: PropTypes.number.isRequired,
    totalPaires: PropTypes.number.isRequired,
    termine: PropTypes.bool.isRequired,
};
