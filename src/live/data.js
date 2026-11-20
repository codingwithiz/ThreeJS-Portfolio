/* Sample inputs for the machines. Where a line comes from a real alert or a repo test it says so. */
export const SMS = 'com.google.android.apps.messaging', MAE = 'com.maybank2u.life', TNG = 'my.com.tngdigital.ewallet', WA = 'com.whatsapp';
export const D = {
  iz: {
    apps: { [SMS]: 'SMS', [MAE]: 'MAE app', [TNG]: "Touch 'n Go eWallet", [WA]: 'WhatsApp' },
    // src: 'real' = format from a real alert in RealSamplesTest.java (card number / payee changed), 'test' = from the unit tests, 'demo' = written for this page
    queue: [
      { pkg: SMS, sender: '62003', src: 'real', text: 'RM0 BANKRAKYAT:A TXN WAS MADE USING YOUR DEBIT CARD 1234 ON 24/06/2026 FOR RM 18.00 AT  McDonalds 1010004     Petaling Jaya MYS . CALL B.RAKYAT CARD CENTRE FOR INQ .' },
      { pkg: WA, sender: 'Ali', src: 'test', text: 'I transferred RM50 to you just now' },
      { pkg: MAE, sender: 'MAE', src: 'real', text: "MAE — you've been charged RM10 at KFC SUNWAY PYRAMID" },
      { pkg: SMS, sender: '66300', src: 'test', text: 'RM0 Maybank: Your TAC for transfer of RM500.00 to ALI is 123456' },
      { pkg: TNG, sender: "Touch 'n Go eWallet", src: 'real', text: "Touch 'n Go eWallet — Payment of RM6.50 to ZUS COFFEE was successful" },
      { pkg: SMS, sender: '+60123456789', src: 'test', text: 'Paid RM20 for the movie tickets' },
      { pkg: SMS, sender: '66555', src: 'test', text: 'RM0.00 HLB: card 4111 1111 1111 1111 charged RM12.00 at 99 SPEEDMART' },
      { pkg: SMS, sender: '62226', src: 'demo', text: 'RM0 CIMB: Pay with your card and win RM500 cashback. Promo ends 30/11.' },
      { pkg: MAE, sender: 'MAE', src: 'demo', text: 'MAE — Transfer of RM80.00 to STASHAWAY MALAYSIA was successful' },
      { pkg: SMS, sender: '62226', src: 'real', text: 'RM0.00 CIMB MYR80.85 was charged to your card num ***1234 at paypal YYY on 08/01,' },
    ],
    senders: [
      { label: 'Bank SMS (short code)', pkg: SMS, sender: '66300' },
      { label: 'MAE app', pkg: MAE, sender: 'MAE' },
      { label: "Touch 'n Go eWallet", pkg: TNG, sender: "Touch 'n Go eWallet" },
      { label: 'WhatsApp chat', pkg: WA, sender: 'A friend' },
      { label: 'SMS from a phone number', pkg: SMS, sender: '+60123456789' },
    ],
    budget: { Needs: 100, Wants: 50, Invest: 100 },   // sample week of RM250 split 40 / 20 / 40
  },
  crux: {
    source: 'A good pipeline is boring on purpose. Each step does one small job, says what it did, and stops when something looks wrong. People trust a system they can interrupt. The fastest way to lose that trust is to let a machine put words in someone’s mouth — so every quote has to be found in the source, word for word, before it is allowed on the page.',
    quotes: ['People trust a system they can interrupt.', '“EACH STEP   does one small job”', 'Machines should never be trusted with quotes.'],
    flow: ['Input', 'Synthesize + check quotes', 'Read', 'Coach or Spar', 'Commit', 'Express', 'Studio', 'PNG · ZIP · PDF'],
  },
  bina: {
    defaults: { visit_step: '0', gest_age: '20', photo_path: '' },
    labels: {
      ms: { visit_title: 'Lawatan Pesakit', visit_step1: 'Ambil sejarah perubatan', visit_step2: 'Ukur tanda vital (BP, berat)', visit_step3: 'Ukur tinggi fundus', visit_step4: 'Periksa degupan jantung janin', visit_step5: 'Ujian urin (protein, glukosa)', visit_step6: 'Kaunseling & temujanji seterusnya', visit_next: 'Langkah Seterusnya', visit_summary: 'Jana Ringkasan Lawatan' },
      en: { visit_title: 'Patient Visit', visit_step1: 'Take medical history', visit_step2: 'Measure vitals (BP, weight)', visit_step3: 'Measure fundal height', visit_step4: 'Check fetal heartbeat', visit_step5: 'Urine test (protein, glucose)', visit_step6: 'Counselling & next appointment', visit_next: 'Next Step', visit_summary: 'Generate Visit Summary' },
    },
    ask: 'Generate a concise antenatal visit summary for medical records. Patient completed all 6 checkpoints: medical history taken, vitals measured, fundal height measured, fetal heart checked, urine tested, counselling done. Gestational age: {{gest_age}} weeks. Format as a clinical note with date, findings summary, and next visit recommendation.',
    visibleIf: 'visit_step >= 6',
    // the real screen from bidan_pintar.yaml; w = which widget the line belongs to, cut = a line added here to mark removed lines
    yaml: [
      ['  - id: patient_visit', -1], ['    title: "{{l10n.visit_title}}"', -1], ['    body:', -1],
      ['      - text_label:', 0], ['          text: "{{l10n.visit_title}}"', 0], ['          style: subheading', 0],
      ['      - camera_input:', 1], ['          bind: photo_path', 1],
      ['      - checklist_items:', 2], ['          bind: visit_step', 2], ['          items:', 2], ['            - label: "{{l10n.visit_step1}}"', 2], ['              type: text', 2], ['            ✂ five more items, visit_step2 to visit_step6', 2, 'cut'],
      ['      - progress_bar:', 3], ['          bind: visit_step', 3], ['          total: 6', 3],
      ['      - action_button:', 4], ['          label: "{{l10n.visit_next}}"', 4], ['          action: "increment:visit_step"', 4], ['          style: primary', 4],
      ['      - action_button:', 5], ['          label: "{{l10n.visit_summary}}"', 5], ['          action: "ask:Generate a concise antenatal visit summary …"', 5], ['          style: secondary', 5], ['          visible_if: "visit_step >= 6"', 5, 'vis'],
      ['      - markdown_output:', 6], ['          source: ai_response', 6], ['          streaming: true', 6],
    ],
    widgets: ['text_label', 'camera_input', 'checklist_items', 'progress_bar', 'action_button', 'action_button', 'markdown_output'],
  },
  niaga: {
    labels: { demand: 'Demand', competition: 'Competition', accessibility: 'Accessibility', zoning: 'Zoning', risk: 'Risk' },
    hints: { demand: 'Population density & target demographics', competition: 'Density of similar businesses', accessibility: 'Roads, transport & connectivity', zoning: 'Legal & regulatory compliance', risk: 'Environmental & disaster vulnerability' },
    colors: { demand: '#FFD23F', competition: '#FF6B3D', accessibility: '#8EE3F5', zoning: '#3DDC97', risk: '#F7A8D8' },
    // real example inputs from the app; the chips are preset here (GPT-4o extracts them in the real app)
    asks: [
      { text: 'Find me a good spot for coffee near my house, something in the middle class area', category: 'fnb', radius: '1 km', seed: 3,
        chips: [['coffee', 'Category · Food & drink'], ['near my house', 'Centre · my location'], ['middle class area', 'Audience · middle income']] },
      { text: 'kami nak buka restoran, mana paling bagus? radius 5km dari universiti', category: 'fnb', radius: '5 km', seed: 11,
        chips: [['restoran', 'Category · Food & drink'], ['radius 5km', 'Radius · 5 km'], ['dari universiti', 'Centre · the university']] },
      { text: 'workshop dekat petronas, dekat jalan besar', category: 'automotive', radius: '1 km', seed: 23,
        chips: [['workshop', 'Category · Automotive'], ['dekat petronas', 'Centre · Petronas station'], ['dekat jalan besar', 'Wants · main road access']] },
    ],
    catNames: { retail: 'Retail', fnb: 'Food & drink', health: 'Health', automotive: 'Automotive', sports: 'Sports' },
  },
  akar: {
    tools: [
      ['get_financial_context', 'wallet and vault balances'],
      ['check_compliance', 'AML check'],
      ['get_shariah_routing', 'where savings may go'],
      ['check_loan_status', 'open loan?'],
      ['execute_allocation', 'move the money'],
      ['format_notification', 'tell the user, under 50 words'],
    ],
    tiers: [[300, 'Tier 1', 'Micro-Relief', 'RM100–RM300'], [500, 'Tier 2', 'Sustenance', 'RM500–RM1,000'], [700, 'Tier 3', 'Capital Bridge', 'RM2,500+']],
    month: { txCount: 24, daysWithTx: 22, vaultContributions: 6, loanRepayments: 3, flagged: 0 },   // sample month
  },
  maxis: {
    // made-up document. The real documents, prompts and field names are not shown.
    fields: [['Customer name', 'Sample Customer A'], ['Reference no.', 'REF-000123'], ['Address', '12 Jalan Contoh, 50000 KL'], ['Service', 'Plan X']],
    crm: { clean: {}, smudge: {}, mismatch: { Address: '21 Jalan Contoh, 50000 KL' } },
    stations: [['Convert', 'scan to text'], ['Classify', 'what is it?'], ['Validate', 'is it usable?'], ['Extract', 'pull the fields'], ['Compare', 'against the record'], ['CRM', 'update']],
    checks: ['All pages present', 'Text readable', 'Signed'],
    types: ['Type A', 'Type B', 'Type C'],
  },
  flood: { steps: 36, warm: 10, scores: [[0.3275, 'first run', 'rainfall column bug'], [0.2689, '', ''], [0.0830, '', ''], [0.0157, 'final', '2nd of 264']], first: 0.0120 },
};
