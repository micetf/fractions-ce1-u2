/**
 * @fileoverview Navbar principale — identité visuelle micetf.fr.
 *
 * Modification : BoutonAide activé (était commenté).
 * onAide est désormais utilisé — passé depuis App.jsx pour ouvrir
 * la modale PriseEnMain.
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { VUES, NAV_CONFIG } from "../../config/navigation.config";

// ── Icônes ────────────────────────────────────────────────────────────────────

function IconHeart() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="currentColor"
            aria-hidden="true"
        >
            <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5
                2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08
                C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5
                c0 3.77-3.4 6.86-8.55 11.53L12 21.35z"
            />
        </svg>
    );
}

function IconMail() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8
                M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5
                a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
        </svg>
    );
}

function IconHamburger() {
    return (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
            />
        </svg>
    );
}

// ── Sous-composants ───────────────────────────────────────────────────────────

/**
 * Bouton d'aide « ? » — ouvre la modale PriseEnMain.
 *
 * @param {{ onClick: () => void }} props
 */
function BoutonAide({ onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-10 h-10 bg-blue-600 text-white rounded-full
                hover:bg-blue-700 transition font-bold text-lg"
            title="Prise en main"
            aria-label="Ouvrir la prise en main"
        >
            ?
        </button>
    );
}

BoutonAide.propTypes = { onClick: PropTypes.func.isRequired };

function BoutonDon() {
    return (
        <form
            action="https://www.paypal.com/cgi-bin/webscr"
            method="post"
            target="_top"
            className="inline-block"
        >
            <button
                type="submit"
                className="px-3 py-2 bg-yellow-500 text-white rounded
                    hover:bg-yellow-600 transition my-1 mx-1"
                title="Si vous pensez que ces outils le méritent… Merci !"
                aria-label="Faire un don via PayPal"
            >
                <IconHeart />
            </button>
            <input type="hidden" value="_s-xclick" name="cmd" />
            <input
                type="hidden"
                value="Q2XYVFP4EEX2J"
                name="hosted_button_id"
            />
        </form>
    );
}

function LienContact() {
    return (
        <a
            href="mailto:webmaster@micetf.fr?subject=À propos de /fractions-ce1-u2"
            className="px-3 py-2 bg-gray-600 text-white rounded
                hover:bg-gray-700 transition my-1 mx-1 inline-block"
            title="Pour contacter le webmaster…"
            aria-label="Envoyer un e-mail au webmaster"
        >
            <IconMail />
        </a>
    );
}

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Navbar principale de l'application Fractions CE1.
 *
 * @param {Object}   props
 * @param {string}   props.vueActive  - Identifiant de la vue courante
 * @param {Function} props.onNaviguer - Callback de changement de vue
 * @param {Function} props.onAide     - Ouvre la modale de prise en main
 */
export default function Navbar({ vueActive, onNaviguer, onAide }) {
    const [menuOuvert, setMenuOuvert] = useState(false);

    function naviguer(vue) {
        onNaviguer(vue);
        setMenuOuvert(false);
    }

    return (
        <nav
            className="fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-50"
            aria-label="Barre de navigation principale"
        >
            <div className="max-w-full px-4">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <a
                        href="https://micetf.fr"
                        className="text-white font-semibold text-lg
                            hover:text-gray-300 transition shrink-0"
                        aria-label="Retour à l'accueil MiCetF"
                    >
                        MiCetF
                    </a>

                    {/* Titre (masqué sur mobile) */}
                    <span
                        className="hidden md:block text-white font-semibold
                        text-base ml-4 truncate"
                    >
                        Fractions CE1
                    </span>

                    {/* Hamburger mobile */}
                    <button
                        type="button"
                        onClick={() => setMenuOuvert((p) => !p)}
                        className="md:hidden inline-flex items-center justify-center
                            p-2 text-gray-400 hover:text-white hover:bg-gray-700
                            rounded transition"
                        aria-controls="navbarMenu"
                        aria-expanded={menuOuvert}
                        aria-label={
                            menuOuvert ? "Fermer le menu" : "Ouvrir le menu"
                        }
                    >
                        <IconHamburger />
                    </button>

                    {/* Navigation desktop */}
                    <div
                        className="hidden md:flex flex-1 items-center
                        justify-between ml-6 gap-2"
                    >
                        <div className="flex gap-1">
                            {Object.entries(NAV_CONFIG).map(
                                ([vue, { label, module }]) => (
                                    <button
                                        key={vue}
                                        type="button"
                                        onClick={() => naviguer(vue)}
                                        className={[
                                            "flex items-center gap-1.5 px-3 py-2",
                                            "rounded text-sm font-medium transition",
                                            vueActive === vue
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-400 hover:text-white hover:bg-gray-700",
                                        ].join(" ")}
                                        aria-current={
                                            vueActive === vue
                                                ? "page"
                                                : undefined
                                        }
                                    >
                                        <span className="text-xs font-mono opacity-60">
                                            {module}
                                        </span>
                                        {label}
                                    </button>
                                )
                            )}
                        </div>

                        <div className="flex-1" />

                        {/* Utilitaires — BoutonAide activé */}
                        <ul
                            className="flex items-center space-x-1"
                            aria-label="Actions rapides"
                        >
                            <li>
                                <BoutonAide onClick={onAide} />
                            </li>
                            <li>
                                <BoutonDon />
                            </li>
                            <li>
                                <LienContact />
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Menu mobile déroulant */}
                {menuOuvert && (
                    <div id="navbarMenu" className="md:hidden pb-3 space-y-1">
                        {Object.entries(NAV_CONFIG).map(
                            ([vue, { label, module }]) => (
                                <button
                                    key={vue}
                                    type="button"
                                    onClick={() => naviguer(vue)}
                                    className={[
                                        "w-full flex items-center gap-2 px-3 py-2",
                                        "rounded text-sm font-medium transition text-left",
                                        vueActive === vue
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-400 hover:text-white hover:bg-gray-700",
                                    ].join(" ")}
                                    aria-current={
                                        vueActive === vue ? "page" : undefined
                                    }
                                >
                                    <span className="text-xs font-mono opacity-60">
                                        {module}
                                    </span>
                                    {label}
                                </button>
                            )
                        )}
                        <div
                            className="flex items-center gap-2 pt-2 border-t
                            border-gray-700"
                        >
                            <BoutonAide
                                onClick={() => {
                                    setMenuOuvert(false);
                                    onAide();
                                }}
                            />
                            <BoutonDon />
                            <LienContact />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

Navbar.propTypes = {
    vueActive: PropTypes.string.isRequired,
    onNaviguer: PropTypes.func.isRequired,
    onAide: PropTypes.func.isRequired,
};
