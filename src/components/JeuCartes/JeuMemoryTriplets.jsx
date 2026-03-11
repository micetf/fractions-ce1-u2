/**
 * @fileoverview JeuMemoryTriplets — session B du jeu de triplets (S6).
 *
 * 21 cartes face cachée. L'élève retourne 3 cartes par tour.
 * Un triplet valide nécessite une justification verbale avant d'être conservé.
 *
 * Source : fiche S6, session B —
 *   « Le joueur qui commence retourne 3 cartes. Si c'est un triplet valide,
 *   il doit le justifier avant de le garder. Sans justification, les 3 cartes
 *   sont remises face cachée, même si le triplet est correct. »
 */

import PropTypes from "prop-types";
import { useMemoryTriplets } from "./useMemoryTriplets";
import CarteRetournable from "./CarteRetournable";
import FeedbackMessage from "./FeedbackMessage";
import ModalJustification from "./ModalJustification";
import { PROFIL, INVITE_JUSTIFICATION_TRIPLET } from "../../config/jeu.config";

/**
 * @param {{ profil?: string }} props
 */
export default function JeuMemoryTriplets({ profil = PROFIL.STANDARD }) {
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
        retournerCarte,
        confirmerJustification,
        annulerJustification,
        reinitialiser,
    } = useMemoryTriplets({ profil });

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

            {/* Grille memory */}
            {!termine ? (
                <div className="flex flex-wrap gap-2 justify-start">
                    {cartes.map((carte) => (
                        <CarteRetournable
                            key={carte.id}
                            carte={carte}
                            etat={etats[carte.id] ?? "cachee"}
                            onClick={retournerCarte}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 space-y-2">
                    <p className="text-2xl">🎉</p>
                    <p className="font-bold text-emerald-700 text-lg">
                        Memory terminé !
                    </p>
                    <p className="text-sm text-slate-500">
                        {essais} essais au total.
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

JeuMemoryTriplets.propTypes = {
    profil: PropTypes.string,
};
