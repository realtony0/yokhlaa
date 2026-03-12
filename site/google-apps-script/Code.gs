/**
 * Google Apps Script — Yokh Laa Inscriptions
 *
 * INSTALLATION :
 * 1. Va sur https://script.google.com → Nouveau projet
 * 2. Copie-colle tout ce fichier dans l'éditeur (remplace le contenu par défaut)
 * 3. Clique sur « Exécuter » → « initialiser » pour créer le Google Sheet automatiquement
 * 4. Autorise les permissions demandées
 * 5. Clique sur « Déployer » → « Nouveau déploiement »
 *    - Type : « Application Web »
 *    - Exécuter en tant que : « Moi »
 *    - Accès : « Tout le monde »
 * 6. Copie l'URL générée
 * 7. Colle cette URL dans site/index.html à la ligne :
 *      const SHEET_URL = 'https://script.google.com/macros/s/XXXXXX/exec';
 * 8. Redéploie le site sur Vercel
 */

/* ID du Google Sheet — sera rempli automatiquement par initialiser() */
const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');

/**
 * Crée le Google Sheet avec les bonnes colonnes
 * Exécuter cette fonction UNE SEULE FOIS lors de l'installation
 */
function initialiser() {
  const ss = SpreadsheetApp.create('Yokh Laa — Inscriptions');
  const sheet = ss.getActiveSheet();
  sheet.setName('Inscriptions');

  // En-têtes
  const headers = ['Date', 'Rôle', 'Nom', 'WhatsApp', 'Zone', 'Véhicule', 'Autocollant'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Style en-têtes
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#22C55E');
  headerRange.setFontColor('#FFFFFF');

  // Largeur colonnes
  sheet.setColumnWidth(1, 160); // Date
  sheet.setColumnWidth(2, 100); // Rôle
  sheet.setColumnWidth(3, 200); // Nom
  sheet.setColumnWidth(4, 160); // WhatsApp
  sheet.setColumnWidth(5, 160); // Zone
  sheet.setColumnWidth(6, 180); // Véhicule
  sheet.setColumnWidth(7, 120); // Autocollant

  // Fige la première ligne
  sheet.setFrozenRows(1);

  // Sauvegarde l'ID du Sheet
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());

  Logger.log('Google Sheet créé : ' + ss.getUrl());
  Logger.log('ID : ' + ss.getId());
}

/**
 * Reçoit les données POST du formulaire
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Inscriptions');

    // Ajoute la ligne
    sheet.appendRow([
      data.date || new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Dakar' }),
      data.role || '',
      data.nom || '',
      data.whatsapp || '',
      data.zone || '',
      data.vehicule || '',
      data.flyer || 'Non'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', count: sheet.getLastRow() - 1 }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Retourne le nombre d'inscrits (GET)
 */
function doGet() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Inscriptions');
    const count = Math.max(0, sheet.getLastRow() - 1);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', count: count }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', count: 0 }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
