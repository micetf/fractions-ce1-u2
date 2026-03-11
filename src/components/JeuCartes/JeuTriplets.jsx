/**
 * @fileoverview JeuTriplets — session A du jeu de triplets (S6).
 *
 * 21 cartes face visible. L'élève sélectionne 3 cartes qui représentent
 * la même fraction (image + lettres + chiffres).
 *
 * Source : fiche S6, session A —
 *   « Étalez toutes vos 21 cartes face visible. Votre mission : former
 *   7 triplets — chaque triplet a une carte-image, une carte-lettres et
 *   une carte-chiffres qui représentent la même fraction. »
 */

import PropTypes from "prop-types";
import { useJeuTriplets } from "./useJeuTriplets";
import Carte from "./Carte";
import FeedbackMessage from "./FeedbackMessage";
import ModalJustification from "./ModalJustification";
import { PROFIL, INVITE_JUSTIFICATION_TRIPLET } from "../../config/jeu.config";

/**
 * @param {{ profil?: string }} props
 */
export default function JeuTriplets({ profil = PROFIL.STANDARD }) {
    const {
        cartes,
        etats,
        tripletsOk,
        essais,
        tripletPotentiel,
        dernierResultat,
        fractionValidee,
        termine,
        totalTriplets,
        selectionnerCarte,
        confirmerJustification,
        annulerJustification,
        reinitialiser,
    } = useJeuTriplets({ profil });

    return (
        <div className="space-y-4">
            {/* Bandeau de score */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-slate-700">
                        {tripletsOk} / {totalTriplets} triplets
                    </span>
                    <span className="text-slate-400 text-xs">
                        {essais} essais
                    </span>
                </div>
                <button
                    type="button"
                    onClick={reinitialiser}
                    className="px-3 py-1.5 text-xs text-slate-500 border border-slate-200
            rounded-lg hover:bg-slate-50 transition-colors"
                >
                    ↺ Mélanger
                </button>
            </div>

            {/* Feedback */}
            {dernierResultat && (
                <FeedbackMessage
                    resultat={dernierResultat}
                    nomLettres={
                        fractionValidee
                            ? (cartes.find(
                                  (c) => c.fractionId === fractionValidee
                              )?.nomLettres ?? "")
                            : ""
                    }
                    denominateur={
                        fractionValidee
                            ? (cartes.find(
                                  (c) => c.fractionId === fractionValidee
                              )?.denominateur ?? 0)
                            : 0
                    }
                />
            )}

            {/* Grille de cartes */}
            {!termine ? (
                <div className="flex flex-wrap gap-2 justify-start">
                    {cartes.map((carte) => (
                        <Carte
                            key={carte.id}
                            id={carte.id}
                            fractionId={carte.fractionId}
                            type={carte.type}
                            nomLettres={carte.nomLettres}
                            denominateur={carte.denominateur}
                            etat={etats[carte.id] ?? "neutre"}
                            onClick={selectionnerCarte}
                            taille={56}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 space-y-2">
                    <p className="text-2xl">🎉</p>
                    <p className="font-bold text-emerald-700 text-lg">
                        Tous les triplets trouvés !
                    </p>
                    <p className="text-sm text-slate-500">
                        {essais} essai{essais > 1 ? "s" : ""} au total.
                    </p>
                    <button
                        type="button"
                        onClick={reinitialiser}
                        className="mt-3 px-5 py-2 bg-blue-600 text-white text-sm font-semibold
              rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        ↺ Rejouer
                    </button>
                </div>
            )}

            {/* Modale de justification */}
            {tripletPotentiel &&
                (() => {
                    const cartesTrip = tripletPotentiel.ids
                        .map((id) => cartes.find((c) => c.id === id))
                        .filter(Boolean);
                    return cartesTrip.length === 3 ? (
                        <ModalJustification
                            cartes={cartesTrip}
                            invite={INVITE_JUSTIFICATION_TRIPLET}
                            onConfirmer={confirmerJustification}
                            onAnnuler={annulerJustification}
                        />
                    ) : null;
                })()}
        </div>
    );
}

JeuTriplets.propTypes = {
    profil: PropTypes.string,
};
