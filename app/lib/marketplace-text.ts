export interface MarketplaceTexts {
  locale: "de";
  sidebar: {
    sections: {
      platform: string;
      admin: string;
      help: string;
    };
    nav: {
      marketplace: string;
      addons: string;
      useCases: string;
      installed: string;
      data: string;
      dataSets: string;
      dataSources: string;
      dataStructures: string;
      tenantManagement: string;
      docs: string;
      breadcrumbCatalog: string;
      breadcrumbUseCases: string;
    };
  };
  catalog: {
    heading: string;
    subtitle: string;
    countLabel: string;
    noResults: string;
    addonCountUnit: string;
    backToCatalog: string;
  };
  landing: {
    heading: string;
    subtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    useCasesHeading: string;
    allUseCases: string;
    addonsTitle: string;
    useCasesHint: string;
    addonsHint: string;
    dataStructuresHint: string;
    stepsHeading: string;
    steps: { title: string; body: string }[];
    recentHeading: string;
    contributeTitle: string;
    contributeBody: string;
    contributeCta: string;
  };
  useCases: {
    heading: string;
    subtitle: string;
    noResults: string;
    countLabel: string;
    searchPlaceholder: string;
    installQuestions: string;
    includedArtifacts: string;
    datasetReference: string;
    backToCatalog: string;
    emptyInstalled: string;
    installedHeading: string;
    installedSubtitle: string;
    detailsHeading: string;
    installPathLabel: string;
    compatibilityLabel: string;
    artifactsLabel: string;
    sourceLabel: string;
    installHeading: string;
    installDescription: string;
    aboutHeading: string;
    publisherLabel: string;
    technicalHeading: string;
  };
  detail: {
    createInstallPr: string;
    installPrHint: string;
    openRepository: string;
    installPathLabel: string;
    addonLicense: string;
    toolLicense: string;
    deploymentLabel: string;
    coreVersionsLabel: string;
    categories: string;
    compatibility: string;
    branch: string;
    updated: string;
    readme: string;
    readmeEmpty: string;
    installation: string;
    installationHint: string;
    requiredCapabilities: string;
    noCapabilities: string;
    repository: string;
    details: string;
    publisher: string;
    addonKindLabel: string;
    integration: {
      heading: string;
      ssoTitle: string;
      ssoBody: string;
      restTitle: string;
      restBody: string;
    };
  };
  placeholders: {
    addonsCount: string;
    useCasesCount: string;
  };
  common: {
    signInHint: string;
    signInButton: string;
    connected: string;
    notAvailable: string;
    comingSoon: string;
  };
}

const MARKETPLACE_TEXT_DE: Omit<MarketplaceTexts, "locale"> = {
  sidebar: {
    sections: {
      platform: "Plattform",
      admin: "Admin",
      help: "Hilfe",
    },
    nav: {
      marketplace: "Marktplatz",
      addons: "Add-ons",
      useCases: "Anwendungsfälle",
      installed: "Installiert",
      data: "Unsere Daten",
      dataSets: "Datensätze",
      dataSources: "Datenquellen",
      dataStructures: "Datenstrukturen",
      tenantManagement: "Mandantenverwaltung",
      docs: "Dokumentation",
      breadcrumbCatalog: "Katalog",
      breadcrumbUseCases: "Anwendungsfälle",
    },
  },
  catalog: {
    heading: "Add-on Katalog",
    subtitle:
      "Zentrale Komponenten, Adapter und Tools für deinen CivitasCore Cluster finden und installieren.",
    countLabel: "von",
    noResults: "Keine Add-ons für die aktuelle Suche gefunden.",
    addonCountUnit: "Add-ons",
    backToCatalog: "Zurück zum Katalog",
  },
  landing: {
    // The title says what you do here; the lead starts from the reader's own
    // problem or idea and says what this place is for (Ewa, 2026-10-03: more
    // interesting than a definition, but open to any topic - two named
    // examples made it sound like a two-item catalog); the steps say how.
    // Not only communes: utilities and water boards adopt solutions too.
    heading: "Lösungen aus der Community nachnutzen",
    subtitle:
      "Sie wollen ein Problem lösen oder eine Idee umsetzen? Gut möglich, dass eine Kommune, ein Stadtwerk oder ein Wasserverband dafür schon eine Lösung auf CIVITAS/CORE gebaut hat. Die übernehmen Sie hier als Nachnutzende, statt neu zu bauen.",
    searchPlaceholder: "Was möchten Sie lösen? z. B. Verkehr rund um den Bahnhof …",
    searchButton: "Suchen",
    useCasesHeading: "Anwendungsfälle",
    allUseCases: "Alle Anwendungsfälle",
    addonsTitle: "Add-ons",
    // One line per menu section, each saying what the thing is and how it
    // relates to the use cases — the three sections are one system.
    // Kept to two lines at panel width, so the three panels start their
    // lists at the same height.
    useCasesHint: "Fertige Lösungen für eine Aufgabe - samt der nötigen Datenstrukturen.",
    addonsHint: "Zusätzliche Werkzeuge für Ihre Instanz - die Einrichtung übernimmt Ihr Betreiber.",
    dataStructuresHint: "Gemeinsame Datenformate - damit Lösungen zu Ihren Daten passen.",
    // The steps name what the reader meets later: the „Nachnutzen" button,
    // the demo-data choice in its dialog, the switch to an own data source.
    // Demo data is conditional on purpose — not every entry ships it.
    stepsHeading: "So funktioniert’s",
    steps: [
      {
        title: "Finden",
        body: "Jeder Eintrag zeigt, wer ihn betreibt, was er kostet und wo er schon im Einsatz ist.",
      },
      {
        title: "Nachnutzen",
        body: "Die Lösung wird in Ihrer eigenen Instanz eingerichtet. Bringt sie Demo-Daten mit, läuft sie sofort, noch ohne eigene Daten.",
      },
      {
        title: "Eigene Daten anschließen",
        body: "Passt die Lösung, stellen Sie auf Ihre eigenen Daten um. Wenn nicht, entfernen Sie sie wieder.",
      },
    ],
    recentHeading: "Zuletzt hinzugefügt",
    contributeTitle: "Eigene Lösung teilen",
    // Answers the provider's real worry (leaking secrets, local settings)
    // instead of describing the packaging work.
    contributeBody:
      "Läuft bei Ihnen etwas, das anderen helfen würde? Zugangsdaten und lokale Einstellungen bleiben beim Teilen automatisch bei Ihnen.",
    contributeCta: "Beitrag vorbereiten",
  },
  useCases: {
    heading: "Anwendungsfälle",
    subtitle:
      "Wiederverwendbare Use Cases. Die Installation stellt den Anwendungsfall über das CivitasCore Portal-Backend bereit: Der DataSet-Lebenszyklus löst die Provisionierung (FROST-Projekt, APISIX-Route, NiFi-Pipeline) aus.",
    noResults: "Keine Anwendungsfälle für die aktuelle Suche gefunden.",
    countLabel: "von",
    searchPlaceholder: "Anwendungsfall suchen …",
    installQuestions: "Installationsfragen",
    includedArtifacts: "Enthaltene Artefakte",
    datasetReference: "Referenzierter CORE-Datensatz",
    backToCatalog: "Zurück zu den Anwendungsfällen",
    emptyInstalled: "Es wurden noch keine Anwendungsfälle installiert.",
    installedHeading: "Installierte Anwendungsfälle",
    installedSubtitle:
      "Diese Liste zeigt die über das Portal-Backend bereitgestellten Anwendungsfälle inklusive Provisionierungsprotokoll und aktuellem Lebenszyklus-Status.",
    detailsHeading: "Details",
    installPathLabel: "Installationsweg",
    compatibilityLabel: "Kompatibilität",
    artifactsLabel: "Artefakte",
    sourceLabel: "Quelle",
    installHeading: "Installieren",
    installDescription:
      "Stellt den Anwendungsfall über das CivitasCore Portal-Backend bereit. Der DataSet-Lebenszyklus (stage → release) löst die Provisionierung der Infrastruktur aus.",
    aboutHeading: "Was dieser Anwendungsfall löst",
    publisherLabel: "Herausgeber",
    technicalHeading: "Technische Details",
  },
  detail: {
    createInstallPr: "Create Install PR for my cluster",
    installPrHint:
      "Erzeugt einen Pull Request im Deployment-Repository der Instanz - die Installation führt der Betreiber aus.",
    openRepository: "Open repository",
    installPathLabel: "Installationsweg",
    addonLicense: "Add-on Lizenz",
    toolLicense: "Tool Lizenz",
    deploymentLabel: "Deployment",
    coreVersionsLabel: "Core-Versionen",
    categories: "Kategorien",
    compatibility: "Kompatibilität",
    branch: "Branch",
    updated: "Aktualisiert",
    readme: "README",
    readmeEmpty: "Für dieses Add-on wurde noch keine README hinterlegt.",
    installation: "Installation",
    installationHint:
      "Klone das Add-on in das Deployment-Repository und aktiviere es in deinem Inventory.",
    requiredCapabilities: "Benötigte Capabilities",
    noCapabilities: "Keine besonderen Anforderungen.",
    repository: "Repository",
    details: "Details",
    publisher: "Herausgeber",
    addonKindLabel: "Add-on · Web-App",
    integration: {
      heading: "Integration in CIVITAS/CORE",
      ssoTitle: "Single-Sign-On",
      ssoBody: "Anmeldung über Keycloak – dieselben Nutzer:innen und Rollen wie im Core.",
      restTitle: "REST & Webhooks",
      restBody: "API-Aufrufe und Webhook-Registrierungen für den Datenaustausch.",
    },
  },
  placeholders: {
    addonsCount: "Noch keine Add-ons verfügbar.",
    useCasesCount: "Noch keine Anwendungsfälle verfügbar.",
  },
  common: {
    signInHint: "Bitte melde dich an, um den AppStore zu nutzen.",
    signInButton: "Mit Civitas Login anmelden",
    connected: "Verbunden",
    notAvailable: "—",
    comingSoon: "Kommt bald.",
  },
};

export function getMarketplaceText(): MarketplaceTexts {
  return {
    locale: "de",
    ...MARKETPLACE_TEXT_DE,
  };
}
