export const en = {
  common: {
    step: "Step",
    of: "of",
    next: "Next Step",
    back: "Back",
    modify: "Modify",
    total: "Total",
    hours: "hours",
    price: "Price",
    euro: "€",
    loading: "Loading...",
    success: "Success",
    error: "Error",
    remove: "Remove",
    viewProfile: "View Profile",
    online: "Online",
    available: "Available",
    reviews: "reviews",
    searchCountry: "Search country...",
    noCountries: "No countries found",
    child: "Child",
    children: "Children",
    noInterview: "No Interview",
    yearsOld: "years old",
    filters: "Filters",
    byLanguages: "By Languages",
    byAgeGroup: "By Age Group",
    byExperience: "By Experience",
    infants: "Infants",
    toddlers: "Toddlers",
    preschoolers: "Preschoolers",
    youngLearners: "Young Learners",
    days: {
      su: "Su",
      mo: "Mo",
      tu: "Tu",
      we: "We",
      th: "Th",
      fr: "Fr",
      sa: "Sa",
    },
  },
  steps: {
    familyInfo: "Family Information",
    scheduleQuote: "Schedule & Quote",
    matching: "Babysitter Matching",
  },
  step1: {
    title: "Family Information",
    subtitle: "Tell us about your family to customize your experience.",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phone: "Phone Number",
    address: "Full Address",
    numChildren: "Number of Children",
    childDob: "Child {n} Date of Birth",
    placeholders: {
      firstName: "e.g. Jean",
      lastName: "e.g. Dupont",
      email: "jean.dupont@email.com",
      phone: "06 12 34 56 78",
      address: "123 Rue de Rivoli, 75001 Paris",
    },
  },
  step2: {
    title: "Schedule & Quote",
    subtitle:
      "Select your dates and see your personalized price quote instantly.",
    calendarTitle: "Select Dates",
    calendarSubtitle: "Pick the specific days you need a babysitter.",
    noDates: "Please select at least one babysitting date.",
    startTime: "Start Time",
    endTime: "End Time",
    priceBreakdown: "Price Breakdown",
    childcarePackage: "Childcare package",
    totalBeforeAid: "Total Before Aid",
    financialAid: "Financial Aid",
    official: "Official",
    cafAssistance: "CAF Assistance",
    cafSubtitle: "Cost after CAF reimbursement",
    taxCredit: "Tax Credit (50%)",
    taxCreditSubtitle: "50% credit on remaining cost",
    finalCost: "Final Monthly Cost",
    finalCostSubtitle: "Your real out-of-pocket cost",
    howItWorks: "How it works",
    cmgEligible: "Based on your {h} hours, you are eligible for the CMG.",
    cmgNotEligible:
      "CMG is available starting from 16 hours of monthly childcare.",
    validateButton: "Start Matching",
    validationNote:
      "Start matching with premium babysitters based on your personalized schedule and quote.",
    tooltips: {
      caf: {
        title: "Complément de libre choix du Mode de Garde",
        profile: "Based on your profile:",
        youngest: "Youngest child:",
        ceiling: "Ceiling:",
        note: "CAF pays 85% of the bill, leaving you only 15%.",
      },
      tax: {
        title: "Crédit d'Impôt Services à la Personne",
        calculation: "Calculation:",
        annualLimit: "Annual Limit:",
        monthlyLimit: "Monthly Credit Limit:",
      },
    },
  },
  step3: {
    title: "Price Quote",
    subtitle: "Review your estimated costs",
  },
  step4: {
    title: "Select Your Candidates",
    subtitle: "Choose up to 4 babysitters you'd like to interview.",
    selectedTitle: "Your Selected Candidates",
    noSelected:
      "No babysitters selected yet. Choose up to 4 candidates from the list below.",
    maxCandidates: "Max 4 Candidates",
    selectCandidate: "Select as Candidate",
    selectFirst: "Select First Candidate",
    selectSecond: "Select Second Candidate",
    selectThird: "Select Third Candidate",
    selectFourth: "Select Fourth Candidate",
    selected: "Selected",
    submitSelection: "Submit My Selection",
    paymentNote:
      "Finalizing your selection requires a small confirmation payment of {amount}.",
    years: "years",
    exp: "y exp.",
    rankLabels: ["1st", "2nd", "3rd", "4th"],
  },
  payment: {
    title: "Secure Validation",
    subtitle: "Confirm your price quote and start matching.",
    amount: "Amount to pay:",
    cardInfo: "Card Information",
    cardNumber: "Card Number",
    expiry: "MM/YY",
    cvc: "CVC",
    payButton: "Pay {amount}",
    processing: "Processing payment...",
    success: "Payment Successful!",
    redirecting: "Finalizing your request...",
    securityNote: "Your payment information is encrypted and secure.",
  },
  modals: {
    interview: {
      title: "Schedule an Interview",
      skip: "Skip Interview",
      skipSubtitle: "Select without interview",
      preferredDate: "Preferred Date",
      preferredTime: "Preferred Time",
      timezone: "Timezone: Europe/Paris (CET)",
      confirm: "Confirm Selection",
    },
    profile: {
      aboutMe: "About Me",
      experience: "Experience",
      languages: "Languages",
      yearsOld: "years old",
      yearsExp: "Years",
    },
    success: {
      title: "Booking Request Sent!",
      subtitle:
        "We've received your candidate selection and schedule. We'll contact you shortly to finalize the interviews.",
      backToStart: "Go to Dashboard",
    },
    confirmSelection: {
      title: "Confirm Selection",
      subtitle:
        "Are you sure you want to submit your selection? This will send your request to our team.",
      confirm: "Submit",
      cancel: "Cancel",
    },
  },
  profilePage: {
    title: "My Account",
    subtitle: "Manage your requests, interviews, and documents.",
    createRequest: "Create Request",
    tabs: {
      requests: "Active Requests",
      interviews: "Interviews",
      invoices: "Invoices",
      tax: "Tax Certificates",
    },
    requests: {
      id: "Request ID",
      status: "Status",
      children: "Children",
      hours: "Total Hours",
      amount: "Total Amount",
      date: "Created on",
      pending: "Pending Matching",
      confirmed: "Confirmed",
      noRequests: "You have no active requests.",
    },
    interviews: {
      title: "Babysitter Interviews",
      joinMeeting: "Join Meeting",
      with: "Interview with",
      date: "Date",
      time: "Time",
      status: "Status",
      scheduled: "Scheduled",
      completed: "Completed",
      finalChoice: "Final Choice",
      reject: "Reject",
      viewContract: "View Contract",
      noInterviews: "No interviews scheduled.",
    },
    invoices: {
      number: "Invoice #",
      date: "Date",
      amount: "Amount",
      download: "Download PDF",
      noInvoices: "No invoices available.",
    },
    tax: {
      year: "Year",
      type: "Certificate Type",
      download: "Download",
      noCertificates: "No tax certificates available yet.",
    },
  },
  login: {
    title: "Welcome Back",
    subtitle: "Sign in to manage your childcare requests.",
    emailLabel: "Email Address",
    emailPlaceholder: "your@email.com",
    sendOtp: "Send Login Code",
    otpTitle: "Check your email",
    otpSubtitle: "We've sent a 6-digit code to {email}",
    otpLabel: "Enter Code",
    verify: "Verify & Sign In",
    resend: "Resend Code",
    backToEmail: "Change Email",
    noAccount: "Don't have an account?",
    startBooking: "Start a new request",
    existingAccount: "Already have an account? Log in here",
  },
  footer: {
    assistance: "If you need assistance, let us know via WhatsApp",
  },
  sitters: {
    amelie: {
      description:
        "Gentle and creative, I love organizing arts and crafts activities for children.",
      fullBio:
        "I have been working as a babysitter for over 5 years. I am currently a student in Early Childhood Education. I love storytelling, painting, and outdoor games. I am certified in first aid and have my own car.",
    },
    thomas: {
      description:
        "Energetic and patient, I specialize in active play and homework help.",
      fullBio:
        "With 7 years of experience, I've worked with children of all ages. I'm a former camp counselor and love sports. I can also help with math and science homework. I'm very reliable and punctual.",
    },
    chloe: {
      description:
        "Responsible and caring, I enjoy cooking healthy meals and bedtime stories.",
      fullBio:
        "I am a nursing student with a passion for childcare. I have experience with infants and toddlers. I love cooking and can prepare healthy snacks and meals. I am very attentive to safety and hygiene.",
    },
    lucas: {
      description:
        "Patient and musical, I can introduce your children to the piano.",
      fullBio:
        "I am a music teacher and part-time babysitter. I love sharing my passion for music with kids. I am calm, patient, and very organized. I have experience with children aged 4 to 12.",
    },
    sophie: {
      description:
        "Experienced nanny with a focus on educational games and development.",
      fullBio:
        "I have 10 years of professional experience as a nanny. I specialize in early childhood development and Montessori methods. I am fluent in three languages and love teaching basic vocabulary to children.",
    },
    nicolas: {
      description:
        "Fun and reliable, I love science experiments and magic tricks.",
      fullBio:
        "I'm a science student who loves making learning fun. I can perform simple magic tricks and science experiments that kids love. I'm very energetic and always bring a positive attitude.",
    },
  },
  contract: {
    title: "Childcare Service Contract",
    between: "BETWEEN THE UNDERSIGNED",
    agency:
      "The company BLOOM BUDDIES BABYSITTING SAS, with a capital of 1000 euros, having its registered office at 7 Rue Meyerbeer, 75009 Paris, registered under number 885130682 at the Paris Trade and Companies Register.",
    part1: "ON ONE PART,",
    part2: "AND",
    domiciledAt: "domiciled at",
    reachableAt: "reachable at",
    clientDesignation: "Hereinafter designated the Client.",
    partOther: "ON THE OTHER PART,",
    agreedFollowing: "It has been agreed and settled as follows:",
    article1: {
      title: "Article 1 - Purpose of the contract",
      content:
        "The purpose of this contract is the care of the Client's children according to the following schedule:",
      totalMonth: "Total for {month}:",
      totalPeriod: "Total number of hours (Period):",
    },
    article2: {
      title: "Article 2 - Place of performance of services",
      content:
        "The services covered by the contract will be mainly performed at the Client's home. However, it is agreed that the childcare provider may also go to the following places, such as the daycare, school, medical offices, music centers, sports centers or any other place located near the Client's home and in the same city. These displacements will be carried out within the framework of the child's needs and in accordance with the instructions given by the Client.",
    },
    article3: {
      title: "Article 3 - Duration and Commitment",
      content:
        "This contract is concluded for a fixed term with a firm commitment, from {start} to {end}.",
      subTitle: "3.1. Irrevocability of commitment",
      subContent:
        "During this initial period, the contract is firm and final. The parties are prohibited from any early unilateral termination. The contract may not be terminated before its term, except in case of gross negligence of one of the parties or recognized force majeure. In case of cessation of the execution of the contract by the Parent before the scheduled term, the entirety of the sums remaining due until the end date of the contract (indicated above) will become immediately exigible as compensation for breach of commitment.",
    },
    article4: {
      title: "Article 4 - Pricing and Payment Terms",
      subTitle41: "4.1. Fees and Monthly Breakdown:",
      content:
        "In return for the services defined in Article 1 of this contract, the Client agrees to pay the Provider the following remuneration. The rates indicated below are understood before any tax deduction or eventual tax credit.",
      subTitle42: "4.2. Precision on tax deduction:",
      content42:
        "The Client acknowledges that the prices indicated correspond to the sums actually due and cashed by the Provider. Tax benefits (such as tax credit or deduction) depend on the legislation in force and the Client's personal situation; they do not affect the obligation to pay all invoices at their maturity.",
      subTitle43: "4.3. Direct Debit Mandate:",
      content43:
        "Payment is made monthly by direct debit. By signing this contract, the Client expressly authorizes the Provider to transmit instructions to their bank to debit their account for the amount of the invoices at each maturity on the 31st of the month.",
      period: "Period (Month)",
      hrTotal: "Hr total",
      amountTtc: "Amount (Incl. Tax)",
      hourlyRate: "Hourly Rate:",
      taxNote: "* Rates before tax deduction or tax credit.",
    },
    article5: {
      title: "Article 5 - Late payment penalties",
      content:
        "In case of rejection of the direct debit or late payment, and in accordance with the firm commitment stipulated in Article 3, the entirety of the sums remaining due for the commitment period may be required immediately.",
    },
    article6: {
      title: "Article 6 - Provider's Obligations",
      content1:
        "The Provider agrees to perform the services defined in the article titled 'Purpose of the contract' above, within the timeframes and under the conditions agreed by the parties.",
      content2:
        "The Provider is required to inquire about the Client's needs and to provide all necessary information concerning the characteristics of the services provided.",
      content3:
        "The Provider may not subcontract the services of this contract to a third party without the prior written authorization of the Client.",
    },
    article7: {
      title: "Article 7 - Client's Obligations",
      content:
        "The Client must provide the Provider with all necessary information for the proper realization of the object of the contract. The Client agrees to pay the price of the services within the timeframes provided by the contract. For the execution of the services, the Client must allow access to the Provider at their home or establishment. The Client assumes full responsibility for ensuring that their home is secure for children and free from any danger or risk.",
    },
    article8: {
      title: "Article 8 - Obligation of Renegotiation",
      content:
        "In case of occurrence of unforeseeable events leading to an imbalance of the reciprocal benefits of the parties, they agree to enter into a renegotiation of the contract. The party invoking the change in circumstances must address their request for renegotiation to the other party by registered letter with acknowledgment of receipt. Renegotiation must be initiated within one month following the sending of the registered mail. During the renegotiation phase, the parties must continue to execute the contract as it was concluded. In case of failure of negotiations, the aggrieved party may seize the judge so that he adapts the contract. Failing possible adaptation, the judge may order the termination of the contract.",
    },
    article9: {
      title: "Article 9 - Force Majeure",
      content1:
        "No party can be held responsible for the non-execution of its obligations in case of force majeure. Force majeure corresponds to any unforeseeable event independent of the will of the parties, making the total or partial execution of the contractual obligations impossible.",
      content2:
        "In case of occurrence of a force majeure event, the concerned party must immediately inform the other party. The execution of the contract will then be suspended until the cessation of the force majeure event.",
      content3:
        "The parties agree to seek in good faith solutions to alleviate the difficulties created by force majeure and to implement them as soon as possible.",
      content4:
        "However, if the force majeure event persists for a duration exceeding two months, the parties may terminate the contract by right, without any compensation being due.",
    },
    article10: {
      title: "Article 10 - Insurance",
      content:
        "The Provider declares to be covered by professional civil liability insurance with a solvent insurance company. This insurance covers all material and immaterial damages resulting from the execution of the services.",
    },
    article11: {
      title: "Article 11 - Confidentiality",
      content:
        "The Provider agrees to maintain the confidentiality of all information, documents and data to which they may have access during the negotiation or execution of this contract. Information will not be considered confidential in the following cases:",
      item1:
        "Information already known to the Provider or the Client before the conclusion of the contract.",
      item2: "Information obtained legally from a third party.",
      item3: "Information that must be disclosed under a law or regulation.",
    },
    article12: {
      title: "Article 12 - Assignment of Contract",
      content:
        "This contract is concluded in consideration of the person of the Provider, and it is strictly personal. Thus, the Provider may not assign, transfer or delegate the contract to a third party without the prior written authorization of the Client.",
    },
    article13: {
      title: "Article 13 - Mediation",
      content1:
        "In case of dispute relating to the validity, interpretation, execution, non-execution, interruption or termination of this contract, the parties agree to resort to mediation before seizing a court. The party wishing to initiate the mediation process must inform the other party by registered letter with acknowledgment of receipt, specifying the points of disagreement and proposing, if applicable, the name of a mediator.",
      content2:
        "If the parties fail to agree on the choice of a mediator, one of the parties may seize the competent court so that it proceeds with the designation of a mediator.",
      content3:
        "During the mediation procedure, the limitation period for legal actions will be suspended. The suspension will end on the date of signature of the mediation report. Mediation costs will be split equally between the parties.",
    },
    article14: {
      title: "Article 14 - Care and Services",
      content1:
        "Childcare providers are responsible for preparing meals, baths and distributing snacks to your child, in accordance with your instructions. We are committed to providing trained professionals who are capable of providing all necessary care to your child.",
      content2:
        "Specific instructions regarding bathing and feeding can be discussed during the interview with your provider. We encourage open and clear communication to ensure that the care provided meets your child's needs and preferences.",
      content3:
        "Our providers will work closely with you to ensure that meals, baths and snacks are carried out appropriately and in accordance with your expectations.",
      content4:
        "In case of concerns or specific requests regarding care and services, please inform us so that we can take the necessary measures to meet your needs and ensure your child's well-being.",
      content5:
        "We are committed to maintaining the confidentiality of information shared during discussions on care and services, in accordance with Article 11 of this contract.",
      content6:
        "This article is an integral part of the contract and is subject to the general conditions and provisions set forth in the other articles.",
    },
    article15: {
      title: "Article 15 - Modification and Maintenance of Sessions",
      subTitle151: "15.1. Firm Commitment:",
      content151:
        "All babysitting sessions planned in the monthly schedule are firm and mandatory. No session can be canceled or deducted from billing.",
      subTitle152: "15.2. Possibility of Postponement:",
      content152:
        "If the Client cannot honor a session, they have the possibility of requesting its postponement to another date during the same month. This postponement is strictly subject to the prior agreement and availability of the provider.",
      subTitle153: "15.3. Sessions not performed:",
      content153:
        "Any session that has not been performed due to the Client (absence, early return, oversight, etc.) and which has not been subject to a postponement validated by the provider will be considered consumed. It will remain fully billed and cannot give rise to any refund or postponement to the following month.",
    },
    article16: {
      title: "Article 16 - Replacement of the Provider and Absences",
      content1:
        "If you are not satisfied with the skills of the babysitter you have chosen to validate, and you wish to replace them, this is possible upon fulfillment of a two-week notice to the babysitter to whom the previously mentioned billing will apply. During this time, the Provider agrees to find an adequate replacement; we commit to providing you with another Bloom Buddies provider as soon as possible. Your satisfaction is our priority and we strive to meet your expectations in terms of service quality.",
      content2:
        "In case of absence of the provider, we commit to informing you as soon as possible and to proposing appropriate replacement solutions. We will make every effort to ensure the continuity of our service and minimize disruptions for you and your child.",
      content3:
        "To request a provider replacement or report an absence, please contact us by phone or in writing, providing the relevant details. We will do our best to respond to your request as soon as possible.",
      content4:
        "Please note that provider replacements will be made according to the availability and capacities of our staff. We will strive to find the best possible match in terms of skills and profile to meet your specific needs.",
      content5:
        "The exact terms of replacement of the provider and management of absences may be specified in the individual contract signed between the parties, if applicable.",
      content6:
        "In case of discrepancy, the specific provisions of the contract will prevail over the general provisions of this article.",
    },
    article17: {
      title: "Article 17 - Validation of the Contract",
      content1:
        "After the conclusion of this contract, it is agreed that the contract will be considered read, accepted and validated in the following cases:",
      itemA:
        "a) Payment of the invoice: The client agrees to pay the invoice issued by Bloom Buddies Babysitting according to the agreed terms. Once the full payment of the invoice has been received by Bloom Buddies Babysitting, the contract will be considered read, accepted and validated.",
      itemB:
        "b) Start of the babysitting service: If the client has engaged the babysitting services provided by Bloom Buddies Babysitting without having previously signed the contract, the fact of starting the babysitting service will be considered as tacit acceptance and validation of the contract.",
      content2:
        "This article is in compliance with the legal provisions in force and aims to guarantee the legal security of the parties involved. It is the responsibility of the client to read the contract and ensure their understanding and acceptance before proceeding with the payment of the invoice or the start of the babysitting service.",
      content3:
        "The client is reminded that it is preferable to sign the contract before the start of the babysitting service in order to clearly establish the rights, duties and responsibilities of each party. Signing the contract avoids any confusion or later discrepancy in interpretation.",
      content4:
        "In case of dispute or subsequent challenge to the terms and conditions of the contract, the parties agree to refer to the content of the contract itself, as it was established, and to respect the obligations defined therein.",
      content5:
        "These provisions are in addition to the other clauses and conditions stipulated in the contract and in no way affect their validity and applicability.",
    },
    article18: {
      title:
        "Article 18 - Interdiction of Private Agreements between the Client and the Babysitter",
      content1:
        "The client is informed and agrees not to offer childcare hours, excluding the Bloom Buddies Babysitting agency, directly to the babysitter. Any attempt to establish private agreements that would exclude the Provider is strictly prohibited.",
      content2:
        "It is important to emphasize that childcare providers are trained and responsible professionals who work closely with Bloom Buddies Babysitting to ensure the safety and well-being of your children. Any proposal for private agreements can lead to risks of conflict of interest, non-compliance with safety standards and loss of trust between the parties involved.",
      content3:
        "Any request for additional childcare hours or outside the planned hours must be communicated to Bloom Buddies Babysitting. Our agency will do its best to meet your needs and find appropriate solutions depending on the availability of our qualified babysitters.",
      content4:
        "In case of reporting by a provider concerning a proposal for a private agreement, the provider reserves the right to take appropriate measures, including banning the client from using our services in the future.",
    },
    article19: {
      title: "Article 19 - Absences of the Babysitter",
      contentA:
        "a. The babysitter must inform the Client of any planned absence at least two weeks in advance, except in case of unforeseen circumstances or emergencies. The client must also inform the provider of babysitter absences to allow the provider to find an adequate replacement as soon as possible.",
      contentB:
        "b. In case of unforeseen absence, the babysitter will strive to notify the Client as soon as possible and propose an adequate replacement, if available.",
      contentC:
        "c. If an appropriate replacement is not available for a planned absence, the babysitter will propose mutually agreed alternative dates in the same month to compensate for missed hours.",
      subTitle1: "Temporary Replacement:",
      subContent1A:
        "a. In case of planned or unforeseen absence of the babysitter, Bloom Buddies Babysitting will strive to provide a temporary replacement babysitter with similar qualifications and experience.",
      subContent1B:
        "b. The temporary replacement babysitter will follow the same schedule and responsibilities agreed in the initial contract.",
      subContent1C:
        "c. The services of the temporary replacement babysitter will be provided at no additional cost for the hours covered by the initial contract.",
      subTitle2: "Permanent Replacement:",
      subContent2A:
        "a. If the babysitter resigns and a permanent replacement is necessary, Bloom Buddies Babysitting will make every effort to find an appropriate replacement within a reasonable timeframe.",
      subContent2B:
        "b. The Client will have the right to interview and approve the permanent replacement babysitter before they start their services.",
      subContent2C:
        "c. Once the permanent replacement babysitter is accepted and hired, the terms and conditions of the initial contract will apply, including monthly remuneration and other provisions.",
    },
    annexe: {
      title: "Annex - Mandate of Tele-declaration",
      content1:
        "Parents give mandate to the Bloom Buddies Babysitting establishment to carry out each month, in their name and on their behalf, the monthly declaration allowing the calculation by the Family Allowance Fund (CAF) of the amount of the free choice of childcare supplement (CMG) to which they are entitled under Article L.531-6 of the Social Security Code.",
      content2:
        "This declaration consists of completing and sending monthly to the CAF, by teleprocedure, the following information for each child cared for:",
      item1: "The first and last names of the child",
      item2: "His/her date of birth",
      item3:
        "The number of hours of care performed during the month considered and the number of specific hours (1), if applicable",
      item4:
        "The total amount billed and paid corresponding to the month concerned",
      item5:
        "The end of recourse to the services of the establishment, if applicable.",
      content3:
        "This mandate is strictly limited to the obligation described above. The CAF does not intervene in the management of this mandate.",
      content4:
        "The obligations provided for under the mandate take effect from the date of signature of this care contract and persist until its term or the waiver of the mandate by one of the parties.",
    },
    actions: {
      accept: "Accept",
      refuse: "Refuse",
      slide: "Slide to accept",
      back: "Back to Profile",
      success: "Contract Accepted Successfully!",
      loading: "Loading contract details...",
    },
    signatureLocationDate: "Done in Paris, on {date}",
    electronicSignature: "Secure electronic signature",
  },
};
