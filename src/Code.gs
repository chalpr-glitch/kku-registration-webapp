/**
 * KKU Academic Services Registration WebApp Backend
 * Target Spreadsheet ID: 1knEtSncFxFQ39qCt-A6FC9dm5fzqBoDimD7Fr6fIe0A
 * Target Sheet (Personnel Directory): UserTable (GID: 1210317311)
 */

const SPREADSHEET_ID = '1knEtSncFxFQ39qCt-A6FC9dm5fzqBoDimD7Fr6fIe0A';
const PERSONNEL_SHEET_GID = '1210317311';
const LOG_SHEET_NAME = 'AttendanceLogs';

/**
 * Serve the main web application UI
 */
function doGet() {
  const htmlOutput = HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('ลงทะเบียนเข้าร่วมกิจกรรม - สำนักบริการวิชาการ มข.')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, shrink-to-fit=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return htmlOutput;
}

/**
 * Get sheet by GID
 */
function getSheetByGid(ss, gid) {
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId().toString() === gid.toString()) {
      return sheets[i];
    }
  }
  return null;
}

/**
 * Fetch the active spreadsheet instance
 */
function getSpreadsheet() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Get all personnel from the UserTable sheet
 * @returns {Array<Object>} List of personnel
 */
function getPersonnelList() {
  try {
    const ss = getSpreadsheet();
    let sheet = getSheetByGid(ss, PERSONNEL_SHEET_GID);
    if (!sheet) {
      sheet = ss.getSheetByName('UserTable') || ss.getSheets()[0];
    }

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];

    const headers = data[0];
    const personnel = [];

    // Header indices
    const uidIdx = headers.indexOf('UID');
    const emailIdx = headers.indexOf('Email');
    const nameIdx = headers.indexOf('ชื่อ-นามสกุล');
    const posIdx = headers.indexOf('ตำแหน่ง');
    const adminPosIdx = headers.indexOf('ตำแหน่งทางการบริหาร');
    const affiliationIdx = headers.indexOf('สังกัด');
    const deptIdx = headers.indexOf('หน่วยงาน');
    const statusIdx = headers.indexOf('สถานะ');

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[uidIdx]) continue; // Skip empty rows

      personnel.push({
        uid: row[uidIdx] ? row[uidIdx].toString().trim() : '',
        email: emailIdx !== -1 && row[emailIdx] ? row[emailIdx].toString().trim() : '',
        name: nameIdx !== -1 && row[nameIdx] ? row[nameIdx].toString().trim() : '',
        position: posIdx !== -1 && row[posIdx] ? row[posIdx].toString().trim() : '',
        adminPosition: adminPosIdx !== -1 && row[adminPosIdx] ? row[adminPosIdx].toString().trim() : '',
        affiliation: affiliationIdx !== -1 && row[affiliationIdx] ? row[affiliationIdx].toString().trim() : '',
        department: deptIdx !== -1 && row[deptIdx] ? row[deptIdx].toString().trim() : '',
        status: statusIdx !== -1 && row[statusIdx] ? row[statusIdx].toString().trim() : ''
      });
    }

    return { success: true, data: personnel };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Fetch list of registered personnel (UIDs) from AttendanceLogs
 * @returns {Array<string>} Registered UIDs
 */
function getRegisteredList() {
  try {
    const ss = getSpreadsheet();
    let logSheet = ss.getSheetByName(LOG_SHEET_NAME);
    if (!logSheet) {
      return { success: true, data: [] };
    }

    const data = logSheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, data: [] };

    const uidIdx = data[0].indexOf('UID');
    const registeredUids = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[uidIdx]) {
        registeredUids.push(row[uidIdx].toString().trim());
      }
    }

    return { success: true, data: registeredUids };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Submit user registration
 * @param {string} uid User ID
 * @param {Object} regData Registration payload (foodPreference, note)
 * @returns {Object} Result of registration
 */
function submitRegistration(uid, regData) {
  try {
    const ss = getSpreadsheet();
    
    // 1. Get user details from directory
    const personnelResult = getPersonnelList();
    if (!personnelResult.success) {
      throw new Error('ไม่สามารถดึงข้อมูลบุคลากรได้: ' + personnelResult.error);
    }
    
    const user = personnelResult.data.find(p => p.uid === uid);
    if (!user) {
      throw new Error('ไม่พบข้อมูลบุคลากรด้วยรหัส UID: ' + uid);
    }

    // 2. Ensure log sheet exists
    let logSheet = ss.getSheetByName(LOG_SHEET_NAME);
    if (!logSheet) {
      logSheet = ss.insertSheet(LOG_SHEET_NAME);
      logSheet.appendRow([
        'Timestamp',
        'UID',
        'Email',
        'ชื่อ-นามสกุล',
        'ตำแหน่ง',
        'สังกัด',
        'หน่วยงาน'
      ]);
      // Format header
      logSheet.getRange(1, 1, 1, 7)
        .setFontWeight('bold')
        .setBackground('#E0F2FE')
        .setHorizontalAlignment('center');
    }

    // 3. Check for existing registration
    const data = logSheet.getDataRange().getValues();
    const uidIdx = data[0].indexOf('UID');
    let existingRowIndex = -1;

    for (let i = 1; i < data.length; i++) {
      if (data[i][uidIdx] && data[i][uidIdx].toString().trim() === uid) {
        existingRowIndex = i + 1; // 1-indexed for sheets row
        break;
      }
    }

    const timestamp = new Date();
    const rowValues = [
      timestamp,
      user.uid,
      user.email,
      user.name,
      user.position,
      user.affiliation,
      user.department
    ];

    if (existingRowIndex !== -1) {
      // Update existing record
      logSheet.getRange(existingRowIndex, 1, 1, 7).setValues([rowValues]);
    } else {
      // Append new record
      logSheet.appendRow(rowValues);
    }

    return {
      success: true,
      data: {
        uid: user.uid,
        name: user.name,
        timestamp: timestamp.toLocaleString('th-TH')
      }
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Fetch detailed registration logs for dashboard view
 * @returns {Array<Object>} List of registration detail logs
 */
function getRegisteredListDetails() {
  try {
    const ss = getSpreadsheet();
    let logSheet = ss.getSheetByName(LOG_SHEET_NAME);
    if (!logSheet) {
      return { success: true, data: [] };
    }

    const data = logSheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, data: [] };

    const headers = data[0];
    const uidIdx = headers.indexOf('UID');
    const timestampIdx = headers.indexOf('Timestamp');

    const logs = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[uidIdx]) {
        logs.push({
          uid: row[uidIdx].toString().trim(),
          timestamp: row[timestampIdx] ? new Date(row[timestampIdx]).toLocaleString('th-TH') : ''
        });
      }
    }

    return { success: true, data: logs };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Check if the provided email has admin rights
 * @param {string} email User email to verify
 * @returns {Object} Result showing if user is admin
 */
function checkAdminPermission(email) {
  try {
    if (!email) return { success: true, isAdmin: false };
    const trimmedEmail = email.toLowerCase().trim();
    
    // Strict check: ONLY chalpr@kku.ac.th per user request
    if (trimmedEmail === 'chalpr@kku.ac.th') {
      return { success: true, isAdmin: true };
    }
    return { success: true, isAdmin: false };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Admin action to edit / update or delete user registration details
 * @param {string} uid User ID
 * @param {string} regStatus Selected registration status ('registered' or 'pending')
 * @returns {Object} Update result
 */
function adminUpdateRegistration(uid, regStatus) {
  try {
    const ss = getSpreadsheet();
    let logSheet = ss.getSheetByName(LOG_SHEET_NAME);
    
    if (regStatus === 'pending') {
      // Unregister: delete row from AttendanceLogs
      if (logSheet) {
        const data = logSheet.getDataRange().getValues();
        const uidIdx = data[0].indexOf('UID');
        let rowIndexToDelete = -1;
        for (let i = 1; i < data.length; i++) {
          if (data[i][uidIdx] && data[i][uidIdx].toString().trim() === uid) {
            rowIndexToDelete = i + 1;
            break;
          }
        }
        if (rowIndexToDelete !== -1) {
          logSheet.deleteRow(rowIndexToDelete);
        }
      }
    } else {
      // Register or update: reuse existing submitRegistration logic
      const result = submitRegistration(uid, {});
      if (!result.success) throw new Error(result.error);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
