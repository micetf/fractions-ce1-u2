/**
 * @fileoverview Validation sprint 0 — données de configuration.
 * Exécuter avec : node validate-sprint0.mjs
 */

import { FRACTIONS, getFractionsDisponibles, FRACTIONS_PAIRES_S2 } from './src/config/fractions.config.js';
import { OBSERVABLES, SEANCES, getObservablesParSeance } from './src/config/observables.config.js';
import { ITEMS_AUTOEVAL, ITEMS_CRITERES_VERS_S3, MESSAGE_ALERTE_S6 } from './src/config/autoeval.config.js';

let erreurs = 0;
const ok  = (msg) => console.log(`  ✓ ${msg}`);
const err = (msg) => { console.error(`  ✗ ${msg}`); erreurs++; };

// ── fractions.config.js ───────────────────────────────────────────────────────
console.log('\n── fractions.config.js ──');

FRACTIONS.length === 7
  ? ok('7 fractions présentes')
  : err(`Attendu 7 fractions, trouvé ${FRACTIONS.length}`);

[2, 3, 4, 5, 6, 8, 10].forEach((d) => {
  const f = FRACTIONS.find((x) => x.denominateur === d);
  f ? ok(`1/${d} — « ${f.nomLettres} » — séance ${f.seanceIntro}`)
    : err(`Fraction 1/${d} manquante`);
});

const dispS3 = getFractionsDisponibles(3).map((f) => f.chiffres);
(dispS3.includes('1/3') && dispS3.includes('1/6'))
  ? ok('getFractionsDisponibles(3) inclut 1/3 et 1/6')
  : err('getFractionsDisponibles(3) devrait inclure 1/3 et 1/6');

const dispS1 = getFractionsDisponibles(1).map((f) => f.chiffres);
(dispS1.includes('1/2') && !dispS1.includes('1/3'))
  ? ok('getFractionsDisponibles(1) inclut 1/2 mais pas 1/3')
  : err('getFractionsDisponibles(1) incorrecte');

FRACTIONS_PAIRES_S2.length === 3
  ? ok('FRACTIONS_PAIRES_S2 contient 3 fractions (1/2, 1/4, 1/8)')
  : err(`FRACTIONS_PAIRES_S2 devrait contenir 3 fractions`);

// ── observables.config.js ────────────────────────────────────────────────────
console.log('\n── observables.config.js ──');

// Compte réel : 6+4+4+7+7+7 = 35
// Le SRS v1.0 indiquait 32 par erreur de comptage — corrigé ici.
OBSERVABLES.length === 35
  ? ok('35 observables (S1:6 + S2:4 + S3:4 + S4:7 + S5:7 + S6:7)')
  : err(`Attendu 35 observables, trouvé ${OBSERVABLES.length}`);

const attendus = { S1: 6, S2: 4, S3: 4, S4: 7, S5: 7, S6: 7 };
Object.entries(attendus).forEach(([seance, n]) => {
  const obs = getObservablesParSeance(seance);
  obs.length === n
    ? ok(`${seance} — ${obs.length} observables`)
    : err(`${seance} — attendu ${n}, trouvé ${obs.length}`);
});

SEANCES.length === 6
  ? ok('6 séances définies')
  : err(`Attendu 6 séances, trouvé ${SEANCES.length}`);

// ── autoeval.config.js ───────────────────────────────────────────────────────
console.log('\n── autoeval.config.js ──');

ITEMS_AUTOEVAL.length === 6
  ? ok('6 items d\'auto-évaluation')
  : err(`Attendu 6 items, trouvé ${ITEMS_AUTOEVAL.length}`);

// Critères vers S3 : items 3, 4 et 6 (fiche S6)
['AE-03', 'AE-04', 'AE-06'].forEach((id) => {
  ITEMS_CRITERES_VERS_S3.includes(id)
    ? ok(`${id} identifié comme critère vers S3`)
    : err(`${id} devrait être un critère vers S3 (fiche S6)`);
});

(MESSAGE_ALERTE_S6.includes('5 min') && MESSAGE_ALERTE_S6.includes('S3'))
  ? ok('Message d\'alerte S6 contient les mots-clés attendus')
  : err('Message d\'alerte S6 incorrect');

// ── navigation.config.js ─────────────────────────────────────────────────────
console.log('\n── navigation.config.js ──');
// Import dynamique pour vérification sans JSX
import('./src/config/navigation.config.js').then(({ VUES, NAV_CONFIG, VUE_INITIALE }) => {
  Object.keys(VUES).length === 5
    ? ok('5 vues définies dans VUES')
    : err(`Attendu 5 vues, trouvé ${Object.keys(VUES).length}`);

  Object.keys(NAV_CONFIG).length === 5
    ? ok('5 entrées dans NAV_CONFIG')
    : err('NAV_CONFIG incomplet');

  VUE_INITIALE === 'tableau_de_bord'
    ? ok(`VUE_INITIALE = "${VUE_INITIALE}"`)
    : err(`VUE_INITIALE devrait être "tableau_de_bord", trouvé "${VUE_INITIALE}"`);

  // ── Résultat ─────────────────────────────────────────────────────────────
  console.log(`\n── Résultat : ${erreurs === 0 ? '✓ Toutes les validations passent' : `✗ ${erreurs} erreur(s)`} ──\n`);
  if (erreurs > 0) process.exit(1);
});
