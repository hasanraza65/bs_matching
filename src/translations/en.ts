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
    part1: "On one hand,",
    part2: "AND",
    domiciledAt: "domiciled at",
    reachableAt: "reachable at",
    clientDesignation: "Hereinafter referred to as the Client.",
    partOther: "On the other hand,",
    agreedFollowing: "It has been agreed and settled as follows:",
    article1: {
      title: "Article 1 - Subject of the contract",
      content:
        "The purpose of this contract is the care of the Client's children according to the following schedule:",
      totalMonth: "Total for {month}:",
      totalPeriod: "Total number of hours (Period):",
    },
    article2: {
      title: "Article 2 - Place of performance of services",
      content:
        "The services covered by the contract will be mainly performed at the Client's home. However, it is agreed that the childcare provider may also go to the following places, such as the daycare, school, medical offices, music centers, sports centers or any other place located near the Client's home and in the same city.",
    },
    article3: {
      title: "Article 3 - Duration and Commitment",
      content:
        "This contract is concluded for a fixed term with a firm commitment, from {start} to {end}.",
      subTitle: "3.1. Irrevocability of commitment",
      subContent:
        "During this initial period, the contract is firm and final. The parties are prohibited from any early unilateral termination. The contract may not be terminated before its term, except in case of gross negligence of one of the parties or recognized force majeure.",
    },
    article4: {
      title: "Article 4 - Pricing and Payment Terms",
      content:
        "In return for the services defined in Article 1 of this contract, the Client agrees to pay the Provider the following remuneration:",
      period: "Period (Month)",
      hrTotal: "Hr total",
      amountTtc: "Amount (Incl. Tax)",
      hourlyRate: "Hourly Rate:",
      taxNote: "* Rates before tax deduction or tax credit.",
    },
    actions: {
      accept: "Accept",
      refuse: "Refuse",
      slide: "Slide to accept",
      back: "Back to Profile",
      success: "Contract Accepted Successfully!",
      loading: "Loading contract details...",
    },
    article5: {
      title: "Article 5 - Penalties",
      content:
        "In case of late payment, the full amount of the remaining installments may be required immediately.",
    },
    article18: {
      title: "Article 18 - Private Agreements",
      content:
        "The client agrees not to deal directly with the babysitter by bypassing Bloom Buddies.",
    },
    signatureLocationDate: "Done in Paris, on {date}",
    electronicSignature: "Secure electronic signature",
  },
};
