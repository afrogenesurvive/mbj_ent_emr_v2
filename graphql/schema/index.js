

const { buildSchema } = require('graphql');

module.exports = buildSchema(`

  type Staff {
    _id: ID!
    password: String
    title: String
    name: String
    role: String
    username: String
    registrationNumber: String
    dob: String
    age: Int
    gender: String
    contact: Contact
    addresses: [Address]
    loggedIn: Boolean
    clientConnected: Boolean
    verification: Verification
    attendance: [StaffAttendance]
    leave: [StaffLeave]
    images: [Image]
    files: [File]
    notes: [String]
    reminders: [Reminder]
    activity: [Activity]
  }
  type StaffAttendance {
    date: String
    status: String
    description: String
  }
  type StaffLeave {
    type: String
    startDate: String
    endDate: String
    description: String
  }
  input StaffInput {
    password: String
    title: String
    name: String
    role: String
    username: String
    registrationNumber: String
    dob: String
    age: Int
    gender: String
    contactPhone: String
    contactPhone2: String
    conatctEmail: String
    addressNumber:
    addressStreet: String
    addressTown: String
    addressCity: String
    addressCountry: String
    addressPostalCode: String
    addressPrimary: Boolean
    loggedIn: Boolean
    clientConnected: Boolean
    verificationVerified: Boolean
    verificationType: String
    verificationCode: String
    attendanceDate: String
    attendanceStatus: String
    attendanceDescription: String
    leaveType: String
    leaveStartDate: String
    leaveEndDate: String
    leaveDescription: String
    imageName: String
    imageType: String
    imagePath: String
    fileName: String
    fileType: String
    filePath: String
    notes: String
    note: String
    activityDate: String
    activityRequest: String
  }

  type Patient {
    _id: ID!
    active: Boolean
    password: String
    title: String
    name: String
    role: String
    username: String
    registration: PatientRegistration
    dob: String
    age: String
    gender: String
    contact: Contact
    addresses: [Address]
    loggedIn: Boolean
    clientConnected: Boolean
    verification: Verification
    expiryDate: String
    referral: PatientRefferal
    attendingPhysician: String
    occupation: PatientOccupation
    insurance: PatientInsurance
    nextOfKin: [PatientNextOfKin]
    allergies: [PatientAllergies]
    medication: [PatientMedication]
    images: [Image]
    files: [File]
    notes: [String]
    tags: [String]
    visits: [Visit]
    reminders: [Reminder]
    activity: [Activity]
  }
  type PatientRegistration {
    date: String
    number: String
  }
  type PatientRefferal {
    date: String
    reason: String
    physician: PatientReferringPhysician
  }
  type PatientReferringPhysician {
    name: String
    email: String
    phone: String
  }
  type PatientOccupation {
    role: String
    employer: PatientOccupationEmployer
  }
  type PatientOccupationEmployer {
    name: String
    phone: String
    email: String
    address: String
  }
  type PatientInsurance {
    company: String
    policyNumber: String
    description: String
    expiryDate: String
    subscriber: PatientInsuranceSubscriber
  }
  type PatientInsuranceSubscriber {
    company: String
    description: String
  }
  type PatientNextOfKin {
    name: String
    relation: String
    contact: PatientNextOfKinContact
  }
  type PatientNextOfKinContact {
    email: String
    phone1: String
    phone2: String
  }
  type PatientAllergies {
    type: String
    title: String
    description: String
    attachments: [String]
  }
  type PatientMedication {
    type: String
    title: String
    description: String
    attachments: [String]
  }
  input PatientInput {
    active: Boolean
    password: String
    title: String
    name: String
    role: String
    username: String
    registrationDate: String
    registrationNumber: String
    dob: String
    age: Int
    gender: String
    conatctPhone: String
    conatctPhone2: String
    conatctEmail: String
    addressNumber: Int
    addressStreet: String
    addressTown: String
    addressCity: String
    addressCountry: String
    addressPostalCode: String
    addressPrimary: Boolean
    loggedIn: Boolean
    clientConnected: Boolean
    verificationVerified: Boolean
    verificationType: String
    verificationCode: String
    expiryDate: String
    referralDate: String
    referralReason: String
    referralPhysician: String
    referralPhysicianName: String
    referralPhysicianEmail: String
    referralPhysicianPhone: String
    attendingPhysician: String
    occupationRole: String
    occupationEmployerName: String
    occupationEmployerPhone: String
    occupationEmployerEmail: String
    occupationEmployerAddress: String
    insuranceCompany: String
    insurancePolicyNumber: String
    insuranceDescription: String
    insuranceExpiryDate: String
    insuranceSubscriber: String
    insuranceSubscriberCompany: String
    insuranceSubscriberDescription: String
    nextOfKinName: String
    nextOfKinRelation: String
    nextOfKinContactEmail: String
    nextOfKinContactPhone1: String
    nextOfKinContactPhone2: String
    allergyType: String
    allergyTitle: String
    allergyDescription: String
    allergyAttachment: String
    medicationTitle: String
    medicationType: String
    medicationDescription: String
    medicationAttachment: String
    imageName: String
    imageType: String
    imagePath: String
    fileName: String
    fileType: String
    filePath: String
    note: String
    notes: String
    tag: String
    tags: String
    activityDate: String
    activityRequest: String
  }

  type appointment {
    title: String
    type: String
    subType: String
    date: String
    time: String
    checkinTime: String
    seenTime: String
    location: String
    description: String
    visit: Visit
    patient: Patient
    consultant: Staff
    inProgress: Boolean
    attended: Boolean
    important: Boolean
    notes: [String]
    tags: [String]
  }

  input AppointmentInput {
    title: String
    type: String
    subType: String
    date: String
    time: String
    checkinTime: String
    seenTime: String
    location: String
    description: String
    inProgress: Boolean
    attended: Boolean
    important: Boolean
    note: String
    notes: String
    tag: String
    tags: String
  }

  type Visit {
    date: String
    time: String
    title: String
    type: String
    subType: String
    appointment: Appointment
    complaints: [VisitComplaint]
    surveys: [VisitSurvey]
    systematicInquiry: [VisitSystematicInquiry]
    vitals: [VisitVital]
    examination: [VisitExamination]
    investigation: [VisitInvestigation]
    diagnosis: [VisitDiagnosis]
    treatment: [VisitTreatment]
    billing: [VisitBilling]
    vigilance: [VisitVigilance]
    images: [Image]
    files: [File]
  }
  type VisitComplaint {
    title: String
    description: String
    anamnesis: String
    attachments: [String]
  }
  type VisitSurvey {
    title: String
    description: String
    attachments: [String]
  }
  type VisitSystematicInquiry {
    title: String
    description: String
    attachments: [String]
  }
  type VisitVital {
    pr: Float
    bp1: Float
    bp2: Float
    rr: Float
    temp: Float
    ps02: Float
    heightUnit: String
    heightValue: Float
    weightUnit: String
    weightValue: Float
    bmi: Float
    urine: VitalsUrine
  }
  type VitalsUrine {
    type: String
    value: String
  }
  type VisitExamination {
    general: String
    area: String
    type: String
    measure: String
    value: String
    description: String
    followUp: Boolean
    attachments: [String]
  }
  type VisitInvestigation {
    type: String
    title: String
    description: String
    attachments: [String]
  }
  type VisitDiagnosis {
    type: String
    title: String
    description: String
    attachments: [String]
  }
  type VisitTreatment {
    type: String
    title: String
    description: String
    dose: String
    frequency: String
    attachments: [String]
  }
  type VisitBilling {
    type: String
    title: String
    description: String
    amount: Float
    paid: Boolean
    attachments: [String]
    notes: [String]
  }
  type VisitVigilance {
    chronicIllness: VisitVigilanceChronicIllness
    lifestyle: VisitVigilanceLifestyle
    screening: VisitVigilanceScreening
    vaccines: VisitVigilanceVaccines
  }
  type VisitVigilanceChronicIllness {
    diabetes: VisitVigilanceSubObjectA
    hbp: VisitVigilanceSubObjectA
    dyslipidemia: VisitVigilanceSubObjectA
    cad: VisitVigilanceSubObjectA
  }
  type VisitVigilanceLifestyle {
    weight: VisitVigilanceSubObjectA
    diet: VisitVigilanceSubObjectA
    smoking: VisitVigilanceSubObjectA
    substanceAbuse: VisitVigilanceSubObjectA
    exercise: VisitVigilanceSubObjectA
    allergies: VisitVigilanceSubObjectA
    asthma: VisitVigilanceSubObjectA
  }
  type VisitVigilanceScreening {
    breast: VisitVigilanceSubObjectA
    prostate: VisitVigilanceSubObjectA
    cervix: VisitVigilanceSubObjectA
    colon: VisitVigilanceSubObjectA
    dental: VisitVigilanceSubObjectA
  }
  type VisitVigilanceVaccines {
    influenza: VisitVigilanceSubObjectA
    varicella: VisitVigilanceSubObjectA
    hpv: VisitVigilanceSubObjectA
    mmr: VisitVigilanceSubObjectA
    tetanus: VisitVigilanceSubObjectA
    pneumovax: VisitVigilanceSubObjectA
    other: VisitVigilanceSubObjectB
  }
  type VisitVigilanceSubObjectA {
    medication: Boolean
    testing: Boolean
    comment: String
  }
  type VisitVigilanceSubObjectB {
    name: String
    medication: Boolean
    testing: Boolean
    comment: String
  }
  input VisitInput {
    date: String
    time: String
    title: String
    type: String
    subType: String
    complaintTitle: String
    complaintDescription: String
    complaintAnamnesis: String
    complaintAttachment: String
    surveyTitle: String
    surveyDescription: String
    surveyAttachment: String
    systematicInquiryTitle: String
    systematicInquiryDescription: String
    systematicInquiryAttachment: String
    vitalsPr: Float
    vitalsBp1: Float
    vitalsBp2: Float
    vitalsRr: Float
    vitalsTemp: Float
    vitalsPs02: Float
    vitalsHeightUnit: String
    vitalsHeightValue: Float
    vitalsweightUnit: String
    vitalsweightValue: Float
    vitalsBmi: Float
    vitalsUrineType: String
    vitalsUrineValue: String
    examinationGeneral: String
    examinationArea: String
    examinationType: String
    examinationMeasure: String
    examinationValue: String
    examinationDescription: String
    examinationFollowUp: Boolean
    examinationAttachment: String
    investigationType: String
    investigationTitle: String
    investigationDescription: String
    investigationAttachment: String
    diagnosisType: String
    diagnosisTitle: String
    diagnosisDescription: String
    diagnosisAttachment: String
    treatmentType: String
    treatmentTitle: String
    treatmentDescription: String
    treatmentDose: String
    treatmentFrequency: String
    treatmentAttachment: String
    billingTitle: String
    billingType: String
    billingDescription: String
    billingAmount: Float
    billingPaid: Boolean
    billingAttachment: String
    billingNotes: String
    vigilanceChronicIllnessDiabetesMedication: Boolean
    vigilanceChronicIllnessDiabetesTesting: Boolean
    vigilanceChronicIllnessDiabetesComment: String
    vigilanceChronicIllnessHbpMedication: Boolean
    vigilanceChronicIllnessHbpTesting: Boolean
    vigilanceChronicIllnessHbpComment: String
    vigilanceChronicIllnessHbpDyslipidemiaMedication: Boolean
    vigilanceChronicIllnessHbpDyslipidemiaTesting: Boolean
    vigilanceChronicIllnessHbpDyslipidemiaComment: String
    vigilanceChronicIllnessCadMedication: Boolean
    vigilanceChronicIllnessCadTesting: Boolean
    vigilanceChronicIllnessCadComment: String
    vigilanceLifestyleWeightMedication: Boolean
    vigilanceLifestyleWeightTesting: Boolean
    vigilanceLifestyleWeightComment: String
    vigilanceLifestyleDietMedication: Boolean
    vigilanceLifestyleDietTesting: Boolean
    vigilanceLifestyleDietComment: String
    vigilanceLifestyleSmokingMedication: Boolean
    vigilanceLifestyleSmokingTesting: Boolean
    vigilanceLifestyleSmokingComment: String
    vigilanceLifestyleSubstanceAbuseMedication: Boolean
    vigilanceLifestyleSubstanceAbuseTesting: Boolean
    vigilanceLifestyleSubstanceAbuseComment: String
    vigilanceLifestyleExerciseMedication: Boolean
    vigilanceLifestyleExerciseTesting: Boolean
    vigilanceLifestyleExerciseComment: String
    vigilanceLifestyleAllergiesMedication: Boolean
    vigilanceLifestyleAllergiesTesting: Boolean
    vigilanceLifestyleAllergiesComment: String
    vigilanceLifestyleAsthmaMedication: Boolean
    vigilanceLifestyleAsthmaTesting: Boolean
    vigilanceLifestyleAsthmaComment: String
    vigilanceScreeningBreastMedication: Boolean
    vigilanceScreeningBreastTesting: Boolean
    vigilanceScreeningBreastComment: String
    vigilanceScreeningProstateMedication: Boolean
    vigilanceScreeningProstateTesting: Boolean
    vigilanceScreeningProstateComment: String
    vigilanceScreeningCervixMedication: Boolean
    vigilanceScreeningCervixTesting: Boolean
    vigilanceScreeningCervixComment: String
    vigilanceScreeningColonMedication: Boolean
    vigilanceScreeningColonTesting: Boolean
    vigilanceScreeningColonComment: String
    vigilanceScreeningDentalMedication: Boolean
    vigilanceScreeningDentalTesting: Boolean
    vigilanceScreeningDentalComment: String
    vigilanceVaccinesInfluenzaMedication: Boolean
    vigilanceVaccinesInfluenzaTesting: Boolean
    vigilanceVaccinesInfluenzaComment: String
    vigilanceVaccinesVaricellaMedication: Boolean
    vigilanceVaccinesVaricellaTesting: Boolean
    vigilanceVaccinesVaricellaComment: String
    vigilanceVaccinesHpvMedication: Boolean
    vigilanceVaccinesHpvTesting: Boolean
    vigilanceVaccinesHpvComment: String
    vigilanceVaccinesMmrMedication: Boolean
    vigilanceVaccinesMmrTesting: Boolean
    vigilanceVaccinesMmrComment: String
    vigilanceVaccinesTetanusMedication: Boolean
    vigilanceVaccinesTetanusTesting: Boolean
    vigilanceVaccinesTetanusComment: String
    vigilanceVaccinesPneumovaxMedication: Boolean
    vigilanceVaccinesPneumovaxTesting: Boolean
    vigilanceVaccinesPneumovaxComment: String
    vigilanceVaccinesOtherName: String
    vigilanceVaccinesOtherMedication: Boolean
    vigilanceVaccinesOtherTesting: Boolean
    vigilanceVaccinesOtherComment: String
    imageName: String
    imageType: String
    imagePath: String
    fileName: String
    fileType: String
    filePath: String
  }


  type Reminder {
    createDate: String
    sendDate: String
    sendTime: String
    creator: Staff
    type: String
    subType: String
    title: String
    trigger: ReminderTrigger
    appointment: Appointment
    staffRecipients: [Staff]
    patientRecipients: [Patient]
    body: String
    delivery: ReminderDelivery
  }
  type ReminderTrigger {
    unit:
    value:
  }
  type ReminderDelivery {
    type:
    params:
    sent:
  }

  input ReminderInput {
    createDate: String
    sendDate: String
    sendTime: String
    type: String
    subType: String
    title: String
    triggerUnit: String
    triggerValue: Float
    body: String
    deliveryType: String
    deliveryParams: String
    deliverySent: Boolean
  }


  type Contact {
    phone: String
    phone2: String
    email: String
  }
  type Address {
    number: Int
    street: String
    town: String
    city: String
    country: String
    postalCode: String
    primary: Boolean
  }
  type Verification {
    verified:
    type: String
    code: String
  }
  type Image {
    name: String
    type: String
    path: String
  }
  type File {
    name: String
    type: String
    path: String
  }
  type Activity {
    date: String
    request: String
  }
  type AuthData {
    activityId: ID!
    role: String!
    token: String
    tokenExpiration: Int!
    error: String
  }
  type TestMail {
    test: String
  }

  type RootQuery {
    testEmail: String

    login(email: String!, password: String!): AuthData!
    logout( activityId: ID!): User!

    getPocketVars(activityId: ID!): String

    getAllUsers(activityId: ID!): [User]
    getUserById(activityId: ID!, userId: ID!): User
    getUsersByField(activityId: ID!, field: String!, query: String!): [User]
    getUsersByFieldRegex(activityId: ID!, field: String!, query: String!): [User]

  }

  type RootMutation {

    createUser(userInput: UserInput!): User

  }

  schema {
      query: RootQuery
      mutation: RootMutation
  }
`);
