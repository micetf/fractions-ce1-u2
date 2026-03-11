/**
 * @fileoverview JeuCartes — conteneur du module M2, sélecteur de session.
 *
 * Orchestre les 3 sessions du jeu de cartes (S2) :
 *   Session A — Appariement (cartes visibles)           sprint 2 ✅
 *   Session B — Memory (cartes retournées)              sprint 3 ✅
 *   Session C — Autocorrectif + trace écrite            sprint 4
 *
 * Source : fiche S2, structure générale —
 *   « Cette séance est découpée en trois sessions courtes de 15 minutes,
 *   à distribuer sur 1 à 3 jours. »
 *
 * Ce composant remplace l'import direct de JeuPaires dans App.jsx.
 */

import { useState } from "react";
import { SESSION, SESSIONS_CONFIG } from "../../config/jeu.config";
import JeuPaires from "./JeuPaires";
import JeuMemory from "./JeuMemory";

/**
 * Onglet de sélection de session.
 * @param {{ sessionId: string, active: boolean, disponible: boolean, onClick: () => void }} props
 */
function OngletSession({ sessionId, active, disponible, onClick }) {
    const cfg = SESSIONS_CONFIG[sessionId];
    return (
        <button
            type="button"
            onClick={disponible ? onClick : undefined}
            disabled={!disponible}
            title={disponible ? cfg.description : "Disponible au sprint 4"}
            className={[
                "flex flex-col items-start px-4 py-2.5 rounded-lg text-left transition-colors",
                "border text-sm",
                active
                    ? "bg-blue-600 border-blue-600 text-white"
                    : disponible
                      ? "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                      : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed",
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

/**
 * Conteneur principal du module M2 — jeu de cartes.
 * @returns {JSX.Element}
 */
export default function JeuCartes() {
    const [sessionActive, setSessionActive] = useState(SESSION.A);

    const sessionsDisponibles = {
        [SESSION.A]: true,
        [SESSION.B]: true,
        [SESSION.C]: false, // sprint 4
    };

    return (
        <div className="space-y-5">
            {/* ── Sélecteur de session ── */}
            <div className="flex flex-wrap gap-2">
                {Object.keys(SESSIONS_CONFIG).map((sessionId) => (
                    <OngletSession
                        key={sessionId}
                        sessionId={sessionId}
                        active={sessionActive === sessionId}
                        disponible={sessionsDisponibles[sessionId]}
                        onClick={() => setSessionActive(sessionId)}
                    />
                ))}
            </div>

            {/* ── Contenu de la session active ── */}
            {sessionActive === SESSION.A && <JeuPaires />}
            {sessionActive === SESSION.B && <JeuMemory />}
            {sessionActive === SESSION.C && (
                <div className="text-center py-8 text-slate-400 text-sm">
                    Session 3 — Autocorrectif disponible au sprint 4.
                </div>
            )}
        </div>
    );
}
