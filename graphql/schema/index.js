

const { buildSchema } = require('graphql');

module.exports = buildSchema(`

  type User {
    _id: ID!
    password: String
    title: String
    name: String
    role: String
    username: String
    registrationNumber: String
    employmentDate: String
    dob: String
    age: Int
    gender: String
    contact: Contact
    addresses: [Address]
    loggedIn: Boolean
    clientConnected: Boolean
    verification: Verification
    attendance: [UserAttendance]
    leave: [UserLeave]
    images: [Image]
    files: [File]
    notes: [String]
    appointments: [Appointment]
    reminders: [Reminder]
    activity: [Activity]
  }
  type UserAttendance {
    date: String
    status: String
    description: String
  }
  type UserLeave {
    type: String
    startDate: String
    endDate: String
    description: String
  }
  input UserInput {
    password: String
    title: String
    name: String
    role: String
    username: String
    registrationNumber: String
    employmentDate: String
    dob: String
    age: Int
    gender: String
    contactPhone: String
    contactPhone2: String
    contactEmail: String
    addressNumber: Int
    addressStreet: String
    addressTown: String
    addressCity: String
    addressParish: String
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
    lastName: String
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
    appointments: [Appointment]
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
    lastName: String
    role: String
    username: String
    registrationDate: String
    registrationNumber: String
    dob: String
    age: Int
    gender: String
    contactPhone: String
    contactPhone2: String
    contactEmail: String
    addressNumber: Int
    addressStreet: String
    addressTown: String
    addressCity: String
    addressParish: String
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
    allergyAttachments: String
    medicationTitle: String
    medicationType: String
    medicationDescription: String
    medicationAttachment: String
    medicationAttachments: String
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

  type Appointment {
    _id: ID!
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
    consultants: [User]
    inProgress: Boolean
    attended: Boolean
    important: Boolean
    notes: [String]
    tags: [String]
    reminders: [Reminder]
    creator: User
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
    _id: ID!
    date: String
    time: String
    title: String
    type: String
    subType: String
    patient: Patient
    consultants: [User]
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
    notes: String
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
    complaintAttachments: String
    surveyTitle: String
    surveyDescription: String
    surveyAttachment: String
    surveyAttachments: String
    systematicInquiryTitle: String
    systematicInquiryDescription: String
    systematicInquiryAttachment: String
    systematicInquiryAttachments: String
    vitalsPr: Float
    vitalsBp1: Float
    vitalsBp2: Float
    vitalsRr: Float
    vitalsTemp: Float
    vitalsPs02: Float
    vitalsHeightUnit: String
    vitalsHeightValue: Float
    vitalsWeightUnit: String
    vitalsWeightValue: Float
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
    examinationAttachments: String
    investigationType: String
    investigationTitle: String
    investigationDescription: String
    investigationAttachment: String
    investigationAttachments: String
    diagnosisType: String
    diagnosisTitle: String
    diagnosisDescription: String
    diagnosisAttachment: String
    diagnosisAttachments: String
    treatmentType: String
    treatmentTitle: String
    treatmentDescription: String
    treatmentDose: String
    treatmentFrequency: String
    treatmentAttachment: String
    treatmentAttachments: String
    billingTitle: String
    billingType: String
    billingDescription: String
    billingAmount: Float
    billingPaid: Boolean
    billingAttachment: String
    billingAttachments: String
    billingNotes: String
    vigilanceChronicIllnessDiabetesMedication: Boolean
    vigilanceChronicIllnessDiabetesTesting: Boolean
    vigilanceChronicIllnessDiabetesComment: String
    vigilanceChronicIllnessHbpMedication: Boolean
    vigilanceChronicIllnessHbpTesting: Boolean
    vigilanceChronicIllnessHbpComment: String
    vigilanceChronicIllnessDyslipidemiaMedication: Boolean
    vigilanceChronicIllnessDyslipidemiaTesting: Boolean
    vigilanceChronicIllnessDyslipidemiaComment: String
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
    _id: ID!
    createDate: String
    sendDate: String
    sendTime: String
    creator: User
    type: String
    subType: String
    title: String
    trigger: ReminderTrigger
    appointment: Appointment
    staffRecipients: [User]
    patientRecipients: [Patient]
    body: String
    delivery: ReminderDelivery
  }
  type ReminderTrigger {
    unit: String
    value: Float
  }
  type ReminderDelivery {
    type: String
    params: String
    sent: Boolean
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

  type Queue {
    _id: ID!
    date: String
    currentSlot: Int
    slots: [QueueSlot]
    creator: User
  }
  type QueueSlot {
    number: Int
    time: String
    patient: Patient
    consultant: User
    seen: Boolean
    seenTime: String
  }
  input QueueInput {
    date: String
    slotNumber: Int
    slotTime: String
    slotSeen: Boolean
    slotSeenTime: String
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
    parish: String
    country: String
    postalCode: String
    primary: Boolean
  }
  type Verification {
    verified: Boolean
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
    testPuppeteer: String

    getPocketVars(activityId: ID!): String

    verifyInvitation(challenge: String!): String

    login(username: String!, password: String!): AuthData!
    logout( activityId: ID!): User!
    getThisUser(activityId: ID!): User

    getAllUsers(activityId: ID!): [User]
    getUserById(activityId: ID!, userId: ID!): User
    getUsersByField(activityId: ID!, field: String!, query: String!): [User]
    getUsersByFieldRegex(activityId: ID!, field: String!, query: String!): [User]
    getUsersByAppointment(activityId: ID!, appointmentId: ID!): [User]

    getAllPatients(activityId: ID!): [Patient]
    getPatientById(activityId: ID!, patientId: ID!): Patient
    getPatientsByField(activityId: ID!, field: String!, query: String!): [Patient]
    getPatientsByFieldRegex(activityId: ID!, field: String!, query: String!): [Patient]
    getPatientByVisits(activityId: ID!, visitIds: String!): Patient
    getPatientsByTags(activityId: ID!, patientInput: PatientInput!): [Patient]
    getRecentPatients(activityId: ID!, amount: Int!): [Patient]

    getAllAppointments(activityId: ID!): [Appointment]
    getAppointmentById(activityId: ID!, appointmentId: ID!): Appointment
    getAppointmentsByField(activityId: ID!, field: String!, query: String!): [Appointment]
    getAppointmentsByFieldRegex(activityId: ID!, field: String!, query: String!): [Appointment]
    getAppointmentByVisit(activityId: ID!, visitId: ID!): Appointment
    getAppointmentsByPatient(activityId: ID!, patientId: ID!): [Appointment]
    getAppointmentsByConsultants(activityId: ID!, consultantIds: String!): [Appointment]
    getAppointmentsByTags(activityId: ID!, appointmentInput:AppointmentInput!): [Appointment]
    getAppointmentsToday(activityId: ID!): [Appointment]
    getAppointmentsImportantNextWeek(activityId: ID!): [Appointment]

    getAllVisits(activityId: ID!): [Visit]
    getVisitById(activityId: ID!, visitId: ID!): Visit
    getVisitsByField(activityId: ID!, field: String!, query: String!): [Visit]
    getVisitsByFieldRegex(activityId: ID!, field: String!, query: String!): [Visit]
    getVisitByAppointment(activityId: ID!, appointmentId: ID!): Visit

    getAllReminders(activityId: ID!): [Reminder]
    getReminderById(activityId: ID!, reminderId: ID!): Reminder
    getRemindersByField(activityId: ID!, field: String!, query: String!): [Reminder]
    getRemindersByFieldRegex(activityId: ID!, field: String!, query: String!): [Reminder]
    getRemindersByCreator(activityId: ID!, creatorId: ID!): [Reminder]
    getRemindersByAppointment(activityId: ID!, appointmentId: ID!): [Reminder]
    getRemindersByRecipientsStaff(activityId: ID!, staffIds: String!): [Reminder]
    getRemindersByRecipientsPatient(activityId: ID!, patientIds: String!): [Reminder]

    getAllQueues(activityId: ID!): [Queue]
    getQueueById(activityId: ID!, queueId: ID!): Queue
    getQueuesByField(activityId: ID!, field: String!, query: String!): [Queue]
    getQueueSlotByPatient(activityId: ID!, queueId: ID!, patientId: ID!): Queue
    getQueueByCreator(activityId: ID!, creatorId: ID!): Queue
    getQueueToday(activityId: ID!): Queue


  }

  type RootMutation {

    createUser(userInput: UserInput!): User
    updateUserAllFields(activityId: ID!, userId: ID!, userInput: UserInput!): User
    updateUserSingleField(activityId: ID!, userId: ID!, field: String!, query: String!): User
    addUserAddress(activityId: ID!, userId: ID!, userInput: UserInput!): User
    setUserAddressPrimary(activityId: ID!, userId: ID!, userInput: UserInput!): User
    addUserAttendance(activityId: ID!, userId: ID!, userInput: UserInput!): User
    addUserLeave(activityId: ID!, userId: ID!, userInput: UserInput!): User
    addUserImage(activityId: ID!, userId: ID!, userInput: UserInput!): User
    addUserFile(activityId: ID!, userId: ID!, userInput: UserInput!): User
    addUserNotes(activityId: ID!, userId: ID!, userInput: UserInput!): User
    addUserReminder(activityId: ID!, userId: ID!, reminderId: ID!): User
    addUserActivity(activityId: ID!, userId: ID!, userInput: UserInput!): User
    addUserAppointment(activityId: ID!, userId: ID!, appointmentId: ID!): User

    deleteUserById(activityId: ID!, userId: ID!): User
    deleteUserAddress(activityId: ID!, userId: ID!, userInput: UserInput!): User
    deleteUserAttendance(activityId: ID!, userId: ID!, userInput: UserInput!): User
    deleteUserLeave(activityId: ID!, userId: ID!, userInput: UserInput!): User
    deleteUserImage(activityId: ID!, userId: ID!, userInput: UserInput!): User
    deleteUserFile(activityId: ID!, userId: ID!, userInput: UserInput!): User
    deleteUserNote(activityId: ID!, userId: ID!, userInput: UserInput!): User
    deleteUserReminder(activityId: ID!, userId: ID!, reminderId: ID!): User

    requestPasswordReset(userInput: UserInput! ): User
    resetUserPassword(userId: ID!, userInput: UserInput!):User
    verifyUser( userInput: UserInput!): User
    userOnline(activityId: ID!, userId: ID! ): User
    userOffline(activityId: ID!, userId: ID! ): User

    createPatient(activityId: ID!, patientInput: PatientInput!): Patient
    updatePatientAllFields(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    updatePatientSingleField(activityId: ID!, patientId: ID!, field:String!, query:String!): Patient
    addPatientAddress(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    setPatientAddressPrimary(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    addPatientNextOfKin(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    addPatientAllergy(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    addPatientAllergyAttachment(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    addPatientMedication(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    addPatientMedicationAttachment(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    addPatientImage(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    addPatientFile(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    addPatientNotes(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    addPatientTags(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    addPatientVisit(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    addPatientReminder(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient

    deletePatientById(activityId: ID!, patientId: ID!): Patient
    deletePatientAddress(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    deletePatientNextOfKin(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    deletePatientAllergy(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    deletePatientAllergyAttachment(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    deletePatientMedication(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    deletePatientMedicationAttachment(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    deletePatientImage(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    deletePatientFile(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    deletePatientNote(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    deletePatientTag(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    deletePatientVisit(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient
    deletePatientReminder(activityId: ID!, patientId: ID!, patientInput: PatientInput!): Patient

    verifyPatient( patientInput: UserInput!): Patient
    patientOnline(activityId: ID!, patientId: ID! ): Patient
    patientOffline(activityId: ID!, patientId: ID! ): Patient

    createAppointment(activityId: ID!, patientId: ID!, appointmentInput: AppointmentInput!): Appointment
    updateAppointmentAllFields(activityId: ID !, appointmentId: ID!, appointmentInput: AppointmentInput!): Appointment
    updateAppointmentSingleField(activityId: ID !, appointmentId: ID!, field: String!, query: String!): Appointment
    updateAppointmentVisit(activityId: ID !, appointmentId: ID!, visitId: ID!): Appointment
    updateAppointmentPatient(activityId: ID !, appointmentId: ID!, patientId: ID!): Appointment
    addAppointmentConsultant(activityId: ID !, appointmentId: ID!, consultantId: ID!): Appointment
    addAppointmentNotes(activityId: ID !, appointmentId: ID!, appointmentInput: AppointmentInput!): Appointment
    addAppointmentTags(activityId: ID !, appointmentId: ID!, appointmentInput: AppointmentInput!): Appointment

    deleteAppointmentById(activityId: ID!, appointmentId: ID!): Appointment
    deleteAppointmentConsultant(activityId: ID !, appointmentId: ID!, consultantId: ID!): Appointment
    deleteAppointmentNote(activityId: ID !, appointmentId: ID!, appointmentInput: AppointmentInput!): Appointment
    deleteAppointmentTag(activityId: ID !, appointmentId: ID!, appointmentInput: AppointmentInput!): Appointment

    createVisit(activityId: ID!, appointmentId: ID!, visitInput: VisitInput!): Visit
    updateVisitAllFields(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    updateVisitSingleField(activityId: ID!, visitId: ID!, field: String, query: String!): Visit
    updateVisitPatient(activityId: ID!, visitId: ID!, patientId: ID!): Visit
    addVisitConsultant(activityId: ID!, visitId: ID!, consultantId: ID!): Visit
    addVisitComplaint(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitComplaintAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitSurvey(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitSurveyAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitSysInquiry(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitSysInquiryAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitVitals(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitExamination(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitExaminationAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitInvestigation(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitInvestigationAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitDiagnosis(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitDiagnosisAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitTreatment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitTreatmentAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitBilling(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitBillingAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitVigilance(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitImage(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    addVisitFile(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    completeVisitById(activityId: ID!, visitId: ID!): Visit

    deleteVisitById(activityId: ID!, visitId: ID!): Visit
    deleteVisitConsultant(activityId: ID!, visitId: ID!, consultantId: ID!): Visit
    deleteVisitComplaint(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitComplaintAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitSurvey(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitSurveyAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitSysInquiry(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitSysInquiryAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitVitals(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitExamination(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitExaminationAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitInvestigation(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitInvestigationAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitDiagnosis(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitDiagnosisAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitTreatment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitTreatmentAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitBilling(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitBillingAttachment(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitVigilance(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitImage(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit
    deleteVisitFile(activityId: ID!, visitId: ID!, visitInput: VisitInput!): Visit

    createReminder(activityId: ID!, appointmentId: ID!, reminderInput: ReminderInput!): Reminder
    updateReminderAllFields(activityId: ID!, reminderId: ID!, reminderInput: ReminderInput!): Reminder
    updateReminderSingleField(activityId: ID!, reminderId: ID!, field:String!, query:String!): Reminder
    updateReminderTrigger(activityId: ID!, reminderId: ID!, appointmentId: ID!, reminderInput: ReminderInput!): Reminder
    updateReminderDelivery(activityId: ID!, reminderId: ID!, reminderInput: ReminderInput!): Reminder
    addReminderRecipientStaff(activityId: ID!, reminderId: ID!, staffId: ID!): Reminder
    addReminderRecipientPatient(activityId: ID!, reminderId: ID!, patientId: ID!): Reminder

    deleteReminderRecipientStaff(activityId: ID!, reminderId: ID!, staffId: ID!): Reminder
    deleteReminderRecipientPatient(activityId: ID!, reminderId: ID!, patientId: ID!): Reminder
    deleteReminderById(activityId: ID!, reminderId: ID!): Reminder

    sendReminders(activityId: ID!): [Reminder]

    createQueue(activityId: ID!): Queue
    addQueueSlot(activityId: ID!, queueId: ID!, patientId: ID, consultantId: ID!): Queue
    queueSlotSeen(activityId: ID!, queueId: ID!, queueInput: QueueInput!): Queue
    queueSlotUnseen(activityId: ID!, queueId: ID!, queueInput: QueueInput!): Queue
    deleteQueueSlot(activityId: ID!, queueId: ID!, queueInput: QueueInput!): Queue
    deleteQueueById(activityId: ID!, queueId: ID!): Queue

  }

  schema {
      query: RootQuery
      mutation: RootMutation
  }
`);
