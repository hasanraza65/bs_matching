export const fr = {
  common: {
    step: "Étape",
    of: "sur",
    next: "Étape suivante",
    back: "Retour",
    modify: "Modifier",
    total: "Total",
    hours: "heures",
    price: "Prix",
    euro: "€",
    loading: "Chargement...",
    success: "Succès",
    error: "Erreur",
    remove: "Supprimer",
    viewProfile: "Voir le profil",
    online: "En ligne",
    available: "Disponible",
    reviews: "avis",
    searchCountry: "Chercher un pays...",
    noCountries: "Aucun pays trouvé",
    child: "Enfant",
    children: "Enfants",
    noInterview: "Pas d'entretien",
    yearsOld: "ans",
    filters: "Filtres",
    byLanguages: "Par Langues",
    byAgeGroup: "Par Groupe d'Âge",
    byExperience: "Par Expérience",
    infants: "Nourrissons",
    toddlers: "Tout-petits",
    preschoolers: "Maternelle",
    youngLearners: "Jeunes Apprenants",
    days: {
      su: "Dim",
      mo: "Lun",
      tu: "Mar",
      we: "Mer",
      th: "Jeu",
      fr: "Ven",
      sa: "Sam",
    },
  },
  steps: {
    familyInfo: "Informations Famille",
    scheduleQuote: "Planning & Devis",
    matching: "Sélection Babysitters",
  },
  step1: {
    title: "Informations Famille",
    subtitle:
      "Parlez-nous de votre famille pour personnaliser votre expérience.",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse Email",
    phone: "Numéro de Téléphone",
    address: "Adresse Complète",
    numChildren: "Nombre d'enfants",
    childDob: "Date de naissance enfant {n}",
    placeholders: {
      firstName: "ex. Jean",
      lastName: "ex. Dupont",
      email: "jean.dupont@email.com",
      phone: "06 12 34 56 78",
      address: "123 Rue de Rivoli, 75001 Paris",
    },
  },
  step2: {
    title: "Planning & Devis",
    subtitle:
      "Sélectionnez vos dates et visualisez votre devis personnalisé instantanément.",
    calendarTitle: "Sélectionner les dates",
    calendarSubtitle:
      "Choisissez les jours où vous avez besoin d'une babysitter.",
    noDates: "Veuillez sélectionner au moins une date de garde.",
    startTime: "Heure de début",
    endTime: "Heure de fin",
    priceBreakdown: "Détail du prix",
    childcarePackage: "Forfait garde d'enfants",
    totalBeforeAid: "Total avant aides",
    financialAid: "Aides financières",
    official: "Officiel",
    cafAssistance: "Aide CAF (CMG)",
    cafSubtitle: "Reste à charge après aide CAF",
    taxCredit: "Crédit d'Impôt (50%)",
    taxCreditSubtitle: "50% de crédit sur le reste à charge",
    finalCost: "Coût mensuel final",
    finalCostSubtitle: "Votre coût réel après toutes aides",
    howItWorks: "Comment ça marche",
    cmgEligible: "Basé sur vos {h} heures, vous êtes éligible au CMG.",
    cmgNotEligible:
      "Le CMG est disponible à partir de 16 heures de garde mensuelles.",
    validateButton: "Commencer la mise en relation",
    validationNote:
      "Commencez la mise en relation avec des babysitters premium basés sur votre planning et devis personnalisé.",
    tooltips: {
      caf: {
        title: "Complément de libre choix du Mode de Garde",
        profile: "Basé sur votre profil :",
        youngest: "Enfant le plus jeune :",
        ceiling: "Plafond :",
        note: "La CAF prend en charge 85% de la facture, vous ne payez que 15%.",
      },
      tax: {
        title: "Crédit d'Impôt Services à la Personne",
        calculation: "Calcul :",
        annualLimit: "Plafond annuel :",
        monthlyLimit: "Plafond de crédit mensuel :",
      },
    },
  },
  step3: {
    title: "Devis Détaillé",
    subtitle: "Consultez le détail de vos coûts estimés",
  },
  step4: {
    title: "Sélectionnez vos candidates",
    subtitle:
      "Choisissez jusqu'à 4 babysitters que vous souhaitez interviewer.",
    selectedTitle: "Vos candidates sélectionnées",
    noSelected:
      "Aucune babysitter sélectionnée. Choisissez jusqu'à 4 candidates dans la liste ci-dessous.",
    maxCandidates: "Max 4 candidates",
    selectCandidate: "Sélectionner comme candidate",
    selectFirst: "Sélectionner 1ère candidate",
    selectSecond: "Sélectionner 2e candidate",
    selectThird: "Sélectionner 3e candidate",
    selectFourth: "Sélectionner 4e candidate",
    selected: "Sélectionnée",
    submitSelection: "Envoyer ma sélection",
    paymentNote:
      "La finalisation de votre sélection nécessite un petit paiement de confirmation de {amount}.",
    years: "ans",
    exp: "ans d'exp.",
    rankLabels: ["1er", "2e", "3e", "4e"],
  },
  payment: {
    title: "Validation Sécurisée",
    subtitle: "Confirmez votre devis et commencez la sélection.",
    amount: "Montant à payer :",
    cardInfo: "Informations de carte",
    cardNumber: "Numéro de carte",
    expiry: "MM/AA",
    cvc: "CVC",
    payButton: "Payer {amount}",
    processing: "Traitement du paiement...",
    success: "Paiement réussi !",
    redirecting: "Finalisation de votre demande...",
    securityNote: "Vos informations de paiement sont cryptées et sécurisées.",
  },
  modals: {
    interview: {
      title: "Planifier un Entretien",
      skip: "Passer l'entretien",
      skipSubtitle: "Sélectionner sans entretien",
      preferredDate: "Date préférée",
      preferredTime: "Heure préférée",
      timezone: "Fuseau horaire : Europe/Paris (CET)",
      confirm: "Confirmer la sélection",
    },
    profile: {
      aboutMe: "À propos de moi",
      experience: "Expérience",
      languages: "Langues",
      yearsOld: "ans",
      yearsExp: "Ans",
    },
    success: {
      title: "Demande de réservation envoyée !",
      subtitle:
        "Nous avons reçu votre sélection de candidats et votre planning. Nous vous contacterons prochainement pour finaliser les entretiens.",
      backToStart: "Aller au tableau de bord",
    },
    confirmSelection: {
      title: "Confirmer la sélection",
      subtitle:
        "Êtes-vous sûr de vouloir envoyer votre sélection ? Cela enverra votre demande à notre équipe.",
      confirm: "Envoyer",
      cancel: "Annuler",
    },
  },
  profilePage: {
    title: "Mon Compte",
    subtitle: "Gérez vos demandes, entretiens et documents.",
    createRequest: "Créer une demande",
    tabs: {
      requests: "Demandes Actives",
      interviews: "Entretiens",
      invoices: "Factures",
      tax: "Attestations Fiscales",
    },
    requests: {
      id: "ID Demande",
      status: "Statut",
      children: "Enfants",
      hours: "Total Heures",
      amount: "Montant Total",
      date: "Créée le",
      pending: "En attente de matching",
      confirmed: "Confirmée",
      noRequests: "Vous n'avez aucune demande active.",
    },
    interviews: {
      title: "Entretiens Babysitter",
      joinMeeting: "Rejoindre l'entretien",
      with: "Entretien avec",
      date: "Date",
      time: "Heure",
      status: "Statut",
      scheduled: "Planifié",
      completed: "Terminé",
      finalChoice: "Choix Final",
      reject: "Refuser",
      viewContract: "Voir le contrat",
      noInterviews: "Aucun entretien planifié.",
    },
    invoices: {
      number: "Facture n°",
      date: "Date",
      amount: "Montant",
      download: "Télécharger PDF",
      noInvoices: "Aucune facture disponible.",
    },
    tax: {
      year: "Année",
      type: "Type d'attestation",
      download: "Télécharger",
      noCertificates: "Aucune attestation fiscale disponible pour le moment.",
    },
  },
  login: {
    title: "Bon retour !",
    subtitle: "Connectez-vous pour gérer vos demandes de garde.",
    emailLabel: "Adresse Email",
    emailPlaceholder: "votre@email.com",
    sendOtp: "Envoyer le code",
    otpTitle: "Vérifiez votre email",
    otpSubtitle: "Nous avons envoyé un code à 6 chiffres à {email}",
    otpLabel: "Entrez le code",
    verify: "Vérifier et se connecter",
    resend: "Renvoyer le code",
    backToEmail: "Changer d'email",
    noAccount: "Pas encore de compte ?",
    startBooking: "Commencer une demande",
    existingAccount: "Déjà un compte ? Connectez-vous ici",
  },
  footer: {
    assistance: "Si vous avez besoin d'aide, contactez-nous via WhatsApp",
  },
  sitters: {
    amelie: {
      description:
        "Douce et créative, j'adore organiser des activités artistiques pour les enfants.",
      fullBio:
        "Je travaille comme babysitter depuis plus de 5 ans. Je suis actuellement étudiante en Éducation de la Petite Enfance. J'adore raconter des histoires, peindre et les jeux de plein air. Je suis certifiée en premiers secours et j'ai ma propre voiture.",
    },
    thomas: {
      description:
        "Énergique et patient, je me spécialise dans les jeux actifs et l'aide aux devoirs.",
      fullBio:
        "Avec 7 ans d'expérience, j'ai travaillé avec des enfants de tous âges. Ancien animateur de centre de vacances, j'adore le sport. Je peux aussi aider pour les devoirs de maths et de sciences. Je suis très fiable et ponctuel.",
    },
    chloe: {
      description:
        "Responsable et attentionnée, j'aime cuisiner des repas sains et raconter des histoires.",
      fullBio:
        "Je suis étudiante en soins infirmiers avec une passion pour la garde d'enfants. J'ai de l'expérience avec les nourrissons et les tout-petits. J'adore cuisiner et je peux préparer des collations et des repas sains. Je suis très attentive à la sécurité et à l'hygiène.",
    },
    lucas: {
      description: "Patient et musicien, je peux initier vos enfants au piano.",
      fullBio:
        "Je suis professeur de musique et babysitter à temps partiel. J'adore partager ma passion pour la musique avec les enfants. Je suis calme, patient et très organisé. J'ai de l'expérience avec les enfants de 4 à 12 ans.",
    },
    sophie: {
      description:
        "Nounou expérimentée axée sur les jeux éducatifs et le développement.",
      fullBio:
        "J'ai 10 ans d'expérience professionnelle en tant que nounou. Je me spécialise dans le développement de la petite enfance et les méthodes Montessori. Je parle couramment trois langues et j'adore enseigner le vocabulaire de base aux enfants.",
    },
    nicolas: {
      description:
        "Amusant et fiable, j'adore les expériences scientifiques et les tours de magie.",
      fullBio:
        "Je suis étudiant en sciences et j'adore rendre l'apprentissage amusant. Je peux faire des tours de magie simples et des expériences scientifiques que les enfants adorent. Je suis très énergique et j'apporte toujours une attitude positive.",
    },
  },
  contract: {
    title: "Contrat de Garde d'Enfant(s)",
    between: "ENTRE LES SOUSSIGNÉS",
    agency:
      "La société BLOOM BUDDIES BABYSITTING SAS, au capital de 1000 euros, ayant son siège social au 7 Rue Meyerbeer, 75009 Paris, immatriculée sous le numéro 885130682 au registre du commerce et des sociétés de Paris.",
    part1: "D'une part,",
    part2: "ET",
    domiciledAt: "domicilié au",
    reachableAt: "joignable au",
    clientDesignation: "Ci-après désignée le Client.",
    partOther: "D'autre part,",
    agreedFollowing: "Il a été convenu et arrêté ce qui suit :",
    article1: {
      title: "Article 1 - Objet du contrat",
      content:
        "Le présent contrat a pour objet la garde les enfants du Client selon l'emploi du temps suivant :",
      totalMonth: "Total pour {month} :",
      totalPeriod: "Nombre total d'heures (Période) :",
    },
    article2: {
      title: "Article 2 - Lieu d'exécution des prestations",
      content:
        "Les prestations objet du contrat seront principalement exécutées au domicile du Client. Cependant, il est convenu que l’intervenant pourra également se rendre aux endroits suivants, tels que la crèche, l'école, les cabinets médicaux, les centres musicaux, les centres sportifs ou tout autre lieu situé à proximité du domicile du Client et dans la même ville.",
    },
    article3: {
      title: "Article 3 - Durée et Engagement",
      content:
        "Le présent contrat est conclu pour une durée déterminée avec engagement ferme, du {start} au {end}.",
      subTitle: "3.1. Irrévocabilité de l'engagement",
      subContent:
        "Pendant cette période initiale, le contrat est ferme et définitif. Les parties s'interdisent toute résiliation unilatérale anticipée. Le contrat ne pourra être rompu avant son terme, sauf en cas de faute grave de l'une des parties ou de force majeure reconnue.",
    },
    article4: {
      title: "Article 4 - Tarification et Modalités de Paiement",
      content:
        "En contrepartie des prestations définies à l’Article 1 du présent contrat, le Client s’engage à verser au Prestataire la rémunération suivante :",
      period: "Période (Mois)",
      hrTotal: "Hr total",
      amountTtc: "Montant (TTC)",
      hourlyRate: "Taux Horaire :",
      taxNote: "* Tarifs avant déduction fiscale ou crédit d’impôt.",
    },
    actions: {
      accept: "Accepter",
      refuse: "Refuser",
      slide: "Glisser pour accepter",
      back: "Retour au profil",
      success: "Contrat accepté avec succès !",
      loading: "Chargement des détails du contrat...",
    },
    article5: {
      title: "Article 5 - Pénalités",
      content:
        "En cas de retard de paiement, l'intégralité des prélèvements restants pourra être exigée immédiatement.",
    },
    article18: {
      title: "Article 18 - Accords privés",
      content:
        "Le client s'engage à ne pas traiter en direct avec la baby-sitter en contournant Bloom Buddies.",
    },
    signatureLocationDate: "Fait à Paris, le {date}",
    electronicSignature: "Signature électronique sécurisée",
  },
};
