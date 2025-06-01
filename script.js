const taille = 10;
const grilleJoueur = document.getElementById("grille-joueur");
const grilleOrdi = document.getElementById("grille-ordi");
const statusText = document.getElementById("status");
const scoreText = document.getElementById("score");
const hitSound = document.getElementById("hit-sound");
const rejouerBtn = document.getElementById("rejouer-btn");

let parties = 0;
let scoreJoueur = 0;
let scoreOrdi = 0;

let bateauxJoueur = [];
let bateauxOrdi = [];
let touchesJoueur = new Set();
let touchesOrdi = new Set();
let tirsOrdi = new Set();

function genererBateaux(nombre) {
  const positions = [];
  while (positions.length < nombre) {
    const pos = [
      Math.floor(Math.random() * taille),
      Math.floor(Math.random() * taille),
    ];
    if (!positions.some((p) => p[0] === pos[0] && p[1] === pos[1])) {
      positions.push(pos);
    }
  }
  return positions;
}

function mettreAJourScore() {
  scoreText.textContent = `Score - Vous: ${scoreJoueur} | Ordinateur: ${scoreOrdi} | Partie: ${parties}/5`;
}

function initialiserPartie() {
  grilleJoueur.innerHTML = "";
  grilleOrdi.innerHTML = "";
  touchesJoueur = new Set();
  touchesOrdi = new Set();
  tirsOrdi = new Set();
  bateauxJoueur = genererBateaux(5);
  bateauxOrdi = genererBateaux(5);

  for (let i = 0; i < taille * taille; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    const x = Math.floor(i / taille);
    const y = i % taille;
    if (bateauxJoueur.some((b) => b[0] === x && b[1] === y)) {
      cell.classList.add("bateau");
    }
    grilleJoueur.appendChild(cell);
  }

  for (let i = 0; i < taille * taille; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    const x = Math.floor(i / taille);
    const y = i % taille;
    cell.addEventListener("click", () => {
      if (
        cell.classList.contains("touche") ||
        cell.classList.contains("manque")
      )
        return;

      if (bateauxOrdi.some((b) => b[0] === x && b[1] === y)) {
        cell.classList.add("touche");
        hitSound.currentTime = 0;
        hitSound.play().catch((e) => console.error("Erreur lecture audio:", e));
        touchesJoueur.add(`${x},${y}`);
        if (touchesJoueur.size === bateauxOrdi.length) {
          statusText.textContent =
            "🎯 Tous les bateaux ennemis ont été coulés ! Vous avez gagné cette manche !";
          scoreJoueur++;
          parties++;
          terminerPartie();
        } else {
          statusText.textContent = "🎯 Touché !";
        }
      } else {
        cell.classList.add("manque");
        statusText.textContent = "❌ Raté ! L'ordinateur va tirer...";
        setTimeout(tirOrdi, 1000);
      }
    });
    grilleOrdi.appendChild(cell);
  }

  mettreAJourScore();
}

function terminerPartie() {
  grilleOrdi.classList.add("disabled");
  grilleJoueur.classList.add("disabled");
  mettreAJourScore();
  if (parties < 5) {
    setTimeout(() => {
      grilleOrdi.classList.remove("disabled");
      grilleJoueur.classList.remove("disabled");
      initialiserPartie();
    }, 3000);
  } else {
    statusText.textContent += `\n🏁 Fin des 5 parties. Résultat final - Vous: ${scoreJoueur}, Ordinateur: ${scoreOrdi}`;
    rejouerBtn.style.display = "inline-block";
  }
}

function tirOrdi() {
  let x, y, index, cell;
  let tentative = 0;

  do {
    x = Math.floor(Math.random() * taille);
    y = Math.floor(Math.random() * taille);
    index = x * taille + y;
    tentative++;
    if (tentative > 100) return;
  } while (tirsOrdi.has(`${x},${y}`));

  tirsOrdi.add(`${x},${y}`);
  cell = grilleJoueur.children[index];

  if (bateauxJoueur.some((b) => b[0] === x && b[1] === y)) {
    cell.classList.add("touche");
    hitSound.currentTime = 0;
    hitSound.play().catch((e) => console.error("Erreur lecture audio:", e));
    touchesOrdi.add(`${x},${y}`);
    if (touchesOrdi.size === bateauxJoueur.length) {
      statusText.textContent =
        "💥 L'ordinateur a coulé tous vos bateaux ! Vous avez perdu cette manche...";
      scoreOrdi++;
      parties++;
      terminerPartie();
    } else {
      statusText.textContent = "💥 L'ordinateur a touché un bateau !";
    }
  } else {
    cell.classList.add("manque");
    statusText.textContent = "🔄 À votre tour !";
  }
}

function relancerJeu() {
  console.log("Rejouer cliqué");
  parties = 0;
  scoreJoueur = 0;
  scoreOrdi = 0;
  rejouerBtn.style.display = "none";
  statusText.textContent = "";
  initialiserPartie();
  location.reload();
}

rejouerBtn.addEventListener("click", relancerJeu);

initialiserPartie();
