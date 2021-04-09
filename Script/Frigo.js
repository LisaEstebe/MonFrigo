//num 14
const url =
  "https://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigo/public/14/produits";

//-----------------------------------------------------------------
//-----------------------------------------------------------------
//----------------------- AFFICHAGE -------------------------------
//-----------------------------------------------------------------
//-----------------------------------------------------------------
document.getElementById("accueil").addEventListener("click", accueil);
document.getElementById("logo").addEventListener("click", accueil);
document.getElementById("recherche").addEventListener("click", hiddenSearch);
document.getElementById("mesproduits").addEventListener("click", hiddenButton);
document.getElementById("produits").addEventListener("click", hiddenButton);

accueil();

function accueil() {
  document.getElementById("liste").style.visibility = "hidden";
  document.getElementById("search").style.visibility = "hidden";
  document.getElementById("ajout").style.visibility = "hidden";
  document.getElementById("nouveauProduit").style.visibility = "hidden";
  document.getElementById("frigoferme").style.visibility = "visible";
}

//cacher le boutton
function hiddenButton() {
  document.getElementById("produits").style.visibility = "hidden";
  document.getElementById("liste").style.visibility = "visible";
  document.getElementById("frigoferme").style.visibility = "hidden";
  listeProduits();
}

function hiddenSearch() {
  document.getElementById("search").style.visibility = "visible";
  document.getElementById("produits").style.visibility = "hidden";
  document.getElementById("liste").style.visibility = "visible";
  listeProduits();
}

// --------------------------------------------
// ----- Liste des produits dans le frigo -----
// --------------------------------------------

function listeProduits() {
  // -- option pour faire la req AJAX -> ici req GET
  let fetchOptions = { method: "GET" };
  // -- faire la req AJAX vers le serveur pour récuperer le contenu du frigo
  // -- req HTTP vers le serveur et attente (en asynchrone) de la réponse
  fetch(url, fetchOptions)
    .then((response) => {
      return response.json(); // -- extraire les données au format JSON
    })
    .then((dataJSON) => {
      // dataJSON = les données renvoyées au format JSON
      let resHTML =
        "<tr><th> </th><th> </th><th> </th><th> </th><th> </th></tr>";

      // boucle sur le tableau des produits
      for (let p of dataJSON) {
        resHTML +=
          "<tr><td>" +
          "<input type='button' name='deleteAll'" +
          "id='" +
          p.id +
          "' nom='" +
          p.nom +
          "' class='buttonDeleteAll'>" +
          "</td><td>" +
          p.nom +
          "</td><td>" +
          "<input type='button' name='delete1'" +
          "id='" +
          p.id +
          "' nom='" +
          p.nom +
          "' qte='" +
          p.qte +
          "' value='-' class='buttonDelete'>" +
          "</td><td>" +
          p.qte +
          "</td><td>" +
          "<input type='button' name='add1'" +
          "id='" +
          p.id +
          "' nom='" +
          p.nom +
          "' qte='" +
          p.qte +
          "' value='+' class='buttonAdd'>" +
          "</td></tr>";
      }

      // insérer le HTML dans la liste <ul></ul> du fichier index.html
      document.getElementById("tableau").innerHTML = resHTML;

      let buttonsPlus = document.getElementsByName("add1");
      for (let b of buttonsPlus) {
        b.addEventListener("click", addOne);
      }

      let buttonsMinus = document.getElementsByName("delete1");
      for (let b of buttonsMinus) {
        b.addEventListener("click", deleteOne);
      }

      let buttonsDeleteAll = document.getElementsByName("deleteAll");
      for (let b of buttonsDeleteAll) {
        b.addEventListener("click", deleteProduit);
      }
    })

    .catch((error) => {
      // gestion des erreurs
      console.log(error);
    });
}

//-----------------------------------------------------------------
//-----------------------------------------------------------------
//----------------------- AJOUT -----------------------------------
//-----------------------------------------------------------------
//-----------------------------------------------------------------
document
  .getElementById("newProduits")
  .addEventListener("click", listeProduitsAdd);

// -----------------------------------------
// ----- Liste des produits pour ajout -----
// -----------------------------------------

function listeProduitsAdd() {
  document.getElementById("ajout").style.visibility = "visible";

  const fetchOptions = { method: "GET" };
  // récupérer la valeur saisie dans la zone de texte
  fetch(url, fetchOptions)
    .then((response) => {
      // -- réponse au sens du protocole HTTP
      console.log("test");

      return response.json(); // -- extraire les données au format JSON
    })
    .then((dataJSON) => {
      // dataJSON = les données renvoyées au format JSON
      console.log("test");

      let resHTML = ""; // variable pour contenir le html généré

      // boucle sur le tableau des produits
      for (let p of dataJSON) {
        resHTML += "<option>" + p.nom + "</option>";
      }
      resHTML += "<option>" + "Nouveau Produit" + "</option>";

      // insérer le HTML dans la liste <ul></ul> du fichier index.html
      document.getElementById("nomToAdd").innerHTML = resHTML;
    })

    .catch((error) => {
      // gestion des erreurs
      console.log(error);
    });
}

// ------------------------------------------------------------
// ----- Si on choisi 'Nouveau Produit' --> Entrer un nom -----
// ------------------------------------------------------------
document
  .getElementById("nomToAdd")
  .addEventListener("change", visibiliteNomProduit);
function visibiliteNomProduit() {
  if (document.getElementById("nomToAdd").value == "Nouveau Produit") {
    document.getElementById("nouveauProduit").style.visibility = "visible";
  } else {
    document.getElementById("nouveauProduit").style.visibility = "hidden";
  }
}

// ------------------------------------------------------------
// ----- Ajouter des produits au Frigo ------------------------
// ------------------------------------------------------------

document
  .getElementById("addProduits")
  .addEventListener("click", reloadNouveauProduit);

//après avoir ajouté un produit la case "Nouveau Produit" se vide
function reloadNouveauProduit() {
  addProduits();
  document.getElementById("nouveauProduit").value = "";
  document.getElementById("qte").value = "";
}

function addProduits() {
  let nom = "";
  if (document.getElementById("nomToAdd").value == "Nouveau Produit") {
    nom = document.getElementById("nouveauProduit").value;
  } else {
    nom = document.getElementById("nomToAdd").value;
  }
  let qte = document.getElementById("qte").value;
  let produit = { nom, qte };

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const fetchOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(produit)
  };

  fetch(url, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((dataJSON) => {
      listeProduits();
    })
    .catch((error) => {
      console.log(error);
    });
}

//-----------------------------------------------
//-------------Modifier un produit-(ajouter 1)---
//-----------------------------------------------

function addOne(event) {
  let id = event.target.id;
  let nom = event.target.attributes.nom.value;
  let qte = Number.parseInt(event.target.attributes.qte.value, 10) + 1;
  let produit = { id, nom, qte };

  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  let fetchOptions = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(produit)
  };
  fetch(url, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((dataJSON) => {
      listeProduits();
    })
    .catch((error) => {
      console.log(error);
    });
}

//-----------------------------------------------------------------
//-----------------------------------------------------------------
//----------------------- RECHERCHE -------------------------------
//-----------------------------------------------------------------
//-----------------------------------------------------------------

document.getElementById("search").addEventListener("input", rechercherProduit);

function rechercherProduit(event) {
  let res = document.getElementById("search").value;
  let fetchOptions = { method: "GET" };
  fetch(url + "?search=" + res, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((dataJSON) => {
      let resHTML =
        "<tr><th>  </th><th> </th><th>  </th><th> </th><th>  </th></tr>";

      for (let p of dataJSON) {
        resHTML +=
          "<tr><td>" +
          "<input type='button' name='deleteAll'" +
          "id='" +
          p.id +
          "' nom='" +
          p.nom +
          "' qte='" +
          p.qte +
          "' class='buttonDeleteAll'>" +
          "</td><td>" +
          p.nom +
          "</td><td>" +
          "<input type='button' name='delete1'" +
          "id='" +
          p.id +
          "' nom='" +
          p.nom +
          "' qte='" +
          p.qte +
          "' value='-' class='buttonDelete'>" +
          "</td><td>" +
          p.qte +
          "</td><td>" +
          "<input type='button' name='add1'" +
          "id='" +
          p.id +
          "' nom='" +
          p.nom +
          "' qte='" +
          p.qte +
          "' value='+' class='buttonAdd'>" +
          "</td></tr>";
      }
      // insérer le HTML dans la liste <ul></ul> du fichier index.html
      document.getElementById("tableau").innerHTML = resHTML;

      let buttonsPlus = document.getElementsByName("add1");
      for (let b of buttonsPlus) {
        b.addEventListener("click", addOne);
      }

      let buttonsMinus = document.getElementsByName("delete1");
      for (let b of buttonsMinus) {
        b.addEventListener("click", deleteOne);
      }

      let buttonsDeleteAll = document.getElementsByName("deleteAll");
      for (let b of buttonsDeleteAll) {
        b.addEventListener("click", deleteProduit);
      }
    })

    .catch((error) => {
      // gestion des erreurs
      console.log(error);
    });
}
//-----------------------------------------------------------------
//-----------------------------------------------------------------
//----------------------- SUPRESSION ------------------------------
//-----------------------------------------------------------------
//-----------------------------------------------------------------

//--------------------------------------------------
//-------- Supprimer un Produit Totalement ---------
//--------------------------------------------------

async function deleteProduit(event) {
  let id = event.target.id;
  deleteUrl(id);
}

//fonction qui supprime l'url d'un produit d'après son id
function deleteUrl(id) {
  let urlToDelete = url + "/" + id;
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const fetchOptions = {
    method: "DELETE",
    headers: myHeaders
  };
  fetch(urlToDelete, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((dataJSON) => {
      listeProduits();
    })
    .catch((error) => {
      console.log(error);
    });
}

//-----------------------------------------------
//-------------Modifier un produit-(supprimer 1)---
//-----------------------------------------------

function deleteOne(event) {
  let id = event.target.id;
  let nom = event.target.attributes.nom.value;
  let qte = Number.parseInt(event.target.attributes.qte.value, 10);
  let produit = { id, nom, qte };

  if (produit.qte == 1) {
    deleteUrl(id);
  } else {
    qte = qte - 1;
    produit = { id, nom, qte };
  }

  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  let fetchOptions = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(produit)
  };
  fetch(url, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((dataJSON) => {
      listeProduits();
    })
    .catch((error) => {
      console.log(error);
    });
}
