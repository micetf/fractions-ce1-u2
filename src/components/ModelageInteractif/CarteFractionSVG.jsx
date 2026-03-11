/**
 * @fileoverview CarteFractionSVG — carte « écriture en chiffres » d'une fraction.
 *
 * Implémente le modelage prescrit par la fiche S5, phase ② :
 *   « Je l'écris EN BAS. [chiffre du bas]
 *   Maintenant je trace le trait de fraction — la barre horizontale. [trait]
 *   Et en haut, je mets le nombre de parts que je prends. [chiffre du haut] »
 *
 * Trois états progressifs (correspondant aux 3 temps du modelage) :
 *   - 'bas'     : chiffre du dénominateur seul
 *   - 'trait'   : chiffre du bas + trait de fraction
 *   - 'complet' : fraction complète 1/N
 *
 * Contra-exemples (fiche S5, phase ②, prescrits mot pour mot) :
 *   - 'inverse'   : N/1 — inversion haut/bas
 *   - 'tiret'     : 1-N — tiret au lieu du trait de fraction
 *   - 'sanstrait' : les deux chiffres juxtaposés sans séparateur
 *
 * ⚠️ Terminologie CE1 : « chiffre du haut » et « chiffre du bas ».
 *    Ne pas afficher « numérateur » / « dénominateur » dans ce composant.
 */

import PropTypes from "prop-types";

// ── Palette ───────────────────────────────────────────────────────────────────

const C = {
    fond: "#ffffff",
    bordure: "#475569", // slate-600
    chiffre: "#1e293b", // slate-900
    trait: "#3b82f6", // blue-500 — mis en valeur dans le modelage
    traitErreur: "#ef4444", // red-500 — pour les contre-exemples
    libelle: "#64748b", // slate-500
    libelleHaut: "#3b82f6", // blue-500 — annotation « chiffre du haut »
    libelleBas: "#10b981", // emerald-500 — annotation « chiffre du bas »
    libelleGris: "#94a3b8", // slate-400 — annotation désactivée (pas encore révélé)
};

// ── Composant ─────────────────────────────────────────────────────────────────

/**
 * Carte symbolique d'une fraction unitaire.
 *
 * @param {Object}  props
 * @param {number}  props.denominateur       - Dénominateur (2, 3, 4, 5, 6, 8, 10)
 * @param {'bas'|'trait'|'complet'|'inverse'|'tiret'|'sanstrait'} props.etat
 * @param {boolean} [props.annotations=false]  - Afficher les libellés pédagogiques
 * @param {number}  [props.taille=120]         - Hauteur de la carte en px
 * @returns {JSX.Element}
 */
export default function CarteFractionSVG({
    denominateur,
    etat = "complet",
    annotations = false,
    taille = 120,
}) {
    // Dimensions SVG de base
    const W = 80;
    const H = 110;
    const scale = taille / H;
    const sw = (W * scale).toFixed(1);
    const sh = taille;

    // Positions des éléments
    const cx = W / 2;
    const yBas = 78; // baseline chiffre du bas
    const yTrait = 56; // y du trait horizontal
    const yHaut = 42; // baseline chiffre du haut

    // Taille de police selon la longueur du dénominateur
    const fontSize = denominateur >= 10 ? 28 : 32;

    // ── Trait de fraction ──────────────────────────────────────────────────────
    const longueurTrait = denominateur >= 10 ? 42 : 36;
    const x1Trait = cx - longueurTrait / 2;
    const x2Trait = cx + longueurTrait / 2;

    // ── Rendu des éléments selon l'état ──────────────────────────────────────

    const renderChiffreBas = () => (
        <text
            x={cx}
            y={yBas}
            textAnchor="middle"
            fontSize={fontSize}
            fontWeight="bold"
            fill={C.chiffre}
            fontFamily="'Georgia', serif"
        >
            {denominateur}
        </text>
    );

    const renderTrait = (couleur = C.trait) => (
        <line
            x1={x1Trait}
            y1={yTrait}
            x2={x2Trait}
            y2={yTrait}
            stroke={couleur}
            strokeWidth={2.5}
            strokeLinecap="round"
        />
    );

    const renderTiret = () => (
        /* Contre-exemple : tiret oblique ou court au lieu du trait horizontal */
        <text
            x={cx}
            y={yTrait + 6}
            textAnchor="middle"
            fontSize={22}
            fill={C.traitErreur}
            fontFamily="monospace"
        >
            -
        </text>
    );

    const renderChiffreHaut = (valeur = 1) => (
        <text
            x={cx}
            y={yHaut}
            textAnchor="middle"
            fontSize={fontSize}
            fontWeight="bold"
            fill={C.chiffre}
            fontFamily="'Georgia', serif"
        >
            {valeur}
        </text>
    );

    // ── Annotations pédagogiques ───────────────────────────────────────────────
    const renderAnnotations = () => {
        const hauteRevele = etat === "complet";
        const traitRevele = etat === "trait" || etat === "complet";

        return (
            <>
                {/* « chiffre du haut » */}
                <text
                    x={W - 4}
                    y={yHaut - 2}
                    textAnchor="end"
                    fontSize={7}
                    fill={hauteRevele ? C.libelleHaut : C.libelleGris}
                    fontStyle="italic"
                >
                    chiffre du haut
                </text>
                {/* « trait de fraction » */}
                <text
                    x={W - 4}
                    y={yTrait + 3}
                    textAnchor="end"
                    fontSize={7}
                    fill={traitRevele ? C.trait : C.libelleGris}
                    fontStyle="italic"
                >
                    trait de fraction
                </text>
                {/* « chiffre du bas » */}
                <text
                    x={W - 4}
                    y={yBas - 2}
                    textAnchor="end"
                    fontSize={7}
                    fill={C.libelleBas}
                    fontStyle="italic"
                >
                    chiffre du bas
                </text>
            </>
        );
    };

    // ── Assemblage selon l'état ────────────────────────────────────────────────
    const renderContenu = () => {
        switch (etat) {
            case "bas":
                return <>{renderChiffreBas()}</>;

            case "trait":
                return (
                    <>
                        {renderChiffreBas()}
                        {renderTrait()}
                    </>
                );

            case "complet":
                return (
                    <>
                        {renderChiffreHaut()}
                        {renderTrait()}
                        {renderChiffreBas()}
                    </>
                );

            case "inverse":
                // Contre-exemple : dénominateur EN HAUT, 1 en bas
                return (
                    <>
                        {renderChiffreHaut(denominateur)}
                        {renderTrait(C.traitErreur)}
                        {/* 1 en bas */}
                        <text
                            x={cx}
                            y={yBas}
                            textAnchor="middle"
                            fontSize={fontSize}
                            fontWeight="bold"
                            fill={C.traitErreur}
                            fontFamily="'Georgia', serif"
                        >
                            1
                        </text>
                    </>
                );

            case "tiret":
                // Contre-exemple : 1 - N avec tiret
                return (
                    <>
                        {renderChiffreHaut()}
                        {renderTiret()}
                        {renderChiffreBas()}
                    </>
                );

            case "sanstrait":
                // Contre-exemple : les deux chiffres juxtaposés (ex. « 18 » ou « 14 »)
                return (
                    <text
                        x={cx}
                        y={yTrait + 8}
                        textAnchor="middle"
                        fontSize={30}
                        fontWeight="bold"
                        fill={C.traitErreur}
                        fontFamily="'Georgia', serif"
                    >
                        1{denominateur}
                    </text>
                );

            default:
                return null;
        }
    };

    return (
        <svg
            width={sw}
            height={sh}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={
                etat === "complet"
                    ? `Fraction 1/${denominateur} en chiffres`
                    : `Carte fraction — état : ${etat}`
            }
        >
            {/* Fond carte */}
            <rect
                x={2}
                y={2}
                width={W - 4}
                height={H - 4}
                rx={6}
                ry={6}
                fill={C.fond}
                stroke={
                    ["inverse", "tiret", "sanstrait"].includes(etat)
                        ? C.traitErreur
                        : C.bordure
                }
                strokeWidth={1.5}
            />

            {/* Contenu fraction */}
            {renderContenu()}

            {/* Annotations pédagogiques */}
            {annotations && renderAnnotations()}

            {/* Croix ✗ pour les contre-exemples */}
            {["inverse", "tiret", "sanstrait"].includes(etat) && (
                <text
                    x={W - 10}
                    y={16}
                    textAnchor="middle"
                    fontSize={14}
                    fontWeight="bold"
                    fill={C.traitErreur}
                    aria-hidden="true"
                >
                    ✗
                </text>
            )}
        </svg>
    );
}

CarteFractionSVG.propTypes = {
    denominateur: PropTypes.oneOf([2, 3, 4, 5, 6, 8, 10]).isRequired,
    etat: PropTypes.oneOf([
        "bas",
        "trait",
        "complet", // états progressifs du modelage
        "inverse",
        "tiret",
        "sanstrait", // contre-exemples prescrits fiche S5
    ]),
    annotations: PropTypes.bool,
    taille: PropTypes.number,
};
