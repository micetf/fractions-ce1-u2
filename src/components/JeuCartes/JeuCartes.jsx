/**
 * @fileoverview JeuCartes — conteneur du module M2 (S2 paires + S6 triplets).
 *
 * Deux modes de jeu :
 *   - S2 PAIRES   : image + lettres · 3 fractions · 8 cartes
 *   - S6 TRIPLETS : image + lettres + chiffres · 7 fractions · 21 cartes
 *
 * Chaque mode expose les 3 sessions (A/B/C) et 2 profils (standard/difficulté).
 *
 * Sources : fiche S2 (paires), fiche S6 (triplets).
 *
 * Sprint 10 — ajout du mode triplets S6 complet.
 */

import { useState } from "react";
import PropTypes from "prop-types";
import {
    SESSION,
    SESSIONS_CONFIG,
    MODE_JEU,
    PROFIL,
} from "../../config/jeu.config";
import JeuPaires from "./JeuPaires";
import JeuMemory from "./JeuMemory";
import JeuAutocorrectif from "./JeuAutocorrectif";
import JeuTriplets from "./JeuTriplets";
import JeuMemoryTriplets from "./JeuMemoryTriplets";
import JeuAutocorrectifTriplets from "./JeuAutocorrectifTriplets";

// ── Sélecteur de session ──────────────────────────────────────────────────────

/**
 * @param {{ sessionId: string, active: boolean, onClick: () => void }} props
 */
function OngletSession({ sessionId, active, onClick }) {
    const cfg = SESSIONS_CONFIG[sessionId];
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "flex flex-col items-start px-4 py-2.5 rounded-lg text-left transition-colors",
                "border text-sm",
                active
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600",
            ].join(" ")}
        >
            <span className="font-semibold text-xs">{cfg.label}</span>
            {active && (
                <span className="text-xs opacity-75 mt-0.5 hidden sm:block">
                    {cfg.etayage}
                </span>
            )}
        </button>
    );
}

OngletSession.propTypes = {
    sessionId: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

// ── Sélecteur de profil ───────────────────────────────────────────────────────

/**
 * @param {{ mode: string, profil: string, onChange: Function }} props
 */
function SelecteurProfil({ mode, profil, onChange }) {
    const profils =
        mode === MODE_JEU.TRIPLETS
            ? [
                  {
                      id: PROFIL.STANDARD,
                      label: "Standard",
                      desc: "7 fractions — 21 cartes",
                  },
                  {
                      id: PROFIL.DIFFICULTE,
                      label: "En difficulté",
                      desc: "3 fractions — 9 cartes",
                  },
              ]
            : [
                  {
                      id: PROFIL.STANDARD,
                      label: "Standard",
                      desc: "4 paires — 8 cartes",
                  },
                  {
                      id: PROFIL.DIFFICULTE,
                      label: "En difficulté",
                      desc: "3 paires — 6 cartes",
                  },
              ];

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Profil :</span>
            {profils.map((p) => (
                <button
                    key={p.id}
                    type="button"
                    onClick={() => onChange(p.id)}
                    title={p.desc}
                    className={[
                        "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors",
                        profil === p.id
                            ? "bg-slate-700 text-white border-slate-700"
                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-400",
                    ].join(" ")}
                >
                    {p.label}
                    <span className="ml-1.5 opacity-60 font-normal">
                        {p.desc}
                    </span>
                </button>
            ))}
        </div>
    );
}

SelecteurProfil.propTypes = {
    mode: PropTypes.string.isRequired,
    profil: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Conteneur principal du module M2 — jeu de cartes.
 * @returns {JSX.Element}
 */
export default function JeuCartes() {
    const [mode, setMode] = useState(MODE_JEU.PAIRES);
    const [sessionActive, setSessionActive] = useState(SESSION.A);
    const [profil, setProfil] = useState(PROFIL.STANDARD);

    /** Changer de mode repart en session A, profil standard. */
    function changerMode(nouveauMode) {
        setMode(nouveauMode);
        setSessionActive(SESSION.A);
        setProfil(PROFIL.STANDARD);
    }

    return (
        <div className="space-y-5">
            {/* ── Bascule S2 / S6 ── */}
            <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-xl flex-wrap">
                <span className="text-xs text-slate-500 font-medium shrink-0">
                    Séance :
                </span>
                {[
                    {
                        id: MODE_JEU.PAIRES,
                        label: "S2 — Paires",
                        desc: "image + lettres · 3 fractions",
                    },
                    {
                        id: MODE_JEU.TRIPLETS,
                        label: "S6 — Triplets",
                        desc: "image + lettres + chiffres · 7 fractions",
                    },
                ].map((m) => (
                    <button
                        key={m.id}
                        type="button"
                        onClick={() => changerMode(m.id)}
                        title={m.desc}
                        className={[
                            "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
                            mode === m.id
                                ? "bg-slate-700 text-white"
                                : "bg-white text-slate-500 hover:bg-slate-200",
                        ].join(" ")}
                    >
                        {m.label}
                    </button>
                ))}
                <span className="text-xs text-slate-400 hidden sm:inline">
                    {mode === MODE_JEU.PAIRES
                        ? "· image + lettres · 3 fractions"
                        : "· image + lettres + chiffres · 7 fractions"}
                </span>
            </div>

            {/* ── Sélecteur de session ── */}
            <div className="flex flex-wrap gap-2">
                {Object.keys(SESSIONS_CONFIG).map((s) => (
                    <OngletSession
                        key={s}
                        sessionId={s}
                        active={sessionActive === s}
                        onClick={() => setSessionActive(s)}
                    />
                ))}
            </div>

            {/* ── Profil de différenciation ── */}
            <SelecteurProfil mode={mode} profil={profil} onChange={setProfil} />

            {/* ── Contenu actif
           La prop key force le remontage complet lors d'un changement de profil
           (nouveau mélange aléatoire — décision sprint 2). ── */}
            {mode === MODE_JEU.PAIRES && (
                <>
                    {sessionActive === SESSION.A && (
                        <JeuPaires key={`pA-${profil}`} profil={profil} />
                    )}
                    {sessionActive === SESSION.B && (
                        <JeuMemory key={`pB-${profil}`} profil={profil} />
                    )}
                    {sessionActive === SESSION.C && (
                        <JeuAutocorrectif
                            key={`pC-${profil}`}
                            profil={profil}
                        />
                    )}
                </>
            )}
            {mode === MODE_JEU.TRIPLETS && (
                <>
                    {sessionActive === SESSION.A && (
                        <JeuTriplets key={`tA-${profil}`} profil={profil} />
                    )}
                    {sessionActive === SESSION.B && (
                        <JeuMemoryTriplets
                            key={`tB-${profil}`}
                            profil={profil}
                        />
                    )}
                    {sessionActive === SESSION.C && (
                        <JeuAutocorrectifTriplets
                            key={`tC-${profil}`}
                            profil={profil}
                        />
                    )}
                </>
            )}
        </div>
    );
}
