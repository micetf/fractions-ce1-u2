/**
 * @fileoverview JeuMemory — plateau du jeu de memory, session B.
 *
 * Implémente la Session 2 de la fiche S2 :
 * « Avec votre partenaire, mélangez toutes les cartes des deux joueurs
 * face cachée. À votre tour, vous retournez deux cartes. Si c'est une
 * paire, vous la gardez [après justification]. »
 *
 * Affiche :
 *   - Sélecteur de profil (difficulté / standard)
 *   - Grille de cartes retournables (faces cachées)
 *   - Modale de justification verbale quand une paire est trouvée
 *   - Feedback pédagogique après chaque tentative
 *   - Compteur de paires et bilan de fin de jeu
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { PROFIL, PROFILS_PAIRES } from "../../config/jeu.config";
import { useMemory } from "./useMemory";
import CarteRetournable from "./CarteRetournable";
import ModalJustification from "./ModalJustification";
import FeedbackMessage from "./FeedbackMessage";

// ── Sélecteur de profil (partagé avec JeuPaires) ─────────────────────────────

/**
 * @param {{ profil: string, onChange: (p: string) => void }} props
 */
function SelecteurProfil({ profil, onChange }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">
                Profil :
            </span>
            <div className="flex gap-1">
                {Object.entries(PROFILS_PAIRES)
                    .filter(([, cfg]) => cfg.implemente)
                    .map(([cle, cfg]) => (
                        <button
                            key={cle}
                            onClick={() => onChange(cle)}
                            className={[
                                "px-3 py-1 rounded text-xs font-semibold transition-colors",
                                profil === cle
                                    ? "bg-slate-700 text-white"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                            ].join(" ")}
                        >
                            {cfg.label}
                        </button>
                    ))}
            </div>
        </div>
    );
}

SelecteurProfil.propTypes = {
    profil: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

// ── Feedback étendu pour le résultat 'sansjustification' ─────────────────────

/**
 * Feedback spécifique à la session B, complétant FeedbackMessage.
 * Gère le cas 'sansjustification' qui n'existe pas en session A.
 * @param {{ resultat: string|null, fractionValidee: string|null, pairesOk: number, totalPaires: number, termine: boolean }} props
 */
function FeedbackMemory({
    resultat,
    fractionValidee,
    pairesOk,
    totalPaires,
    termine,
}) {
    if (resultat === "sansjustification") {
        return (
            <div className="flex items-start gap-3 px-4 py-3 bg-orange-50 border border-orange-300 rounded-xl">
                <span className="text-2xl mt-0.5" aria-hidden="true">
                    🔄
                </span>
                <div>
                    <p className="font-semibold text-orange-800 text-sm">
                        La paire revient face cachée.
                    </p>
                    <p className="text-xs text-orange-600 mt-0.5">
                        N'oublie pas d'expliquer avant de garder une paire !
                    </p>
                </div>
            </div>
        );
    }
    return (
        <FeedbackMessage
            resultat={resultat}
            fractionValidee={fractionValidee}
            pairesOk={pairesOk}
            totalPaires={totalPaires}
            termine={termine}
        />
    );
}

FeedbackMemory.propTypes = {
    resultat: PropTypes.string,
    fractionValidee: PropTypes.string,
    pairesOk: PropTypes.number.isRequired,
    totalPaires: PropTypes.number.isRequired,
    termine: PropTypes.bool.isRequired,
};

// ── Plateau interne ───────────────────────────────────────────────────────────

/**
 * Plateau du jeu de memory — instancié avec une key pour forcer le remontage.
 * @param {{ profil: string }} props
 */
function Plateau({ profil }) {
    const {
        cartes,
        etats,
        pairePotentielle,
        pairesOk,
        essais,
        dernierResultat,
        fractionValidee,
        termine,
        totalPaires,
        selectionnerCarte,
        confirmerJustification,
        annulerJustification,
    } = useMemory({ profil });

    // Résoudre les données des 2 cartes pour la modale
    const carte1 = pairePotentielle
        ? cartes.find((c) => c.id === pairePotentielle.id1)
        : null;
    const carte2 = pairePotentielle
        ? cartes.find((c) => c.id === pairePotentielle.id2)
        : null;

    return (
        <>
            <div className="space-y-5">
                {/* ── Feedback ── */}
                <FeedbackMemory
                    resultat={pairePotentielle ? null : dernierResultat}
                    fractionValidee={fractionValidee}
                    pairesOk={pairesOk}
                    totalPaires={totalPaires}
                    termine={termine}
                />

                {/* ── Grille de cartes ── */}
                <div
                    className="flex flex-wrap gap-3 justify-center p-4 bg-slate-100 rounded-2xl min-h-48"
                    role="group"
                    aria-label="Plateau de memory"
                >
                    {cartes.map((carte) => (
                        <CarteRetournable
                            key={carte.id}
                            carte={carte}
                            etat={etats[carte.id]}
                            onClick={selectionnerCarte}
                        />
                    ))}
                </div>

                {/* ── Statistiques ── */}
                {essais > 0 && (
                    <p className="text-center text-xs text-slate-400">
                        {pairesOk} paire{pairesOk > 1 ? "s" : ""} trouvée
                        {pairesOk > 1 ? "s" : ""}
                        {" · "}
                        {essais} essai{essais > 1 ? "s" : ""}
                    </p>
                )}
            </div>

            {/* ── Modale de justification verbale ── */}
            {pairePotentielle && carte1 && carte2 && (
                <ModalJustification
                    carte1={carte1}
                    carte2={carte2}
                    onConfirmer={confirmerJustification}
                    onAnnuler={annulerJustification}
                />
            )}
        </>
    );
}

Plateau.propTypes = { profil: PropTypes.string.isRequired };

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Jeu de memory — session B (cartes retournées).
 * @returns {JSX.Element}
 */
export default function JeuMemory() {
    const [profil, setProfil] = useState(PROFIL.STANDARD);
    const [cleJeu, setCleJeu] = useState(0);

    function changerProfil(nouveauProfil) {
        setProfil(nouveauProfil);
        setCleJeu((k) => k + 1);
    }

    function relancer() {
        setCleJeu((k) => k + 1);
    }

    return (
        <div className="space-y-4">
            {/* ── En-tête ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <div>
                    <h2 className="font-bold text-slate-700 text-base">
                        Session 2 — Memory
                    </h2>
                    <p className="text-xs text-slate-400">
                        Retourne deux cartes et explique pourquoi elles vont
                        ensemble.
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <SelecteurProfil profil={profil} onChange={changerProfil} />
                    <button
                        onClick={relancer}
                        className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        ↺ Nouveau mélange
                    </button>
                </div>
            </div>

            {/* ── Plateau ── */}
            <Plateau key={`${profil}-${cleJeu}`} profil={profil} />
        </div>
    );
}
