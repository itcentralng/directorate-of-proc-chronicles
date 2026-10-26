/* ============================================================
   DIRECTORATE OF PROCUREMENT — kiosk content
   All copy and the roll of directors live here, so the app can be
   updated without touching the markup or the app logic.
   ============================================================ */

var DP_CONTENT = {

  ui: {
    appTitle: 'Directorate of Procurement',
    appKicker: 'Office of the Chief of Army Staff',
    appSubtitle: 'A Chronicle of Directors',
    army: 'Nigerian Army',
    touchToBegin: 'Touch to begin',

    menuBrief: 'The Directorate',
    menuBriefSub: 'Mandate, role and history',
    menuChronicle: 'Chronicle of Directors',
    menuChronicleSub: 'Every director, in order of succession',
    menuDirector: 'The Director',
    menuDirectorSub: 'The current Director of Procurement',

    briefTitle: 'The Directorate of Procurement',
    chronicleTitle: 'Chronicle of Directors',
    directorTitle: 'Director of Procurement',

    incumbent: 'Incumbent',
    acting: 'Acting',
    present: 'Present',
    directorNo: 'Director',
    of: 'of',
    serviceNo: 'Service No.',
    appointment: 'Appointment',
    tenure: 'Tenure',
    duration: 'Duration',
    inOffice: 'In office',
    assumed: 'Assumed appointment',
    precededBy: 'Preceded by',
    succeededBy: 'Succeeded by',
    viewChronicle: 'View the full chronicle',
    succession: 'Line of succession',
    tapPortrait: 'Tap a portrait to learn more',
    back: 'Back',
    idleReturnNote: 'Returning to the welcome screen…'
  },

  /* ----------------------------------------------------------
     BRIEF ON THE DIRECTORATE
     DRAFT — replace these paragraphs with the approved text from
     "BRIEF ON THE DIRECTORATE OF PROCUREMENT.docx". One string
     per page; each page is shown on its own on the kiosk.
     ---------------------------------------------------------- */
  brief: [
    {
      heading: 'Who We Are',
      text: 'The Directorate of Procurement is a directorate of the Office of the Chief of Army Staff, Army Headquarters, Abuja. It is the Nigerian Army’s focal point for procurement, charged with sourcing the equipment, stores, works and services the Army needs to train, fight and sustain itself.'
    },
    {
      heading: 'Our Mandate',
      text: 'The Directorate plans and manages the Army’s procurement activities in line with the Public Procurement Act and extant Armed Forces regulations, ensuring that every requirement is met with transparency, value for money and timeliness.'
    },
    {
      heading: 'Our Role',
      text: 'Working closely with the Corps, Directorates and Formations of the Nigerian Army, the Directorate translates operational requirements into contracts, supervises their execution and safeguards the quality of what is delivered to troops in the field.'
    },
    {
      heading: 'Our Legacy',
      text: 'Since its establishment, the Directorate has been led by a succession of distinguished officers whose stewardship is recorded in this chronicle. Each has built on the work of those before, strengthening the systems that keep the Nigerian Army equipped and ready.'
    }
  ],

  /* ----------------------------------------------------------
     ROLL OF DIRECTORS — oldest first.
     Dates are ISO (YYYY-MM-DD); "to: null" marks the incumbent.
     "acting: true" renders the appointment as Acting Director.
     Source: the captions printed on each portrait in /directors.
     ---------------------------------------------------------- */
  directors: [
    {
      id: 'oo-olatunde', rank: 'Brigadier General', rankShort: 'Brig Gen',
      name: 'OO Olatunde', serviceNo: 'N/8646', acting: true,
      from: '2015-07-30', to: '2016-01-06',
      photo: 'assets/portraits/brig-gen-oo-olatunde.jpg'
    },
    {
      id: 'ef-edafioghor', rank: 'Brigadier General', rankShort: 'Brig Gen',
      name: 'EF Edafioghor', serviceNo: 'N/9350', acting: false,
      from: '2016-01-06', to: '2018-03-22',
      photo: 'assets/portraits/brig-gen-ef-edafioghor.jpg'
    },
    {
      id: 'et-essien', rank: 'Brigadier General', rankShort: 'Brig Gen',
      name: 'ET Essien', serviceNo: 'N/9340', acting: true,
      from: '2018-03-22', to: '2019-12-29',
      photo: 'assets/portraits/brig-gen-et-essien.jpg'
    },
    {
      id: 'm-danmadami', rank: 'Brigadier General', rankShort: 'Brig Gen',
      name: 'M Danmadami', serviceNo: 'N/9204', acting: true,
      from: '2019-12-29', to: '2020-09-08',
      photo: 'assets/portraits/brig-gen-m-danmadami.jpg'
    },
    {
      id: 'aj-aliyu', rank: 'Brigadier General', rankShort: 'Brig Gen',
      name: 'AJ Aliyu', serviceNo: 'N/10031', acting: true,
      from: '2020-09-08', to: '2021-03-10',
      photo: 'assets/portraits/brig-gen-aj-aliyu.jpg'
    },
    {
      id: 'ko-ukandu', rank: 'Brigadier General', rankShort: 'Brig Gen',
      name: 'KO Ukandu', serviceNo: 'N/10149', acting: true,
      from: '2021-03-10', to: '2021-06-16',
      photo: 'assets/portraits/brig-gen-ko-ukandu.jpg'
    },
    {
      id: 'nu-muktar', rank: 'Major General', rankShort: 'Maj Gen',
      name: 'NU Muktar', serviceNo: 'N/8703', acting: false,
      from: '2021-06-16', to: '2022-12-19',
      photo: 'assets/portraits/maj-gen-nu-muktar.jpg'
    },
    {
      id: 'ag-ibrahim', rank: 'Major General', rankShort: 'Maj Gen',
      name: 'AG Ibrahim', serviceNo: 'N/9918', acting: false,
      from: '2022-12-19', to: '2023-06-03',
      photo: 'assets/portraits/maj-gen-ag-ibrahim.jpg'
    },
    {
      id: 'aa-adereti', rank: 'Major General', rankShort: 'Maj Gen',
      name: 'AA Adereti', serviceNo: 'N/10004', acting: false,
      from: '2023-07-03', to: '2025-04-25',
      photo: 'assets/portraits/maj-gen-aa-adereti.jpg'
    },
    {
      id: 'ut-otaru', rank: 'Major General', rankShort: 'Maj Gen',
      name: 'UT Otaru', serviceNo: 'N/9731', acting: false,
      from: '2025-04-25', to: '2025-10-30',
      photo: 'assets/portraits/maj-gen-ut-otaru.jpg'
    },
    {
      id: 'sy-yakasai', rank: 'Major General', rankShort: 'Maj Gen',
      name: 'SY Yakasai', serviceNo: '', acting: false,
      postNominals: 'FSS MSS DSS FCM CM psc(+) fwc(+) nswc NAOTC MSc MA AMNIM',
      from: '2025-10-30', to: null,
      photo: 'assets/portraits/maj-gen-sy-yakasai.jpg'
    }
  ]
};
