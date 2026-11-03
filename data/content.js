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
    menuBriefSub: 'Who we are and our responsibilities',
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
    readBiography: 'Read biography',
    biography: 'Biography',
    succession: 'Line of succession',
    tapPortrait: 'Tap a portrait to learn more',
    back: 'Back',
    idleReturnNote: 'Returning to the welcome screen…'
  },

  /* ----------------------------------------------------------
     BRIEF ON THE DIRECTORATE
     Source: "BRIEF ON THE DIRECTORATE OF PROCUREMENT.docx" — one
     page per section of the brief. The wording is the brief's own;
     the structure diagram on page one is drawn from its paragraph.
     ---------------------------------------------------------- */
  briefFacts: [
    { label: 'Established', value: '6 August 2015' },
    { label: 'Under', value: 'Public Procurement Act 2007' }
  ],
  brief: [
    {
      heading: 'Who We Are',
      paragraphs: [
        'The Directorate of Procurement (Army) was established on 6 Aug 15 in accordance with the provisions of the Public Procurement Act (PPA) 2007. It operates under the auspices of the Office of the COAS in liaison with AHQ DAPP and AHQ DOAL. The Directorate also serves as the Secretariat for the NA Procurement Planning Committee (PPC) and takes an active part in the preparation and implementation of the NA Budget.',
        'Principally, the Directorate is headed by the Director of Procurement (D Proc) and organized into 3 main cells and 3 supporting cells namely: Hard Procurement, Soft Procurement and Army Tenders Board/Works & Services cells all headed by Deputy Directors (DDs). The supporting cells include; Finance, Legal and Compliance cells overseen by Assistant Directors (ADs).'
      ],
      structure: {
        head: 'Director of Procurement',
        headShort: 'D Proc',
        groups: [
          { label: 'Main Cells', note: 'Headed by Deputy Directors', cells: ['Hard Procurement', 'Soft Procurement', 'Army Tenders Board / Works & Services'] },
          { label: 'Supporting Cells', note: 'Overseen by Assistant Directors', cells: ['Finance', 'Legal', 'Compliance'] }
        ]
      }
    },
    {
      heading: 'Our Responsibilities',
      paragraphs: [
        'The Directorate of Procurement is saddled with the responsibility of administering and handling all procurement activities for the NA. The Directorate also enforces procedures/requirements for award, evaluation, monitoring and termination of contracts approved by the PPC. The core responsibilities of the Directorate as dictated by its establishment order are as follows:'
      ],
      items: [
        'Act as Secretariat of the NA PPC with the D Proc as the Secretary.',
        'Offer sound advice to the COAS on all procurement matters involving the NA.',
        'Formulate policy guidelines and coordinate action on all procurement matters in liaison with AHQ DAPP, AHQ DOAL and HQ NAFC.',
        'Handles all NA procurement activities in liaison with the benefitting entity. This is important to justify the needs assessment.',
        'Determine the lots of various jobs, their descriptions, cost and specifications and Bill of Quantity (BOQ).',
        'Furnish the COAS with details of capital projects, procurement plans for each year and procurement reports.',
        'Liaise with DHQ, MOD and any other entity on NA procurement matters.',
        'Opening and managing of NA Procurement Portal, when established.',
        'Register intending contractors with the NA.',
        'Coordinate all pre-shipment inspections in close liaison with AHQ DAPP and DOAL.',
        'Any other function as may be directed by the COAS.'
      ]
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
      photo: 'assets/portraits/maj-gen-sy-yakasai.jpg',
      /* Source: "MAJ GEN SY YAKASAI CV.docx" — wording is the CV's own. */
      bio: {
        fullName: 'Sadisu Yahaya Yakasai',
        facts: [
          { label: 'Born', value: '26 June 1974' },
          { label: 'Hometown', value: 'Kano Municipal, Kano State' },
          { label: 'Commissioned', value: '1997 · 44 Regular Course' },
          { label: 'Corps', value: 'Nigerian Army Infantry Corps' }
        ],
        sections: [
          {
            title: 'Profile',
            paragraphs: [
              'Major General SADISU YAHAYA YAKASAI was born on 26 June 1974 in Kano Municipal Local Government Area of Kano State. He is a recipient of the Forces Service Star, Meritorious Service Star, Distinguished Service Star, Command Medal, Pass Staff Course +, Fellow War College +, National Security and War Course, Master of Science, Master of Arts, Associate Member National Institute of Management.',
              'He was admitted into the Nigerian Defence Academy Kaduna in 1992 as a member of 44 Regular Course where he bagged a Bachelor Degree in Mechanical Engineering and was commissioned into the Nigerian Army as a Second Lieutenant in 1997. He is of the Nigerian Army Infantry Corps.'
            ],
            aside: { label: 'Hobbies', text: 'His hobbies include reading, watching football and playing snooker.' }
          },
          {
            title: 'Appointments',
            layout: 'career',
            intro: 'The Director has held various commands and appointments in different units, formations and establishments in the Nigerian Army. Some of which include;',
            items: [
              'Platoon Comd at 195 Bn at NIBATT & UNAMSIC.',
              'ADC to Hon Minister of Defence.',
              'Staff Officer Grade II at Nigerian Defence College.',
              'Commanding Officer at AHQ Trg Team Cadet Bn.',
              'Commanding Officer 2 Bn.',
              'ADC to Chief of Army Staff.',
              'Senior Instructor Tactics Wing at Nigerian Army School of Infantry.',
              'Directing Staff at Armed Forces Command and Staff College, Jaji.',
              'Deputy Director Logistics AHQ Operations Monitoring Team.',
              'Military Assistant to the Hon Minister of Interior.',
              'Deputy Director Training and Exercise Analysis at the Dept of Army Transformation and Innovation.',
              'Directing Staff at the prestigious Army War College of Nigeria.',
              'Chief of Staff, 7 Division/Sector 1 Joint Task Force Northeast Operation HADIN KAI.',
              'Comd 16 Bde NA and South South Sect 2 Op Delta Safe.',
              'Deputy Director Documentation at AHQ Department of Personnel Management.',
              'Executive Director Operations at Nigerian Army Welfare Limited by Guarantee (NAWLG).',
              { text: 'The Acting Director of Procurement at Army Headquarters Directorate of Procurement.', highlight: true },
              { text: 'Presently, the Director Procurement at Army Headquarters Directorate of Procurement.', highlight: true }
            ]
          },
          {
            title: 'Courses',
            layout: 'cards',
            intro: 'Major General SY Yakasai has attended several courses and seminars in his military career, notably among them include;',
            items: [
              'Young Officer’s Course Infantry.',
              'Mortar Platoon Commander’s Course.',
              'Armour Fighting Vehicle Course.',
              'Junior Staff Course.',
              'Company Commander’s Course.',
              'Senior Staff Course.',
              'Battalion Commander’s Course.',
              'Amphibious Staff Officers Course.',
              'Notably Security and War Course Pakistan.'
            ]
          },
          {
            title: 'Missions & Operations',
            layout: 'badges',
            intro: 'Major General Yakasai also participated in missions and operations within and outside the Country, some of which include;',
            items: [
              'UNITED NATIONS MISSION in Sierra Leone.',
              'Op HARMONY.',
              'Op SHARAN DAJI.',
              'Op HADIN KAI.',
              'Op DESERT SANITY.',
              'Op DELTA SAFE.'
            ]
          },
          {
            title: 'Honours & Medals',
            layout: 'cards',
            intro: 'Major General Yakasai has also bagged the following Medals and Honours to his credit, these include;',
            items: [
              'The United Nations Mission in Sierra Leone Medal.',
              'Command Medal.',
              'Associate Member Nigerian Institute of Management.',
              'Distinguished Fellow War College Dagger.',
              'Master of Art Degree on Conflict, Security and Development from Bradford University in United Kingdom.',
              'Master of Science Degree in National Security and War Studies from National Defence University Pakistan.'
            ]
          }
        ]
      }
    }
  ]
};
