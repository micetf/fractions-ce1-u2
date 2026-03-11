/**
 * @fileoverview CarteRetournable — carte avec animation de retournement CSS.
 *
 * Utilisée uniquement en session B (memory, cartes face cachée).
 * La session A utilise Carte directement (toutes les faces sont visibles).
 *
 * Animation : CSS 3D flip (rotateY 180°) via style inline + classes Tailwind.
 * Approche retenue : style inline pour les propriétés CSS non supportées
 * nativement par Tailwind v4 (transform-style, backface-visibility).
 * Les propriétés de transition et de layout utilisent les classes Tailwind.
 *
 * Structure :
 *   <div perspective>
 *     <div [flip-container]>           ← tourne à 180° quand visible
 *       <div [dos]>   motif dos        ← visible quand face cachée
 *       <div [recto]> contenu Carte    ← visible quand face recto
 *
 * États :
 *   'cachee'    → dos visible, non-cliqué
 *   'retournee' → recto visible (Carte etat='neutre')
 *   'correcte'  → recto visible (Carte etat='correcte')
 */

import PropTypes from "prop-types";
import Carte from "./Carte";

/**
 * @param {Object}   props
 * @param {import('./jeu.utils').CarteJeu} props.carte - Données de la carte
 * @param {'cachee'|'retournee'|'correcte'} props.etat - État courant
 * @param {Function} [props.onClick] - Callback(id) — déclenché uniquement si 'cachee'
 * @returns {JSX.Element}
 */
export default function CarteRetournable({ carte, etat, onClick }) {
    const estVisible = etat === "retournee" || etat === "correcte";
    const estCliquable = etat === "cachee";

    function handleClick() {
        if (estCliquable && onClick) onClick(carte.id);
    }

    // État visuel transmis à Carte pour le recto
    const etatCarte = etat === "correcte" ? "correcte" : "neutre";

    return (
        /* Conteneur perspective — requis pour l'effet 3D */
        <div style={{ perspective: "600px" }} className="w-28 h-32">
            {/* Conteneur flip — tourne de 0° (dos) à 180° (recto) */}
            <div
                style={{ transformStyle: "preserve-3d" }}
                className={[
                    "relative w-full h-full",
                    "transition-transform duration-300 ease-in-out",
                    estVisible
                        ? "transform-[rotateY(180deg)]"
                        : "transform-[rotateY(0deg)]",
                ].join(" ")}
            >
                {/* ── Face DOS ── */}
                <button
                    type="button"
                    onClick={handleClick}
                    disabled={!estCliquable}
                    aria-label="Carte retournée — cliquer pour voir"
                    style={{ backfaceVisibility: "hidden" }}
                    className={[
                        "absolute inset-0",
                        "rounded-xl border-2",
                        "flex flex-col items-center justify-center gap-2",
                        "transition-colors select-none",
                        estCliquable
                            ? "border-blue-400 bg-blue-600 hover:bg-blue-500 hover:border-blue-300 cursor-pointer"
                            : "border-blue-400 bg-blue-600 cursor-default",
                    ].join(" ")}
                >
                    {/* Motif dos : grille de points */}
                    <div className="grid grid-cols-3 gap-1.5 opacity-30">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div
                                key={i}
                                className="w-2 h-2 rounded-full bg-white"
                            />
                        ))}
                    </div>
                    {/* Point d'interrogation — indice visuel */}
                    <span
                        className="text-white text-2xl font-bold opacity-60"
                        aria-hidden="true"
                    >
                        ?
                    </span>
                </button>

                {/* ── Face RECTO ── */}
                <div
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                    className="absolute inset-0"
                    aria-hidden={!estVisible}
                >
                    {/*
                     * Carte réutilisée telle quelle.
                     * etat='neutre' → apparence standard
                     * etat='correcte' → bordure verte (paire validée)
                     * onClick non transmis → la carte recto n'est pas cliquable directement.
                     */}
                    <Carte
                        id={carte.id}
                        fractionId={carte.fractionId}
                        type={carte.type}
                        nomLettres={carte.nomLettres}
                        denominateur={carte.denominateur}
                        etat={etatCarte}
                    />
                </div>
            </div>
        </div>
    );
}

CarteRetournable.propTypes = {
    carte: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fractionId: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        nomLettres: PropTypes.string.isRequired,
        denominateur: PropTypes.number.isRequired,
    }).isRequired,
    etat: PropTypes.oneOf(["cachee", "retournee", "correcte"]).isRequired,
    onClick: PropTypes.func,
};
