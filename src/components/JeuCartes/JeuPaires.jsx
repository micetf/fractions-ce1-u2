/**
 * @fileoverview JeuPaires — plateau du jeu d'appariement, session A.
 *
 * Implémente la Session 1 de la fiche S2 :
 * « Sortez toutes vos cartes et posez-les face visible sur la table.
 * Associez les paires : une carte-mot avec une carte-image. »
 *
 * Affiche :
 *   - Sélecteur de profil (difficulté / standard)
 *   - Plateau de cartes mélangées, toutes visibles
 *   - Feedback pédagogique après chaque tentative
 *   - Compteur de paires et bilan de fin de jeu
 *
 * La key prop sur le composant permet de forcer un nouveau mélange
 * sans avoir à gérer un reset complexe dans le hook.
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { PROFIL, PROFILS_PAIRES } from "../../config/jeu.config";
import { useJeuPaires } from "./useJeuPaires";
import Carte from "./Carte";
import FeedbackMessage from "./FeedbackMessage";

// ── Sélecteur de profil ───────────────────────────────────────────────────────

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

// ── Plateau de jeu ────────────────────────────────────────────────────────────

/**
 * Plateau interne — instancié avec une key pour forcer le remontage lors
 * d'un changement de profil ou d'un redémarrage.
 * @param {{ profil: string }} props
 */
function Plateau({ profil }) {
    const {
        cartes,
        etats,
        pairesOk,
        essais,
        dernierResultat,
        fractionValidee,
        termine,
        totalPaires,
        selectionnerCarte,
    } = useJeuPaires({ profil });

    return (
        <div className="space-y-5">
            {/* ── Feedback ── */}
            <FeedbackMessage
                resultat={dernierResultat}
                fractionValidee={fractionValidee}
                pairesOk={pairesOk}
                totalPaires={totalPaires}
                termine={termine}
            />

            {/* ── Plateau de cartes ── */}
            <div
                className="flex flex-wrap gap-3 justify-center p-4 bg-slate-100 rounded-2xl min-h-48"
                role="group"
                aria-label="Plateau de cartes"
            >
                {cartes.map((carte) => (
                    <Carte
                        key={carte.id}
                        id={carte.id}
                        fractionId={carte.fractionId}
                        type={carte.type}
                        nomLettres={carte.nomLettres}
                        denominateur={carte.denominateur}
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
    );
}

Plateau.propTypes = { profil: PropTypes.string.isRequired };

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Jeu de paires — session A (cartes visibles).
 * Gère le sélecteur de profil et le redémarrage via clé React.
 * @returns {JSX.Element}
 */
export default function JeuPaires() {
    const [profil, setProfil] = useState(PROFIL.STANDARD);
    const [cleJeu, setCleJeu] = useState(0);

    function changerProfil(nouveauProfil) {
        setProfil(nouveauProfil);
        setCleJeu((k) => k + 1); // Force remontage → nouveau mélange
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
                        Session 1 — Appariement
                    </h2>
                    <p className="text-xs text-slate-400">
                        Associe chaque carte-image à son nom en lettres.
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

            {/* ── Plateau — key force le remontage à chaque changement ── */}
            <Plateau key={`${profil}-${cleJeu}`} profil={profil} />
        </div>
    );
}
