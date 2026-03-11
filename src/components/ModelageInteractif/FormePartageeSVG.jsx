/**
 * @fileoverview FormePartageeSVG — représentation SVG d'une forme à trois états.
 *
 * Implémente les trois étapes du modelage (fiche S1, phase ②) :
 *   1. TOUT    — forme entière, non divisée
 *   2. PARTAGE — forme divisée en N parts égales, sans coloriage
 *   3. COLORIE — forme divisée, une part coloriée
 *
 * Formes disponibles (fiche S1, matériel) :
 *   - carre    : carré découpé par pliage horizontal/vertical
 *   - rectangle: rectangle découpé en bandes
 *   - disque   : disque en secteurs (comme une part de camembert)
 *   - eventail : demi-disque ("éventail") en secteurs — LE TOUT est le demi-disque entier
 *
 * Dénominateurs S1 : 2, 4, 8 (fractions 1/2, 1/4, 1/8).
 *
 * ⚠️ Grilles carré/rectangle : orientation choisie par cohérence visuelle
 *    (pliage bord à bord, fiche S1 phase ②). Non prescrite au pixel près
 *    par la fiche — les formes physiques admettent plusieurs orientations.
 */

import PropTypes from "prop-types";

// ── Palette ──────────────────────────────────────────────────────────────────

const C = {
    fondTout: "#dbeafe", // blue-100 — forme entière non divisée
    bordTout: "#93c5fd", // blue-300
    partColoriee: "#3b82f6", // blue-500 — la part choisie
    partNeutre: "#f8fafc", // slate-50 — parts non coloriées
    bordForme: "#475569", // slate-600 — contour extérieur
    bordDiv: "#cbd5e1", // slate-200 — lignes de division internes
};

// ── Helpers grille (carré / rectangle) ───────────────────────────────────────

/**
 * Configurations grille par forme et dénominateur.
 * [rows, cols]
 */
const GRILLES = {
    carre: { 2: [2, 1], 4: [2, 2], 8: [2, 4] },
    rectangle: { 2: [1, 2], 4: [1, 4], 8: [2, 4] },
};

/**
 * Génère les cellules d'une grille rectangulaire.
 * @param {number} W           - Largeur totale
 * @param {number} H           - Hauteur totale
 * @param {number} denominateur
 * @param {'carre'|'rectangle'} forme
 * @returns {Array<{ x:number, y:number, w:number, h:number }>}
 */
function cellsGrille(W, H, denominateur, forme) {
    const [rows, cols] = GRILLES[forme][denominateur] ?? [1, denominateur];
    const cw = W / cols;
    const ch = H / rows;
    return Array.from({ length: denominateur }, (_, i) => ({
        x: (i % cols) * cw,
        y: Math.floor(i / cols) * ch,
        w: cw,
        h: ch,
    }));
}

// ── Helpers secteurs (disque / éventail) ─────────────────────────────────────

/**
 * Chemin SVG d'un secteur de disque (départ en haut, sens horaire).
 * @param {number} cx - Centre x
 * @param {number} cy - Centre y
 * @param {number} r  - Rayon
 * @param {number} i  - Index du secteur (0 = haut)
 * @param {number} N  - Nombre total de secteurs
 * @returns {string}
 */
function pathSecteurDisque(cx, cy, r, i, N) {
    const a1 = -Math.PI / 2 + (2 * Math.PI * i) / N;
    const a2 = -Math.PI / 2 + (2 * Math.PI * (i + 1)) / N;
    const x1 = (cx + r * Math.cos(a1)).toFixed(3);
    const y1 = (cy + r * Math.sin(a1)).toFixed(3); // y-down : sin positif = bas
    const x2 = (cx + r * Math.cos(a2)).toFixed(3);
    const y2 = (cy + r * Math.sin(a2)).toFixed(3);
    // sweep=1 : horaire dans le repère SVG (y vers le bas)
    return `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 0,1 ${x2},${y2} Z`;
}

/**
 * Chemin SVG d'un secteur d'éventail (de gauche à droite par l'arc supérieur).
 *
 * L'éventail = demi-disque, bord plat en bas (côté droit de l'axe y).
 * L'arc va de gauche à droite en passant par le haut.
 * Secteur 0 = secteur le plus à gauche.
 *
 * @param {number} cx - Centre de l'axe plat (bas de l'éventail)
 * @param {number} cy - Y du bord plat
 * @param {number} r  - Rayon
 * @param {number} i  - Index du secteur (0 = gauche)
 * @param {number} N  - Nombre total de secteurs
 * @returns {string}
 */
function pathSecteurEventail(cx, cy, r, i, N) {
    // angle en math standard : va de π (gauche) vers 0 (droite)
    const a1 = Math.PI - i * (Math.PI / N);
    const a2 = Math.PI - (i + 1) * (Math.PI / N);
    const x1 = (cx + r * Math.cos(a1)).toFixed(3);
    const y1 = (cy - r * Math.sin(a1)).toFixed(3); // y-down : minus
    const x2 = (cx + r * Math.cos(a2)).toFixed(3);
    const y2 = (cy - r * Math.sin(a2)).toFixed(3);
    // sweep=1 : horaire SVG → de gauche vers droite par le haut ✓
    return `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 0,1 ${x2},${y2} Z`;
}

// ── Rendu par forme ───────────────────────────────────────────────────────────

/**
 * Rendu SVG pour carré ou rectangle.
 */
function RectSVG({ forme, denominateur, etat, partColoriee, taille }) {
    const W = forme === "carre" ? 100 : 160;
    const H = forme === "carre" ? 100 : 80;
    const scale = taille / Math.max(W, H);
    const sw = (W * scale).toFixed(1);
    const sh = (H * scale).toFixed(1);

    if (etat === "tout") {
        return (
            <svg
                width={sw}
                height={sh}
                viewBox={`0 0 ${W} ${H}`}
                role="img"
                aria-label={`${forme === "carre" ? "Carré" : "Rectangle"} entier — le tout`}
            >
                <rect
                    x={1}
                    y={1}
                    width={W - 2}
                    height={H - 2}
                    fill={C.fondTout}
                    stroke={C.bordTout}
                    strokeWidth={2}
                    rx={3}
                />
            </svg>
        );
    }

    const cells = cellsGrille(W, H, denominateur, forme);

    return (
        <svg
            width={sw}
            height={sh}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={`${forme === "carre" ? "Carré" : "Rectangle"} partagé en ${denominateur} parts`}
        >
            {cells.map((cell, i) => (
                <rect
                    key={i}
                    x={cell.x + 0.5}
                    y={cell.y + 0.5}
                    width={cell.w - 1}
                    height={cell.h - 1}
                    fill={
                        etat === "colorie" && i === partColoriee
                            ? C.partColoriee
                            : C.partNeutre
                    }
                    stroke={
                        etat === "colorie" && i === partColoriee
                            ? C.partColoriee
                            : C.bordDiv
                    }
                    strokeWidth={1}
                    rx={1}
                />
            ))}
            {/* Contour extérieur */}
            <rect
                x={0.5}
                y={0.5}
                width={W - 1}
                height={H - 1}
                fill="none"
                stroke={C.bordForme}
                strokeWidth={1.5}
                rx={2}
            />
        </svg>
    );
}

/**
 * Rendu SVG pour disque.
 */
function DisqueSVG({ denominateur, etat, partColoriee, taille }) {
    const SIZE = 100;
    const cx = 50,
        cy = 50,
        r = 44;

    if (etat === "tout") {
        return (
            <svg
                width={taille}
                height={taille}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                role="img"
                aria-label="Disque entier — le tout"
            >
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={C.fondTout}
                    stroke={C.bordTout}
                    strokeWidth={2}
                />
            </svg>
        );
    }

    return (
        <svg
            width={taille}
            height={taille}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={`Disque partagé en ${denominateur} parts`}
        >
            {Array.from({ length: denominateur }, (_, i) => (
                <path
                    key={i}
                    d={pathSecteurDisque(cx, cy, r, i, denominateur)}
                    fill={
                        etat === "colorie" && i === partColoriee
                            ? C.partColoriee
                            : C.partNeutre
                    }
                    stroke={
                        etat === "colorie" && i === partColoriee
                            ? C.partColoriee
                            : C.bordDiv
                    }
                    strokeWidth={1}
                />
            ))}
            {/* Contour extérieur */}
            <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={C.bordForme}
                strokeWidth={1.5}
            />
        </svg>
    );
}

/**
 * Rendu SVG pour éventail (demi-disque).
 * ⚠️ L'éventail est LE TOUT (fiche S1 : "l'éventail est le TOUT").
 */
function EventailSVG({ denominateur, etat, partColoriee, taille }) {
    const VW = 120,
        VH = 66;
    const cx = 60,
        cy = 62,
        r = 56;
    const sw = taille;
    const sh = Math.round((taille * VH) / VW);

    if (etat === "tout") {
        return (
            <svg
                width={sw}
                height={sh}
                viewBox={`0 0 ${VW} ${VH}`}
                role="img"
                aria-label="Éventail entier — le tout"
            >
                <path
                    d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy} Z`}
                    fill={C.fondTout}
                    stroke={C.bordTout}
                    strokeWidth={2}
                />
                <line
                    x1={cx - r}
                    y1={cy}
                    x2={cx + r}
                    y2={cy}
                    stroke={C.bordTout}
                    strokeWidth={2}
                />
            </svg>
        );
    }

    return (
        <svg
            width={sw}
            height={sh}
            viewBox={`0 0 ${VW} ${VH}`}
            role="img"
            aria-label={`Éventail partagé en ${denominateur} parts`}
        >
            {Array.from({ length: denominateur }, (_, i) => (
                <path
                    key={i}
                    d={pathSecteurEventail(cx, cy, r, i, denominateur)}
                    fill={
                        etat === "colorie" && i === partColoriee
                            ? C.partColoriee
                            : C.partNeutre
                    }
                    stroke={
                        etat === "colorie" && i === partColoriee
                            ? C.partColoriee
                            : C.bordDiv
                    }
                    strokeWidth={1}
                />
            ))}
            {/* Bord plat */}
            <line
                x1={cx - r}
                y1={cy}
                x2={cx + r}
                y2={cy}
                stroke={C.bordForme}
                strokeWidth={1.5}
            />
            {/* Contour arc extérieur */}
            <path
                d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
                fill="none"
                stroke={C.bordForme}
                strokeWidth={1.5}
            />
        </svg>
    );
}

// ── PropTypes internes ────────────────────────────────────────────────────────

const sharedPropTypes = {
    denominateur: PropTypes.oneOf([2, 4, 8]).isRequired,
    etat: PropTypes.oneOf(["tout", "partage", "colorie"]).isRequired,
    partColoriee: PropTypes.number,
    taille: PropTypes.number.isRequired,
};

RectSVG.propTypes = {
    ...sharedPropTypes,
    forme: PropTypes.oneOf(["carre", "rectangle"]).isRequired,
};
DisqueSVG.propTypes = sharedPropTypes;
EventailSVG.propTypes = sharedPropTypes;

// ── Composant public ─────────────────────────────────────────────────────────

/**
 * Forme géométrique partagée — dispatcher public.
 *
 * @param {Object}  props
 * @param {'carre'|'rectangle'|'disque'|'eventail'} props.forme
 * @param {2|4|8}   props.denominateur
 * @param {'tout'|'partage'|'colorie'} props.etat
 * @param {number}  [props.partColoriee=0] - Index de la part à colorier (0-based)
 * @param {number}  [props.taille=120]     - Dimension de base en px
 * @returns {JSX.Element}
 */
export default function FormePartageeSVG({
    forme,
    denominateur,
    etat,
    partColoriee = 0,
    taille = 120,
}) {
    if (forme === "carre" || forme === "rectangle") {
        return (
            <RectSVG
                forme={forme}
                denominateur={denominateur}
                etat={etat}
                partColoriee={partColoriee}
                taille={taille}
            />
        );
    }
    if (forme === "disque") {
        return (
            <DisqueSVG
                denominateur={denominateur}
                etat={etat}
                partColoriee={partColoriee}
                taille={taille}
            />
        );
    }
    if (forme === "eventail") {
        return (
            <EventailSVG
                denominateur={denominateur}
                etat={etat}
                partColoriee={partColoriee}
                taille={taille}
            />
        );
    }
    return null;
}

FormePartageeSVG.propTypes = {
    forme: PropTypes.oneOf(["carre", "rectangle", "disque", "eventail"])
        .isRequired,
    denominateur: PropTypes.oneOf([2, 4, 8]).isRequired,
    etat: PropTypes.oneOf(["tout", "partage", "colorie"]).isRequired,
    partColoriee: PropTypes.number,
    taille: PropTypes.number,
};
