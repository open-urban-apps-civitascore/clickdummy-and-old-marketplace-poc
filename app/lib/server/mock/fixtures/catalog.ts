import { repoListIndexSchema, type RepoListIndex } from "@/types/repo-list";

/**
 * Mock catalog fixture — the real repo-list `index.json`
 * (civitas-marketplace-catalog, v1.3.1) **plus local enrichment**, so the mock
 * UI can exercise screens the published catalog has no data for yet. Parsed
 * through the real zod schema at module load: if the fixture ever drifts from
 * the schema, the app fails loudly, not subtly.
 *
 * The enrichment is the optional blocks `trust`, `requirements`, `provides`,
 * `roles`, `implementation`, `adopters`, `addedAt`, `updatedAt` and
 * `softwareUpdatedAt`, the whole `dataStructures`, `organisations` and `groups`
 * sections, three invented described-only use cases (no package),
 * plus the trust vocabulary `curationTier` / `deprecated` and the fact
 * `transferability` — see
 * `types/use-cases.ts`, `types/implementation.ts` and `types/curation-tier.ts`.
 * They are NOT in the published index.json yet, because nothing authors or
 * curates them so far.
 *
 * `implementation` (Kosten, Aufwand, Wirkungslogik, Beteiligte) and `adopters`
 * (Nachnutzer) are INVENTED, like the municipalities they describe —
 * Musterstadt, Musterhausen, Musterbach, Beispielhausen and Exempeldorf do not
 * exist. Nothing here may be read as a claim about a real commune; the
 * contact addresses use the reserved `.example` domain for the same reason.
 * Everything else here is verbatim (incl. the legacy `maturity` /
 * `installability` fields, which the schema still accepts and normalizes).
 *
 * Regenerate: copy the current index.json content into RAW_INDEX (keep `$schema`
 * out) and re-apply the enrichment blocks.
 */
const RAW_INDEX = {
  "version": "1.3.1",
  "updatedAt": "2026-07-19T12:00:00Z",
  "addons": [
    {
      "id": "nodered-addon",
      "addedAt": "2026-06-11",
      "name": "NodeRed",
      "description": "Flow-based programming for the Internet of Things",
      "author": "bonn-624-dev",
      "curationTier": "community",
      "categories": [
        "Integration",
        "IoT",
        "Automation"
      ],
      "repository": "https://gitlab.com/bonn-624-dev/platform/nodered_addon",
      "images": [
        {
          "url": "https://placehold.co/1600x900/e8eef7/3a5a7d.png?text=Platzhalter%0ADer+Flow-Editor+im+Betrieb",
          "caption": "Der Flow-Editor im Betrieb",
          "highlights": [
            "Flows verbinden Sensoren, APIs und Datenbanken per Drag & Drop",
            "Änderungen werden ohne Neustart übernommen",
            "Debug-Ansicht zeigt Nachrichten in Echtzeit"
          ]
        },
        {
          "url": "https://placehold.co/1600x900/eef2f7/5a6b7d.png?text=Platzhalter%0AIm+CIVITAS%2FCORE-Portal",
          "caption": "Das Add-on in der eigenen Instanz",
          "highlights": [
            "Anmeldung über Keycloak — dieselben Nutzer:innen wie im Core",
            "Zugriff auf Plattformdaten über die REST-Schnittstelle"
          ]
        }
      ],
      "trust": {
        "maintainer": {
          "name": "bonn-624-dev",
          "contactUrl": "https://gitlab.com/bonn-624-dev"
        },
        "curatedBy": "Civitas Connect e. V.",
        "curatedAt": "2026-07-19",
        "license": "EUPL-1.2"
      },
      "compatibility": [
        {
          "coreVersion": "2.0"
        },
        {
          "coreVersion": "2.1"
        }
      ],
      "deploymentRef": {
        "type": "git",
        "url": "https://gitlab.com/bonn-624-dev/platform/nodered_addon",
        "path": "addons/nodered_addon"
      }
    },
    {
      "id": "airflow-addon",
      "addedAt": "2026-04-03",
      "name": "Apache Airflow",
      "description": "Platform to programmatically author, schedule and monitor workflows",
      "author": "bonn-624-dev",
      "categories": [
        "Workflow",
        "Analytics",
        "ETL"
      ],
      "repository": "https://gitlab.com/bonn-624-dev/platform/airflow_addon",
      "curationTier": "community",
      "licenses": {
        "addon": "European Union Public License 1.2",
        "tool": "Apache License 2.0"
      },
      "compatibility": [
        {
          "coreVersion": "2.0",
          "branch": "main",
          "lastUpdated": "2026-05-20T11:05:19+02:00"
        }
      ],
      "requiredCapabilities": [
        "KEYCLOAK",
        "APISIX_INGRESS"
      ],
      "deploymentRef": {
        "type": "git",
        "url": "https://gitlab.com/bonn-624-dev/platform/airflow_addon",
        "path": "addons/airflow_addon"
      }
    },
    {
      "id": "minio-addon",
      "addedAt": "2026-03-18",
      "name": "MinIO",
      "description": "High Performance Object Storage",
      "author": "bonn-624-dev",
      "categories": [
        "Storage",
        "S3",
        "Object Storage"
      ],
      "repository": "https://gitlab.com/bonn-624-dev/platform/minio_addon",
      "licenses": {
        "tool": "GNU Affero General Public License v3.0"
      },
      "compatibility": [
        {
          "coreVersion": "2.0",
          "branch": "main",
          "lastUpdated": "2025-06-26T08:52:07+00:00"
        },
        {
          "coreVersion": "2.1",
          "branch": "devel-v2.1",
          "lastUpdated": "2025-11-29T02:26:25+01:00"
        }
      ],
      "deploymentRef": {
        "type": "git",
        "url": "https://gitlab.com/bonn-624-dev/platform/minio_addon",
        "path": "addons/minio_addon"
      }
    },
    {
      "id": "appsmith-addon",
      "addedAt": "2026-09-08",
      "name": "Appsmith",
      "description": "Build internal tools, CRUD apps and dashboards",
      "author": "bonn-624-dev",
      "categories": [
        "Low-Code",
        "Dashboard",
        "Frontend"
      ],
      "repository": "https://gitlab.com/bonn-624-dev/platform/appsmith_addon",
      "curationTier": "community",
      "licenses": {
        "addon": "European Union Public License 1.2",
        "tool": "Apache License 2.0"
      },
      "compatibility": [
        {
          "coreVersion": "2.0",
          "branch": "main",
          "lastUpdated": "2026-05-20T11:10:22+02:00"
        },
        {
          "coreVersion": "2.1",
          "branch": "devel-v2.1",
          "lastUpdated": "2025-11-29T02:26:37+01:00"
        }
      ],
      "requiredCapabilities": [
        "APISIX_INGRESS"
      ],
      "deploymentRef": {
        "type": "git",
        "url": "https://gitlab.com/bonn-624-dev/platform/appsmith_addon",
        "path": "addons/appsmith_addon"
      }
    },
    {
      "id": "hasura-addon",
      "addedAt": "2026-02-26",
      "name": "Hasura",
      "description": "Instant GraphQL APIs on your data",
      "author": "bonn-624-dev",
      "categories": [
        "GraphQL",
        "API",
        "Database"
      ],
      "repository": "https://gitlab.com/bonn-624-dev/platform/hasura_addon",
      "compatibility": [
        {
          "coreVersion": "2.1"
        }
      ],
      "deploymentRef": {
        "type": "git",
        "url": "https://gitlab.com/bonn-624-dev/platform/hasura_addon",
        "path": "addons/hasura_addon"
      }
    },
    {
      "id": "supabase-addon",
      "addedAt": "2026-08-19",
      "name": "Supabase",
      "description": "Open source Firebase alternative",
      "author": "tsb-udp",
      "categories": [
        "Database",
        "Authentication",
        "Storage"
      ],
      "repository": "https://gitlab.com/tsb-udp/supabase_addon",
      "licenses": {
        "tool": "Apache License 2.0"
      },
      "compatibility": [
        {
          "coreVersion": "2.0",
          "branch": "main",
          "lastUpdated": "2025-10-15T18:52:19+02:00"
        }
      ],
      "deploymentRef": {
        "type": "git",
        "url": "https://gitlab.com/tsb-udp/supabase_addon",
        "path": "addons/supabase_addon"
      }
    },
    {
      "id": "outline-addon",
      "addedAt": "2026-01-15",
      "name": "Outline",
      "description": "Wiki and knowledge base for growing teams",
      "author": "bonn-624-dev",
      "categories": [
        "Documentation",
        "Wiki",
        "Knowledge Base"
      ],
      "repository": "https://gitlab.com/bonn-624-dev/platform/outline_addon",
      "compatibility": [
        {
          "coreVersion": "2.0"
        },
        {
          "coreVersion": "2.1"
        }
      ],
      "deploymentRef": {
        "type": "git",
        "url": "https://gitlab.com/bonn-624-dev/platform/outline_addon",
        "path": "addons/outline_addon"
      }
    },
    {
      "id": "opensearch-addon",
      "addedAt": "2026-07-24",
      "name": "OpenSearch",
      "description": "Open source distributed search & analytics suite",
      "author": "bonn-624-dev",
      "categories": [
        "Search",
        "Analytics",
        "Logging"
      ],
      "repository": "https://gitlab.com/bonn-624-dev/platform/opensearch_addon",
      "compatibility": [
        {
          "coreVersion": "2.0"
        }
      ],
      "deploymentRef": {
        "type": "git",
        "url": "https://gitlab.com/bonn-624-dev/platform/opensearch_addon",
        "path": "addons/opensearch_addon"
      }
    },
    {
      "id": "geonetwork-addon",
      "addedAt": "2026-05-06",
      "name": "GeoNetwork",
      "description": "Catalog application to manage spatially referenced resources",
      "author": "bonn-624-dev",
      "deprecated": {
        "reason": "Wird nicht mehr gepflegt — Metadaten-Kataloge werden künftig über die Plattform selbst bereitgestellt."
      },
      "categories": [
        "GIS",
        "Metadata",
        "Catalog"
      ],
      "repository": "https://gitlab.com/bonn-624-dev/platform/geonetwork_addon",
      "compatibility": [
        {
          "coreVersion": "2.0"
        }
      ],
      "deploymentRef": {
        "type": "git",
        "url": "https://gitlab.com/bonn-624-dev/platform/geonetwork_addon",
        "path": "addons/geonetwork_addon"
      }
    }
  ],
  "useCases": [
    {
      "id": "tree-register-starter",
      "transferability": "direct",
      "addedAt": "2026-08-28",
      "updatedAt": "2026-09-02",
      "softwareUpdatedAt": "2026-09-30",
      "implementation": {
        "status": "prototyp",
        "operator": "Stadt Musterstadt",
        "operatorOrg": "musterstadt",
        "parties": {
          "stakeholders": [
            "Grünflächenamt Musterstadt",
            "Bauhof Musterstadt"
          ]
        },
        "stack": [
          "CivitasCore Portal-Backend",
          "PostGIS",
          "GeoServer"
        ],
        "resources": {
          "cost": "S, unter 1.000 Euro",
          "effort": "S, unter 10 Tage",
          "costBand": "s",
          "setupCost": "s",
          "runningCost": "s",
          "effortBand": "s",
          "funding": "Haushaltsmittel der Stadt Musterstadt",
          "note": "Ohne eigene Sensorik: die Kosten decken das Anlegen der Datenstruktur und die Ersterfassung des Bestands, nicht die Pflege im Feld."
        },
        "logicModel": {
          "input": "Vorhandene Baumliste aus dem Grünflächenamt, ein Nachmittag Abstimmung über die Felder, kein zusätzliches Personal.",
          "output": "Ein gemeinsamer Baumkataster-Datensatz mit Kartenansicht und Auskunftsseite.",
          "outcome": "Bauhof und Grünflächenamt arbeiten auf demselben Stand statt auf zwei getrennten Tabellen.",
          "impact": "Baumbestand und Pflegezustand werden für Verwaltung und Öffentlichkeit nachvollziehbar."
        },
        "collaboration": {
          "wanted": true,
          "seeking": "Kommunen, die ihren Baumbestand nach demselben Schema erfassen wollen - gemeinsame Weiterentwicklung der Datenstruktur."
        }
      },
      "links": [
        {
          "title": "Feldbeschreibung Baumkataster",
          "url": "https://musterstadt.example/smart-city/baumkataster/felder",
          "description": "Welche Angaben ein Baumeintrag hat und woher sie im Grünflächenamt kommen."
        }
      ],
      "title": "Baumkataster Starter App",
      "summary": "Ein kleines, wiederverwendbares Starterpaket für einen kommunalen Baumkataster-Datensatz.",
      "description": "Dieser Demo-Anwendungsfall installiert einen einfachen CORE-Datensatz inklusive einer Datenstruktur für Baumeinträge über das CivitasCore Portal-Backend. Er dient als prototypischer Installationsfluss im Marketplace Add-on.",
      "publisher": "Stadt Musterstadt",
      "categories": [
        "Umwelt & Klima"
      ],
      "curationTier": "experimental",
      "maturity": "prototype",
      "installability": "direct",
      "compatibility": [
        "2.0",
        "2.1"
      ],
      "requiredCapabilities": [
        "PORTAL_BACKEND"
      ],
      "installQuestions": [
        "Welche Fachabteilung soll den Datensatz später übernehmen?"
      ],
      "includedArtifacts": [
        {
          "id": "urn:core:platform:civitas:dataset:common:Baumkataster-Starter:1.0.0",
          "title": "Tree Register Starter",
          "kind": "dataset",
          "description": "Ein CORE-Datensatz für kommunale Baumeinträge."
        },
        {
          "id": "urn:core:platform:civitas:datastructure:demo:TreeRecord:1.0.0",
          "title": "TreeRecord",
          "kind": "datastructure",
          "description": "Minimale JSON-Schema-Datenstruktur für einen Baumdatensatz.",
          "requires": [
            {
              "label": "Vorhandener Baumbestand als Liste",
              "note": "Export aus dem Fachverfahren oder eine gepflegte Tabelle mit Standort und Art."
            }
          ]
        }
      ],
      "modelForge": {
        "datasetId": "urn:core:platform:civitas:dataset:common:Baumkataster-Starter:1.0.0",
        "note": "Beim Installieren legt der Marketplace die Artefakte (DataStructure + DataSet) über das CivitasCore Portal-Backend an, falls sie noch nicht existieren, und durchläuft den DataSet-Lebenszyklus (stage → release)."
      },
      "deploymentRef": {
        "url": "https://gitlab.com/civitascore-openurbanapps/commune-musterbach-kiez-baumkataster",
        "ref": "2d7b7fd3f4e675bf85c321dd43699c4ed6fcc286",
        "releaseTag": "v2.2.0",
        "path": "."
      },
      "trust": {
        "maintainer": { "name": "Stadt Musterstadt" },
        "contactPerson": {
          "name": "Team Smart City",
          "role": "Stadt Musterstadt",
          "email": "smartcity@musterstadt.example"
        },
        "license": "EUPL-1.2"
      },
      "requirements": {
        "coreVersions": ["2.0", "2.1"],
        "components": ["PORTAL_BACKEND", "POSTGIS", "GEOSERVER"],
        "connectors": []
      },
      "endUserSurfaces": [
        {
          "kind": "masterportal",
          "label": "Baumkataster im Stadtplan",
          "summary": "Bürgerinnen finden den Baum vor ihrer Tür, sehen Art, Pflanzjahr und Kronendurchmesser per Klick.",
          "requiresAddon": "Geoportal",
          "via": "OWS-Route /karte",
          "urlTemplate": "https://geoportal.musterstadt.de/?layers={datasetId}"
        },
        {
          "kind": "chatbot",
          "label": "Baum-Auskunft",
          "summary": "„Wann wurde die Linde am Hansaplatz gepflanzt?\" — der Assistent beantwortet Anfragen aus dem Kataster in Alltagssprache.",
          "requiresAddon": "Chatbot",
          "via": "WFS-Route dieses Datensatzes"
        },
        {
          "kind": "app",
          "label": "Baumpaten-App",
          "summary": "Anwohnerinnen übernehmen Gießpatenschaften und melden Schäden — eine schlanke Web-App auf denselben Daten.",
          "via": "API-Route dieses Datensatzes"
        }
      ],
      "provides": [
        {
          "kind": "map",
          "label": "Baumstandorte als Kartenebene",
          "standard": "WFS",
          "note": "Geo-Pfad — Baumkataster sind Geodaten, keine Zeitreihe."
        },
        {
          "kind": "download",
          "label": "Baumbestand als Datenexport",
          "note": "Für die Weitergabe an Fachverfahren und Open-Data-Portale."
        }
      ],
      "roles": []
    },
    {
      "id": "musterhausen-trafficcounter",
      "transferability": "tailored",
      "addedAt": "2026-07-02",
      "updatedAt": "2026-09-18",
      "softwareUpdatedAt": "2026-10-08",
      "adopters": [
        { "name": "Gemeinde Musterbach", "stage": "produktiv", "since": "2026" },
        { "name": "Stadt Beispielhausen", "stage": "pilot", "since": "2026" },
        { "name": "Stadtwerke Exempeldorf", "stage": "pilot", "since": "2026" }
      ],
      "implementation": {
        "status": "produktiv",
        "operator": "Stadt Musterhausen",
        "operatorOrg": "musterhausen",
        "parties": {
          "stakeholders": [
            "Tiefbauamt Musterhausen",
            "Verkehrsplanung Musterhausen"
          ],
          "serviceProviders": [
            "Stadtwerke Musterhausen (Betrieb des LoRaWAN-Netzes)"
          ]
        },
        "stack": [
          "Dialog-Displays",
          "MQTT",
          "FROST-Server",
          "NiFi",
          "Superset"
        ],
        "resources": {
          "cost": "M, unter 10.000 Euro",
          "effort": "M, unter 50 Tage",
          "costBand": "m",
          "setupCost": "m",
          "runningCost": "s",
          "effortBand": "m",
          "funding": "Haushaltsmittel, ergänzt aus einem Förderprogramm für kommunale Mobilität",
          "note": "Aufbau enthält Hardware und Montage der Dialog-Displays; laufend bleiben Mobilfunk, Wartung und Datenpflege."
        },
        "logicModel": {
          "input": "Zwölf Dialog-Displays, Anbindung ans LoRaWAN-Netz der Stadtwerke, Einrichtung der Datenstrecke, Personal aus Tiefbauamt und Verkehrsplanung.",
          "output": "Ein Dashboard mit Fahrzeugzahlen und Geschwindigkeiten je Zählstelle sowie eine öffentliche Karte der Standorte.",
          "outcome": "Die Verkehrsplanung diskutiert Tempo-30-Anträge mit Messwerten statt mit Schätzungen aus der Bürgerschaft.",
          "impact": "Entscheidungen über Verkehrsberuhigung werden begründbar und im Rat nachvollziehbar."
        },
        "collaboration": {
          "wanted": false
        }
      },
      "title": "Verkehrszählung Musterhausen",
      "summary": "Verkehrszählung über Dialog-Displays: Fahrzeugzahlen und Geschwindigkeiten je Zählstelle als wiederverwendbares Use-Case-Paket.",
      "description": "Die Stadt Musterhausen erfasst mit Dialog-Displays (Smiley-Tafeln) Fahrzeugzahlen und Durchschnittsgeschwindigkeiten. Dieser Use-Case installiert die Datenstrukturen und den Datensatz dafür über das CivitasCore Portal-Backend. Die Artefakt-Quelle liegt in einem eigenen Git-Repo (siehe source); der Marketplace installiert direkt aus diesem Repo.",
      "publisher": "Stadt Musterhausen",
      "categories": [
        "Mobilität & Verkehr"
      ],
      "curationTier": "verified",
      "maturity": "prototype",
      "installability": "direct",
      "compatibility": [
        "2.0",
        "2.1"
      ],
      "requiredCapabilities": [
        "PORTAL_BACKEND"
      ],
      "installQuestions": [
        "Welche Zählstellen-Standorte sollen initial erfasst werden?"
      ],
      "includedArtifacts": [
        {
          "id": "urn:core:platform:civitas:dataset:common:TrafficCounter-Musterhausen:1.0.0",
          "title": "TrafficCounter Musterhausen",
          "kind": "dataset",
          "description": "Datensatz für die Verkehrszählung der Stadt Musterhausen."
        },
        {
          "id": "urn:core:platform:civitas:datastructure:mobility:TrafficCounterReading:1.0.0",
          "title": "TrafficCounterReading",
          "kind": "datastructure",
          "description": "Eine Zählstellen-Messung: Fahrzeuganzahl, Geschwindigkeit, Richtung, Standort.",
          "requires": [
            {
              "label": "Dialog-Displays mit Datenausgang",
              "note": "Smiley-Tafeln, die Zählwerte per MQTT melden können — z. B. Modelle mit Mobilfunkmodul."
            },
            {
              "label": "Standortliste der Zählstellen",
              "note": "Koordinaten je Messpunkt, einmalig aus dem Tiefbauamt."
            }
          ]
        },
        {
          "id": "urn:core:platform:civitas:datastructure:common:GeoPoint:1.0.0",
          "title": "GeoPoint",
          "kind": "datastructure",
          "description": "Geokoordinate (lat/lon), gemeinsam genutztes Plattform-Element."
        }
      ],
      "deploymentRef": {
        "url": "https://gitlab.com/civitascore-openurbanapps/commune-musterhausen-trafficcounter",
        "ref": "b95660bc21b90c67f13bae25ef8452c9a8293227",
        "releaseTag": "v2.2.0",
        "path": "."
      },
      "demoData": {
        "contains": "eine Woche Zähldaten von drei Standorten",
        "note": "Die Beispieldaten laufen über eine vorkonfigurierte Quelle - Ihre eigenen Displays binden Sie später an, ohne neu zu installieren."
      },
      "images": [
        {
          "url": "/dashboard-platzhalter.png",
          "caption": "Das Dashboard im Betrieb",
          "highlights": [
            "Wochenverlauf der Fahrzeugzahlen je Zählstelle",
            "Tagesspitzen morgens und nachmittags klar erkennbar",
            "Durchschnittsgeschwindigkeit je Messpunkt als zweite Kurve",
            "Diese Ansicht zeigt die Kommune dem Rat"
          ]
        }
      ],
      "trust": {
        "maintainer": {
          "name": "Stadt Musterhausen",
          "contactUrl": "https://gitlab.com/civitascore-openurbanapps/commune-musterhausen-trafficcounter"
        },
        "contactPerson": {
          "name": "Sabine Becker",
          "role": "Amt für Digitalisierung",
          "email": "s.becker@musterhausen.example"
        },
        "curatedBy": "Civitas Connect e. V.",
        "curatedAt": "2026-07-19",
        "license": "EUPL-1.2"
      },
      "requirements": {
        "coreVersions": ["2.0", "2.1"],
        "components": ["PORTAL_BACKEND", "FROST", "NIFI"],
        "connectors": ["MQTT"]
      },
      "endUserSurfaces": [
        {
          "kind": "superset",
          "label": "Verkehrsaufkommen je Zählstelle",
          "summary": "Wochenverlauf, Tagesspitzen, Vergleich der Standorte — die Ansicht für Fachamt und Rat.",
          "requiresAddon": "Superset",
          "via": "Zeitreihen-API dieses Datensatzes",
          "urlTemplate": "https://superset.musterstadt.de/dashboard/verkehr-{datasetId}"
        },
        {
          "kind": "masterportal",
          "label": "Zählstellen auf der Stadtkarte",
          "summary": "Wo gemessen wird und wie stark — Standorte mit aktuellen Werten im Klick-Overlay.",
          "requiresAddon": "Geoportal",
          "via": "OWS-Route /karte"
        },
        {
          "kind": "grafana",
          "label": "Zählstellen-Betriebsmonitor",
          "summary": "Liefert jede Zählstelle noch Daten? Ausfälle und Lücken fallen sofort auf.",
          "requiresAddon": "Grafana",
          "via": "Zeitreihen-API dieses Datensatzes"
        }
      ],
      "provides": [
        {
          "kind": "api",
          "label": "Zählwerte als Zeitreihen-API",
          "standard": "STA",
          "urlTemplate": "https://api.civitas.musterstadt.de/datasets/{datasetId}/Datastreams",
          "note": "SensorThings-API — mit Standardwerkzeugen abfragbar, ohne Export."
        },
        {
          "kind": "dashboard",
          "label": "Verkehrsaufkommen je Zählstelle",
          "standard": "Superset",
          "note": "Wochenverlauf und Tagesspitzen — die Ansicht, die dem Rat gezeigt wird."
        },
        {
          "kind": "map",
          "label": "Zählstellen auf der Stadtkarte",
          "standard": "WMS",
          "note": "Standorte der Dialog-Displays als Kartenebene."
        }
      ],
      "roles": [
        {
          "key": "verkehr-datenpflege",
          "label": "Datenpflege Verkehr",
          "description": "Darf Zählstellen anlegen und Messwerte korrigieren.",
          "permissions": ["DATASET_UPDATE", "DATASET_PAYLOAD_UPDATE"]
        },
        {
          "key": "verkehr-freigabe",
          "label": "Freigabe Verkehr",
          "description": "Darf den Datensatz veröffentlichen — bewusst getrennt von der Pflege.",
          "permissions": ["DATASET_READ", "DATASET_RELEASE"]
        }
      ],
      "modelForge": {
        "datasetId": "urn:core:platform:civitas:dataset:common:TrafficCounter-Musterhausen:1.0.0",
        "note": "Beim Installieren legt der Marketplace die Artefakte (GeoPoint, TrafficCounterReading, DataSet) über das CivitasCore Portal-Backend an, falls sie noch nicht existieren. GeoPoint wird wiederverwendet, wenn es bereits existiert."
      }
    },
    {
      "id": "musterhausen-feinstaub",
      "transferability": "direct",
      "addedAt": "2026-05-20",
      "updatedAt": "2026-10-06",
      "softwareUpdatedAt": "2026-06-03",
      "adopters": [
        { "name": "Stadt Beispielhausen", "stage": "produktiv", "since": "2026" }
      ],
      "links": [
        {
          "title": "Messwerte als offene Daten",
          "url": "https://opendata.musterhausen.example/feinstaub",
          "description": "Alle Messwerte seit 2025 zum Herunterladen, stündlich aktualisiert."
        },
        {
          "title": "Bauanleitung für die Sensoren",
          "url": "https://musterhausen.example/digitales/feinstaub/bauanleitung",
          "description": "Teile, Kosten und Aufbau der Messstationen, wie das Umweltamt sie nutzt."
        }
      ],
      "implementation": {
        "status": "produktiv",
        "operator": "Stadt Musterhausen",
        "operatorOrg": "musterhausen",
        "parties": {
          "stakeholders": [
            "Umweltamt Musterhausen"
          ]
        },
        "stack": [
          "Feinstaub-Sensorik",
          "MQTT",
          "FROST-Server",
          "NiFi",
          "Superset"
        ],
        "resources": {
          "cost": "S, unter 1.000 Euro",
          "effort": "S, unter 10 Tage",
          "costBand": "s",
          "setupCost": "s",
          "runningCost": "s",
          "effortBand": "s",
          "funding": "Haushaltsmittel der Stadt Musterhausen",
          "note": "Die Messstationen waren bereits vorhanden; abgebildet ist nur der Aufwand, sie an die Plattform anzubinden."
        },
        "logicModel": {
          "input": "Bestehende Messstationen, Anbindung über MQTT, wenige Tage Einrichtung im Umweltamt.",
          "output": "Wochenverlauf und Tageswerte der Luftqualität als Dashboard und als Auskunftsseite.",
          "outcome": "Anfragen aus der Bürgerschaft werden mit einem Link beantwortet statt mit einer Einzelauswertung.",
          "impact": "Die Belastungslage in den Wohngebieten ist dauerhaft öffentlich einsehbar."
        },
        "collaboration": {
          "wanted": true,
          "seeking": "Austausch mit Kommunen, die günstige Sensorik betreiben — besonders zur Kalibrierung."
        }
      },
      "title": "Feinstaub Musterhausen",
      "summary": "Luftqualität im Blick: Feinstaub-Messwerte (PM2.5/PM10) je Messstation als wiederverwendbares Use-Case-Paket.",
      "description": "Die Stadt Musterhausen erfasst Feinstaub (PM2.5/PM10) an Messstationen. Beim Installieren wird der Inhalt direkt aus dem Artefakt-Repo (Tag v1.0.0) geladen und über das CivitasCore Portal-Backend angelegt — der Marketplace liefert nichts davon mit.",
      "publisher": "Stadt Musterhausen",
      "categories": [
        "Umwelt & Klima"
      ],
      "curationTier": "community",
      "maturity": "prototype",
      "installability": "direct",
      "compatibility": [
        "2.0",
        "2.1"
      ],
      "requiredCapabilities": [
        "PORTAL_BACKEND"
      ],
      "includedArtifacts": [
        {
          "id": "urn:core:platform:civitas:dataset:common:Feinstaub-Musterhausen:1.0.0",
          "title": "Feinstaub Musterhausen",
          "kind": "dataset",
          "description": "Datensatz für die Feinstaub-Messungen der Stadt Musterhausen."
        },
        {
          "id": "urn:core:platform:civitas:datastructure:environment:AirQualityReading:1.0.0",
          "title": "AirQualityReading",
          "kind": "datastructure",
          "description": "Eine Feinstaub-Messung: PM2.5/PM10, Zeitpunkt, Standort.",
          "requires": [
            {
              "label": "Feinstaubsensoren mit MQTT-Anbindung",
              "note": "Z. B. Sensor.Community-Bausätze oder kalibrierte Messstationen."
            }
          ]
        },
        {
          "id": "urn:core:platform:civitas:datastructure:common:GeoPoint:1.0.0",
          "title": "GeoPoint",
          "kind": "datastructure",
          "description": "Geokoordinate (lat/lon), gemeinsam genutztes Plattform-Element."
        }
      ],
      "deploymentRef": {
        "url": "https://gitlab.com/civitascore-openurbanapps/commune-musterhausen-feinstaub",
        "ref": "5236fb9231f161cf770fb286e71140ac9d7f856e",
        "releaseTag": "v2.2.0",
        "path": "."
      },
      "trust": {
        "maintainer": { "name": "Stadt Musterhausen" },
        "contactPerson": {
          "email": "j.wagner@musterhausen.example"
        },
        "curatedBy": "Civitas Connect e. V.",
        "curatedAt": "2026-07-12",
        "license": "EUPL-1.2"
      },
      "requirements": {
        "coreVersions": ["2.0", "2.1"],
        "components": ["PORTAL_BACKEND", "FROST", "NIFI", "SUPERSET"],
        "connectors": ["MQTT"]
      },
      "endUserSurfaces": [
        {
          "kind": "superset",
          "label": "Feinstaub im Wochenverlauf",
          "summary": "Grenzwertüberschreitungen je Messstelle, als Bericht für die Umweltverwaltung.",
          "requiresAddon": "Superset",
          "via": "Zeitreihen-API dieses Datensatzes",
          "urlTemplate": "https://superset.musterstadt.de/dashboard/luft-{datasetId}"
        },
        {
          "kind": "app",
          "label": "Luftqualität heute",
          "summary": "Eine öffentliche Seite mit der aktuellen Belastung — verständlich, ohne Fachbegriffe.",
          "via": "Open-Data-Route dieses Datensatzes"
        },
        {
          "kind": "chatbot",
          "label": "Umwelt-Auskunft",
          "summary": "„Wie war die Luft letzte Woche in der Innenstadt?\" — Fragen in Alltagssprache, Antworten aus den Messwerten.",
          "requiresAddon": "Chatbot",
          "via": "Zeitreihen-API dieses Datensatzes"
        }
      ],
      "provides": [
        {
          "kind": "api",
          "label": "Messwerte als Zeitreihen-API",
          "standard": "STA",
          "urlTemplate": "https://api.civitas.musterstadt.de/datasets/{datasetId}/Observations"
        },
        {
          "kind": "dashboard",
          "label": "Feinstaubbelastung im Wochenverlauf",
          "standard": "Superset",
          "note": "Grenzwertüberschreitungen je Messstelle."
        }
      ],
      "roles": [
        {
          "key": "umwelt-datenpflege",
          "label": "Datenpflege Umwelt",
          "description": "Darf Messstellen verwalten.",
          "permissions": ["DATASET_UPDATE", "DATASET_PAYLOAD_UPDATE"]
        }
      ],
      "modelForge": {
        "datasetId": "urn:core:platform:civitas:dataset:common:Feinstaub-Musterhausen:1.0.0",
        "note": "Beim Installieren wird das Bundle aus dem Artefakt-Repo (Tag v1.0.0) geholt und über das CivitasCore Portal-Backend angelegt. GeoPoint wird wiederverwendet, falls es bereits existiert."
      }
    },
    {
      "id": "musterstadt-hitzeinseln",
      "transferability": "inspiration",
      "addedAt": "2026-10-20",
      "updatedAt": "2026-11-04",
      "implementation": {
        "status": "prototyp",
        "operator": "Stadt Musterstadt",
        "operatorOrg": "musterstadt",
        "parties": { "stakeholders": ["Umweltamt Musterstadt", "Schulamt Musterstadt"] },
        "resources": { "costBand": "m", "setupCost": "m", "runningCost": "s", "effortBand": "m", "funding": "Smart-City-Fördermittel der Stadt Musterstadt" },
        "logicModel": {
          "input": "Zwölf Temperaturfühler, ein Sommer Messung, Abstimmung mit Umwelt- und Schulamt.",
          "output": "Eine Karte der heißesten Orte am Nachmittag.",
          "outcome": "Schattenplätze und Trinkbrunnen entstehen dort, wo es am heißesten wird.",
          "impact": "Weniger Hitzebelastung für Kinder und ältere Menschen in der Innenstadt."
        },
        "reference": {
          "url": "https://musterstadt.example/smart-city/hitzeinseln",
          "source": "Projektseite der Stadt Musterstadt"
        }
      },
      "title": "Hitzeinseln Musterstadt",
      "summary": "Temperaturmessung auf Plätzen und Schulhöfen, damit Hitzeschutz dort ansetzt, wo es am heißesten wird.",
      "description": "Zwölf Temperaturfühler messen im Sommer an Plätzen, Haltestellen und Schulhöfen. Eine Karte zeigt, wo es nachmittags am heißesten wird, und das Umweltamt plant danach Schattenplätze und Trinkbrunnen. Läuft in Musterstadt; ein installierbares Paket gibt es noch nicht.",
      "publisher": "Stadt Musterstadt",
      "categories": ["Umwelt & Klima"],
      "curationTier": "experimental",
      "compatibility": ["2.0"],
      "trust": {
        "contactPerson": { "name": "Team Smart City", "role": "Stadt Musterstadt", "email": "smartcity@musterstadt.example" }
      },
      "modelForge": {
        "datasetId": "urn:core:platform:civitas:dataset:common:Hitzeinseln-Musterstadt:1.0.0"
      }
    },
    {
      "id": "musterstadt-giesspatenschaften",
      "transferability": "inspiration",
      "addedAt": "2026-10-28",
      "updatedAt": "2026-11-04",
      "implementation": {
        "status": "in-entwicklung",
        "operator": "Stadt Musterstadt",
        "operatorOrg": "musterstadt",
        "parties": { "stakeholders": ["Grünflächenamt Musterstadt", "Bürgerverein Altstadt"] },
        "resources": { "costBand": "s", "setupCost": "s", "runningCost": "s", "effortBand": "m", "funding": "Haushaltsmittel der Stadt Musterstadt" },
        "logicModel": {
          "input": "Das Baumkataster, eine Kartenansicht und ein Aufruf über den Bürgerverein.",
          "output": "Eine Karte der Patenbäume mit ihrem Wasserbedarf.",
          "outcome": "Der Bauhof gießt gezielt die Bäume, die keine Paten haben.",
          "impact": "Mehr junge Straßenbäume überstehen ihre ersten Sommer."
        },
        "reference": {
          "url": "https://musterstadt.example/smart-city/giesspatenschaften",
          "source": "Projektseite der Stadt Musterstadt"
        }
      },
      "title": "Gießpatenschaften Musterstadt",
      "summary": "Anwohnende übernehmen das Gießen junger Straßenbäume und sehen auf einer Karte, welcher Baum Wasser braucht.",
      "description": "Die Karte zeigt junge Bäume aus dem Baumkataster mit ihrem Wasserbedarf. Wer eine Patenschaft übernimmt, trägt das Gießen ein; der Bauhof plant seine Touren um die versorgten Bäume herum. In Entwicklung in Musterstadt; ein installierbares Paket gibt es noch nicht.",
      "publisher": "Stadt Musterstadt",
      "categories": ["Umwelt & Klima", "Verwaltung & Bürgerservices"],
      "curationTier": "experimental",
      "compatibility": ["2.0"],
      "trust": {
        "contactPerson": { "name": "Team Smart City", "role": "Stadt Musterstadt", "email": "smartcity@musterstadt.example" }
      },
      "modelForge": {
        "datasetId": "urn:core:platform:civitas:dataset:common:Giesspatenschaften-Musterstadt:1.0.0"
      }
    },
    {
      "id": "musterhausen-laermmessung",
      "addedAt": "2026-10-12",
      "updatedAt": "2026-10-30",
      "implementation": {
        "status": "idee",
        "operator": "Stadt Musterhausen",
        "operatorOrg": "musterhausen",
        "parties": { "stakeholders": ["Umweltamt Musterhausen"] },
        "resources": { "costBand": "m", "setupCost": "m", "runningCost": "s", "effortBand": "s", "funding": "Noch offen" },
        "logicModel": {
          "input": "Vier Lärmsensoren an den Standorten der Zählstellen.",
          "output": "Lärmpegel neben Verkehrszählung und Feinstaubwerten.",
          "outcome": "Der Stadtrat sieht, ob Tempo 30 Lärm und Luft zugleich verbessert.",
          "impact": "Ruhigere und gesündere Wohnstraßen an der Hauptstraße."
        },
        "reference": {
          "url": "https://musterhausen.example/digitales/laermmessung",
          "source": "Projektseite der Stadt Musterhausen"
        }
      },
      "title": "Lärmmessung Hauptstraße",
      "summary": "Lärmpegel an der Hauptstraße, abgeglichen mit Verkehrszählung und Luftwerten.",
      "description": "Geplant: vier Lärmsensoren an der Hauptstraße, deren Werte neben der Verkehrszählung und den Feinstaubwerten stehen. So lässt sich zeigen, ob eine Tempo-30-Strecke Lärm und Luft zugleich verbessert. Noch eine Idee; ein installierbares Paket gibt es noch nicht.",
      "publisher": "Stadt Musterhausen",
      "categories": ["Umwelt & Klima", "Mobilität & Verkehr"],
      "curationTier": "experimental",
      "compatibility": ["2.0"],
      "trust": {
        "contactPerson": { "name": "Digitalisierung und Smart City", "role": "Stadt Musterhausen", "email": "digital@musterhausen.example" }
      },
      "modelForge": {
        "datasetId": "urn:core:platform:civitas:dataset:common:Laermmessung-Musterhausen:1.0.0"
      }
    },
    {
      "id": "musterland-tag-nacht-bevoelkerung",
      "addedAt": "2026-11-19",
      "updatedAt": "2026-11-19",
      "softwareUpdatedAt": "2026-11-05",
      "transferability": "tailored",
      "adopters": [
        {
          "name": "Landkreis Beispielkreis",
          "since": "2026",
          "stage": "pilot"
        }
      ],
      "implementation": {
        "status": "prototyp",
        "operator": "Landkreis Musterland",
        "operatorOrg": "musterland",
        "parties": {
          "stakeholders": [
            "Stabsstelle Bevölkerungsschutz",
            "Statistikstelle des Kreises",
            "Meldebehörden der Gemeinden"
          ],
          "serviceProviders": [
            "Kommunales Rechenzentrum (Auswertung)"
          ]
        },
        "stack": [
          "CivitasCore Portal-Backend",
          "PostGIS",
          "Superset",
          "SQL-Anbindung an das Melderegister"
        ],
        "resources": {
          "cost": "S, unter 1.000 Euro",
          "effort": "M, unter 50 Tage",
          "costBand": "s",
          "setupCost": "s",
          "runningCost": "s",
          "effortBand": "m",
          "funding": "Haushaltsmittel des Landkreises Musterland",
          "note": "Der Aufwand steckt in den Absprachen mit den Meldebehörden und der Pendlerstatistik, nicht in der Technik."
        },
        "logicModel": {
          "input": "Melderegister, Pendlerstatistik des Landesamts und gemeldete Hotelübernachtungen.",
          "output": "Tag- und Nachtbevölkerung je Gemeinde, monatlich, als Tabelle und Karte.",
          "outcome": "Evakuierung und Betreuung werden mit den Menschen geplant, die tatsächlich vor Ort sind.",
          "impact": "Im Ereignisfall gehen Kräfte dorthin, wo die meisten Menschen sind."
        },
        "collaboration": {
          "wanted": true,
          "seeking": "Kreise, die Tag- und Nachtbevölkerung nach demselben Verfahren schätzen - damit Nachbarkreise ihre Zahlen zusammenlegen können."
        },
        "reference": {
          "url": "https://musterland.example/bevoelkerungsschutz/tag-nacht",
          "source": "Seite des Landkreises Musterland"
        }
      },
      "title": "Tag- und Nachtbevölkerung Musterland",
      "summary": "Wie viele Menschen sich tagsüber und nachts in jeder Gemeinde aufhalten - aus Melderegister, Pendlerstatistik und Übernachtungen.",
      "description": "Für eine Evakuierung zählt nicht, wer gemeldet ist, sondern wer gerade da ist. Der Kreis führt je Gemeinde die Tag- und Nachtbevölkerung, monatlich aus Melderegister, Pendlerzahlen und Hotelübernachtungen gerechnet. Läuft im Landkreis Musterland; ein installierbares Paket gibt es noch nicht.",
      "publisher": "Landkreis Musterland",
      "categories": [
        "Katastrophenschutz & Sicherheit"
      ],
      "curationTier": "experimental",
      "compatibility": [
        "2.0"
      ],
      "images": [
        {
          "url": "/dashboard-platzhalter.png",
          "caption": "Tag- und Nachtbevölkerung je Gemeinde"
        }
      ],
      "links": [
        {
          "title": "Verfahren: Tag- und Nachtbevölkerung schätzen",
          "url": "https://musterland.example/bevoelkerungsschutz/tag-nacht/verfahren",
          "description": "Wie Melderegister, Pendler und Übernachtungen verrechnet werden, Schritt für Schritt."
        }
      ],
      "trust": {
        "maintainer": {
          "name": "Landkreis Musterland",
          "contactUrl": "https://musterland.example/bevoelkerungsschutz"
        },
        "contactPerson": {
          "name": "Stabsstelle Bevölkerungsschutz",
          "role": "Landkreis Musterland",
          "email": "bevoelkerungsschutz@musterland.example"
        },
        "curatedBy": "Open Urban Apps",
        "curatedAt": "2026-11-19",
        "license": "EUPL-1.2"
      },
      "requirements": {
        "coreVersions": [
          "2.0"
        ],
        "components": [
          "PORTAL_BACKEND",
          "POSTGIS",
          "SUPERSET"
        ],
        "connectors": [
          "SQL"
        ]
      },
      "modelForge": {
        "datasetId": "urn:core:platform:civitas:dataset:common:TagNachtBevoelkerung-Musterland:1.0.0"
      }
    },
    {
      "id": "musterland-loeschwasser",
      "addedAt": "2026-11-19",
      "updatedAt": "2026-11-19",
      "softwareUpdatedAt": "2026-10-28",
      "transferability": "tailored",
      "adopters": [
        {
          "name": "Gemeinde Musterbach",
          "since": "2026",
          "stage": "pilot"
        }
      ],
      "implementation": {
        "status": "in-entwicklung",
        "operator": "Landkreis Musterland",
        "operatorOrg": "musterland",
        "parties": {
          "stakeholders": [
            "Kreisbrandmeister",
            "Freiwillige Feuerwehren des Kreises"
          ],
          "serviceProviders": [
            "Wasserversorger des Kreises (Hydrantenplan)"
          ]
        },
        "stack": [
          "CivitasCore Portal-Backend",
          "PostGIS",
          "GeoServer",
          "Geoportal"
        ],
        "resources": {
          "cost": "S, unter 1.000 Euro",
          "effort": "M, unter 50 Tage",
          "costBand": "s",
          "setupCost": "s",
          "runningCost": "s",
          "effortBand": "m",
          "funding": "Haushaltsmittel des Landkreises Musterland",
          "note": "Die Feuerwehren prüfen ihre Entnahmestellen einmal im Jahr; dabei werden die Daten gleich mit aktualisiert."
        },
        "logicModel": {
          "input": "Hydrantenplan des Wasserversorgers und die Listen der Feuerwehren zu Brunnen und Teichen.",
          "output": "Eine Karte aller Löschwasserentnahmestellen mit Nennleistung und Füllzeiten.",
          "outcome": "Einsatzleitungen sehen auf einen Blick, wo wie viel Löschwasser zu holen ist.",
          "impact": "Weniger Zeitverlust bei Bränden in Gebieten ohne dichtes Hydrantennetz."
        },
        "collaboration": {
          "wanted": true,
          "seeking": "Feuerwehren und Kreise, die Löschwasser schon digital führen - für gemeinsame Felder zu Nennleistung und Füllzeit."
        },
        "reference": {
          "url": "https://musterland.example/bevoelkerungsschutz/loeschwasser",
          "source": "Seite des Landkreises Musterland"
        }
      },
      "title": "Löschwasser und Hydranten",
      "summary": "Hydranten, Löschwasserbrunnen und -teiche mit Nennleistung und Füllzeiten auf einer Karte, gepflegt mit den Feuerwehren.",
      "description": "Wasserversorger und Feuerwehren führen ihre Entnahmestellen bisher in getrennten Listen. Der Kreis legt sie in einem Datensatz zusammen: Art, Lage, Nennleistung, eigene Pumpe ja oder nein, bei Teichen die Füllzeit. In Entwicklung im Landkreis Musterland; ein installierbares Paket gibt es noch nicht.",
      "publisher": "Landkreis Musterland",
      "categories": [
        "Katastrophenschutz & Sicherheit"
      ],
      "curationTier": "experimental",
      "compatibility": [
        "2.0"
      ],
      "images": [
        {
          "url": "/dashboard-platzhalter.png",
          "caption": "Löschwasserentnahmestellen auf der Karte des Kreises"
        }
      ],
      "links": [
        {
          "title": "Feldbeschreibung Löschwasser",
          "url": "https://musterland.example/bevoelkerungsschutz/loeschwasser/felder",
          "description": "Welche Angaben je Hydrant, Brunnen und Teich erfasst werden und wer sie pflegt."
        }
      ],
      "trust": {
        "maintainer": {
          "name": "Landkreis Musterland",
          "contactUrl": "https://musterland.example/bevoelkerungsschutz"
        },
        "contactPerson": {
          "name": "Stabsstelle Bevölkerungsschutz",
          "role": "Landkreis Musterland",
          "email": "bevoelkerungsschutz@musterland.example"
        },
        "curatedBy": "Open Urban Apps",
        "curatedAt": "2026-11-19",
        "license": "EUPL-1.2"
      },
      "requirements": {
        "coreVersions": [
          "2.0"
        ],
        "components": [
          "PORTAL_BACKEND",
          "POSTGIS",
          "GEOSERVER"
        ],
        "connectors": [
          "SQL"
        ]
      },
      "modelForge": {
        "datasetId": "urn:core:platform:civitas:dataset:common:Loeschwasser-Musterland:1.0.0"
      }
    },
    {
      "id": "musterland-krankenhauskapazitaeten",
      "addedAt": "2026-11-19",
      "updatedAt": "2026-11-19",
      "softwareUpdatedAt": "2026-11-12",
      "transferability": "direct",
      "implementation": {
        "status": "prototyp",
        "operator": "Landkreis Musterland",
        "operatorOrg": "musterland",
        "parties": {
          "stakeholders": [
            "Gesundheitsamt Musterland",
            "Krankenhäuser im Kreis"
          ],
          "serviceProviders": [
            "Kommunales Rechenzentrum"
          ]
        },
        "stack": [
          "CivitasCore Portal-Backend",
          "PostGIS",
          "Superset"
        ],
        "resources": {
          "costBand": "s",
          "setupCost": "s",
          "runningCost": "s",
          "effortBand": "s",
          "funding": "Haushaltsmittel des Landkreises Musterland",
          "note": "Die Krankenhäuser melden einmal am Tag; der Aufwand liegt beim Abstimmen der Felder, nicht bei der Technik.",
          "cost": "S, unter 1.000 Euro",
          "effort": "S, unter 10 Tage"
        },
        "logicModel": {
          "input": "Tägliche Bettenmeldung der Krankenhäuser, Stammdaten zu Notstrom und Landeplatz.",
          "output": "Freie Betten, Intensiv- und Verbrennungsbetten je Haus, als Karte und Tabelle.",
          "outcome": "Rettungsdienst und Krisenstab sehen, wohin Verletzte gebracht werden können.",
          "impact": "Bei einem Massenanfall von Verletzten wird kein Haus überlastet, solange ein anderes frei ist."
        },
        "collaboration": {
          "wanted": true,
          "seeking": "Kreise, die dieselben Felder nutzen wollen - damit Meldungen über Kreisgrenzen hinweg vergleichbar sind."
        }
      },
      "title": "Krankenhauskapazitäten Musterland",
      "summary": "Freie Betten, Intensiv- und Verbrennungsbetten der Krankenhäuser im Kreis - täglich gemeldet, mit Notstrom und Hubschrauberlandeplatz.",
      "description": "Jedes Krankenhaus im Kreis meldet einmal am Tag seine Betten, getrennt nach Normal-, Intensiv- und Verbrennungsbetten. Dazu kommen Stammdaten, die die Kreisbeschreibung verlangt: Notstromversorgung, Hubschrauberlandeplatz und ein Kontakt, der rund um die Uhr erreichbar ist. Das Paket bringt die Datenstrukturen und eine Kartenansicht mit, keine Daten.",
      "publisher": "Landkreis Musterland",
      "categories": [
        "Katastrophenschutz & Sicherheit"
      ],
      "curationTier": "community",
      "compatibility": [
        "2.0",
        "2.1"
      ],
      "requiredCapabilities": [
        "PORTAL_BACKEND"
      ],
      "includedArtifacts": [
        {
          "id": "urn:core:platform:civitas:dataset:common:Krankenhauskapazitaeten-Musterland:1.0.0",
          "title": "Krankenhauskapazitäten Musterland",
          "kind": "dataset",
          "description": "Datensatz für die täglichen Bettenmeldungen."
        },
        {
          "id": "urn:core:platform:civitas:datastructure:safety:CriticalFacility:1.0.0",
          "title": "CriticalFacility",
          "kind": "datastructure",
          "description": "Eine Einrichtung, wie die Kreisbeschreibung sie erfasst: Art, Lage, Notstromversorgung und Kontakt rund um die Uhr."
        },
        {
          "id": "urn:core:platform:civitas:datastructure:health:HospitalCapacity:1.0.0",
          "title": "HospitalCapacity",
          "kind": "datastructure",
          "description": "Eine Bettenmeldung: Zeitpunkt, Betten gesamt und frei, getrennt nach Intensiv- und Verbrennungsbetten.",
          "requires": [
            {
              "label": "Tägliche Bettenmeldung der Krankenhäuser",
              "note": "Per Formular oder als Export aus dem Meldeweg, den die Häuser schon nutzen."
            }
          ]
        }
      ],
      "modelForge": {
        "datasetId": "urn:core:platform:civitas:dataset:common:Krankenhauskapazitaeten-Musterland:1.0.0",
        "note": "Beim Installieren legt der Marketplace die beiden Datenstrukturen und den Datensatz über das CivitasCore Portal-Backend an. Daten werden nicht mitgeliefert."
      },
      "deploymentRef": {
        "url": "https://gitlab.example/landkreis-musterland/kreisbeschreibung-krankenhaeuser",
        "ref": "1ac2e6001387cb39948adb922742e0921b587f70",
        "releaseTag": "v1.0.0",
        "path": "."
      },
      "trust": {
        "maintainer": {
          "name": "Landkreis Musterland",
          "contactUrl": "https://musterland.example/bevoelkerungsschutz"
        },
        "contactPerson": {
          "name": "Stabsstelle Bevölkerungsschutz",
          "role": "Landkreis Musterland",
          "email": "bevoelkerungsschutz@musterland.example"
        },
        "license": "EUPL-1.2",
        "curatedBy": "Open Urban Apps",
        "curatedAt": "2026-11-19"
      },
      "requirements": {
        "coreVersions": [
          "2.0",
          "2.1"
        ],
        "components": [
          "PORTAL_BACKEND",
          "POSTGIS"
        ],
        "connectors": [
          "SQL"
        ]
      },
      "provides": [
        {
          "kind": "map",
          "label": "Krankenhäuser mit freien Betten als Kartenebene",
          "standard": "WFS"
        },
        {
          "kind": "dashboard",
          "label": "Bettenlage im Kreis",
          "note": "Für Krisenstab und Rettungsdienst, mit Verlauf der letzten Tage."
        }
      ],
      "roles": [
        {
          "key": "betten-meldung",
          "label": "Bettenmeldung",
          "description": "Darf die tägliche Meldung des eigenen Hauses eintragen.",
          "permissions": [
            "DATASET_PAYLOAD_UPDATE"
          ]
        },
        {
          "key": "krisenstab-lesen",
          "label": "Krisenstab",
          "description": "Darf die Bettenlage aller Häuser sehen - nur lesen.",
          "permissions": [
            "DATASET_READ"
          ]
        }
      ],
      "adopters": [
        {
          "name": "Landkreis Beispielkreis",
          "since": "2026",
          "stage": "pilot"
        }
      ],
      "installQuestions": [
        "Welche Krankenhäuser melden ihre Betten, und auf welchem Weg kommen die Meldungen heute an?"
      ],
      "images": [
        {
          "url": "/dashboard-platzhalter.png",
          "caption": "Freie Betten je Krankenhaus im Kreis"
        }
      ],
      "demoData": {
        "contains": "drei erfundene Krankenhäuser mit einer Woche Bettenmeldungen",
        "note": "Die Beispieldaten sind erfunden. Die echten Meldungen binden Sie später an, ohne neu zu installieren - sie bleiben in Ihrer Instanz."
      },
      "links": [
        {
          "title": "Feldbeschreibung Bettenmeldung",
          "url": "https://musterland.example/bevoelkerungsschutz/krankenhaeuser/felder",
          "description": "Welche Betten getrennt gemeldet werden und was als frei gilt."
        },
        {
          "title": "Meldeweg für Krankenhäuser",
          "url": "https://musterland.example/bevoelkerungsschutz/krankenhaeuser/meldeweg",
          "description": "Wie die Häuser ihre tägliche Meldung abgeben und wer sie prüft."
        }
      ],
      "endUserSurfaces": [
        {
          "kind": "superset",
          "label": "Bettenlage im Kreis",
          "summary": "Freie Normal-, Intensiv- und Verbrennungsbetten je Haus, mit Verlauf.",
          "requiresAddon": "Superset",
          "via": "API-Route dieses Datensatzes"
        },
        {
          "kind": "masterportal",
          "label": "Krankenhäuser auf der Kreiskarte",
          "summary": "Lage, freie Betten und Hubschrauberlandeplatz im Klick-Overlay.",
          "requiresAddon": "Geoportal",
          "via": "OWS-Route /karte"
        }
      ]
    },
    {
      "id": "musterland-notunterkuenfte",
      "addedAt": "2026-11-19",
      "updatedAt": "2026-11-19",
      "softwareUpdatedAt": "2026-11-12",
      "transferability": "direct",
      "implementation": {
        "status": "prototyp",
        "operator": "Landkreis Musterland",
        "operatorOrg": "musterland",
        "parties": {
          "stakeholders": [
            "Stabsstelle Bevölkerungsschutz",
            "Schulverwaltung",
            "Hilfsorganisationen im Kreis"
          ],
          "serviceProviders": [
            "Hilfsorganisationen (Betreuungsdienst)"
          ]
        },
        "stack": [
          "CivitasCore Portal-Backend",
          "PostGIS"
        ],
        "resources": {
          "costBand": "s",
          "setupCost": "s",
          "runningCost": "s",
          "effortBand": "m",
          "funding": "Haushaltsmittel des Landkreises Musterland",
          "note": "Der meiste Aufwand steckt im Begehen der Gebäude: Plätze, Küche und Barrierefreiheit werden vor Ort geprüft.",
          "cost": "S, unter 1.000 Euro",
          "effort": "M, unter 50 Tage"
        },
        "logicModel": {
          "input": "Liste der weiterführenden Schulen, Hallen und Hotels, geprüft bei einer Begehung.",
          "output": "Ein Verzeichnis der Notunterkünfte mit Plätzen, Küche und Barrierefreiheit.",
          "outcome": "Bei einer Evakuierung ist in Minuten klar, wo wie viele Menschen unterkommen.",
          "impact": "Betroffene werden schneller und passender untergebracht, Familien bleiben zusammen."
        },
        "collaboration": {
          "wanted": true,
          "seeking": "Kreise, die ihre Notunterkünfte schon erfasst haben - für gemeinsame Felder zu Plätzen, Küche und Barrierefreiheit."
        }
      },
      "title": "Notunterkünfte und Betreuungsplätze",
      "summary": "Schulen, Versammlungsräume und Hotels, die Betroffene aufnehmen können - mit Plätzen, Küche und Barrierefreiheit.",
      "description": "Die Kreisbeschreibung fragt nach Orten, an denen unverletzte Betroffene länger untergebracht werden können: weiterführende Schulen, Hallen, Hotels. Für jeden Ort erfasst der Kreis die Plätze, ob es eine Küche gibt und ob er barrierefrei ist. Das Paket bringt die Datenstrukturen mit, keine Daten.",
      "publisher": "Landkreis Musterland",
      "categories": [
        "Katastrophenschutz & Sicherheit"
      ],
      "curationTier": "experimental",
      "compatibility": [
        "2.0",
        "2.1"
      ],
      "requiredCapabilities": [
        "PORTAL_BACKEND"
      ],
      "includedArtifacts": [
        {
          "id": "urn:core:platform:civitas:dataset:common:Notunterkuenfte-Musterland:1.0.0",
          "title": "Notunterkünfte Musterland",
          "kind": "dataset",
          "description": "Datensatz für die Notunterkünfte des Kreises."
        },
        {
          "id": "urn:core:platform:civitas:datastructure:safety:CriticalFacility:1.0.0",
          "title": "CriticalFacility",
          "kind": "datastructure",
          "description": "Eine Einrichtung, wie die Kreisbeschreibung sie erfasst: Art, Lage, Notstromversorgung und Kontakt rund um die Uhr."
        },
        {
          "id": "urn:core:platform:civitas:datastructure:safety:ShelterCapacity:1.0.0",
          "title": "ShelterCapacity",
          "kind": "datastructure",
          "description": "Eine Unterkunft: Art, Plätze, Küche, Barrierefreiheit.",
          "requires": [
            {
              "label": "Begehung der Gebäude",
              "note": "Plätze, Küche und Barrierefreiheit lassen sich nur vor Ort verlässlich prüfen."
            }
          ]
        }
      ],
      "modelForge": {
        "datasetId": "urn:core:platform:civitas:dataset:common:Notunterkuenfte-Musterland:1.0.0",
        "note": "Beim Installieren legt der Marketplace die beiden Datenstrukturen und den Datensatz an; CriticalFacility wird wiederverwendet, falls es schon existiert."
      },
      "deploymentRef": {
        "url": "https://gitlab.example/landkreis-musterland/kreisbeschreibung-notunterkuenfte",
        "ref": "4c3386387f04f1863ff6137afab15563cc4397a0",
        "releaseTag": "v1.0.0",
        "path": "."
      },
      "trust": {
        "maintainer": {
          "name": "Landkreis Musterland",
          "contactUrl": "https://musterland.example/bevoelkerungsschutz"
        },
        "contactPerson": {
          "name": "Stabsstelle Bevölkerungsschutz",
          "role": "Landkreis Musterland",
          "email": "bevoelkerungsschutz@musterland.example"
        },
        "license": "EUPL-1.2",
        "curatedBy": "Open Urban Apps",
        "curatedAt": "2026-11-19"
      },
      "requirements": {
        "coreVersions": [
          "2.0",
          "2.1"
        ],
        "components": [
          "PORTAL_BACKEND",
          "POSTGIS"
        ],
        "connectors": [
          "SQL"
        ]
      },
      "provides": [
        {
          "kind": "map",
          "label": "Notunterkünfte als Kartenebene",
          "standard": "WFS"
        },
        {
          "kind": "download",
          "label": "Unterkunftsliste für den Krisenstab",
          "note": "Als Tabelle, nach Gemeinde und Art sortiert."
        }
      ],
      "roles": [
        {
          "key": "unterkunft-pflege",
          "label": "Pflege Unterkünfte",
          "description": "Darf Unterkünfte anlegen und Plätze nach der Begehung eintragen.",
          "permissions": [
            "DATASET_UPDATE",
            "DATASET_PAYLOAD_UPDATE"
          ]
        },
        {
          "key": "unterkunft-belegung",
          "label": "Belegung",
          "description": "Darf im Einsatz die freien Plätze aktualisieren.",
          "permissions": [
            "DATASET_PAYLOAD_UPDATE"
          ]
        }
      ],
      "adopters": [
        {
          "name": "Stadt Beispielhausen",
          "since": "2026",
          "stage": "pilot"
        }
      ],
      "installQuestions": [
        "Welche Gebäude sind bei Ihnen für Betreuungseinsätze vorgeplant?"
      ],
      "images": [
        {
          "url": "/dashboard-platzhalter.png",
          "caption": "Notunterkünfte mit freien Plätzen"
        }
      ],
      "demoData": {
        "contains": "zwölf erfundene Unterkünfte - Schulen, Hallen und Hotels",
        "note": "Die Beispieldaten sind erfunden. Ihre eigenen Unterkünfte tragen Sie nach der Begehung ein; sie bleiben in Ihrer Instanz."
      },
      "links": [
        {
          "title": "Begehungsbogen für Notunterkünfte",
          "url": "https://musterland.example/bevoelkerungsschutz/notunterkuenfte/begehung",
          "description": "Was bei der Begehung zu Plätzen, Küche, Sanitär und Barrierefreiheit geprüft wird."
        }
      ],
      "endUserSurfaces": [
        {
          "kind": "masterportal",
          "label": "Notunterkünfte auf der Kreiskarte",
          "summary": "Wo wie viele Plätze frei sind, mit Küche und Barrierefreiheit im Klick-Overlay.",
          "requiresAddon": "Geoportal",
          "via": "OWS-Route /karte"
        }
      ]
    },
    {
      "id": "musterland-schutzraeume",
      "addedAt": "2026-11-19",
      "updatedAt": "2026-11-19",
      "transferability": "inspiration",
      "implementation": {
        "status": "idee",
        "operator": "Landkreis Musterland",
        "operatorOrg": "musterland",
        "parties": {
          "stakeholders": [
            "Stabsstelle Bevölkerungsschutz",
            "Bauaufsicht",
            "Gebäudemanagement des Kreises"
          ],
          "serviceProviders": [
            "Ingenieurbüro für die Begehungen (noch auszuschreiben)"
          ]
        },
        "stack": [
          "CivitasCore Portal-Backend",
          "PostGIS",
          "Geoportal"
        ],
        "resources": {
          "cost": "M, unter 10.000 Euro",
          "effort": "L, unter 100 Tage",
          "costBand": "m",
          "setupCost": "m",
          "runningCost": "s",
          "effortBand": "l",
          "funding": "Noch offen",
          "note": "Teuer sind die Begehungen: jeder mögliche Zufluchtsort muss vor Ort auf Zugang, Größe und Zustand geprüft werden."
        },
        "logicModel": {
          "input": "Unterlagen zu noch betriebenen Schutzräumen und eine Sichtung öffentlicher Gebäude mit Kellern und Tiefgaragen.",
          "output": "Ein Verzeichnis von Schutzräumen und möglichen Zufluchtsorten mit Personenzahl und Zustand.",
          "outcome": "Der Kreis weiß, wo Menschen im öffentlichen Raum Schutz finden können.",
          "impact": "Grundlage, um Zufluchtsorte gezielt zu ertüchtigen und auszuschildern."
        },
        "collaboration": {
          "wanted": true,
          "seeking": "Kreise, die schon Zufluchtsorte erfasst haben - für eine gemeinsame Liste der Prüfkriterien."
        },
        "reference": {
          "url": "https://musterland.example/bevoelkerungsschutz/schutzraeume",
          "source": "Seite des Landkreises Musterland"
        }
      },
      "title": "Schutzräume und Zufluchtsorte",
      "summary": "Noch betriebene Schutzräume und Gebäude, die als Zufluchtsort dienen können - mit Personenzahl und baulichem Zustand.",
      "description": "Neben den wenigen noch betriebenen Schutzräumen fragt die Kreisbeschreibung nach Gebäuden, die als Zufluchtsort taugen: Keller öffentlicher Gebäude, Tiefgaragen, unterirdische Anlagen. Noch eine Idee im Landkreis Musterland; ein installierbares Paket gibt es noch nicht.",
      "publisher": "Landkreis Musterland",
      "categories": [
        "Katastrophenschutz & Sicherheit",
        "Planen, Bauen & Immobilien"
      ],
      "curationTier": "experimental",
      "compatibility": [
        "2.0"
      ],
      "links": [
        {
          "title": "Prüfliste für mögliche Zufluchtsorte (Entwurf)",
          "url": "https://musterland.example/bevoelkerungsschutz/schutzraeume/pruefliste",
          "description": "Nach welchen Kriterien Gebäude bei der Begehung bewertet werden sollen."
        }
      ],
      "trust": {
        "maintainer": {
          "name": "Landkreis Musterland",
          "contactUrl": "https://musterland.example/bevoelkerungsschutz"
        },
        "contactPerson": {
          "name": "Stabsstelle Bevölkerungsschutz",
          "role": "Landkreis Musterland",
          "email": "bevoelkerungsschutz@musterland.example"
        },
        "curatedBy": "Open Urban Apps",
        "curatedAt": "2026-11-19",
        "license": "EUPL-1.2"
      },
      "requirements": {
        "coreVersions": [
          "2.0"
        ],
        "components": [
          "PORTAL_BACKEND",
          "POSTGIS"
        ],
        "connectors": []
      },
      "modelForge": {
        "datasetId": "urn:core:platform:civitas:dataset:common:Schutzraeume-Musterland:1.0.0"
      }
    },
    {
      "id": "musterland-sirenen",
      "addedAt": "2026-11-19",
      "updatedAt": "2026-11-19",
      "softwareUpdatedAt": "2026-11-10",
      "transferability": "tailored",
      "adopters": [
        {
          "name": "Stadt Beispielhausen",
          "since": "2026",
          "stage": "pilot"
        }
      ],
      "implementation": {
        "status": "in-entwicklung",
        "operator": "Landkreis Musterland",
        "operatorOrg": "musterland",
        "parties": {
          "stakeholders": [
            "Kreisleitstelle",
            "Gemeinden des Kreises"
          ],
          "serviceProviders": [
            "Hersteller der Sirenensteuerung (Statusmeldungen)"
          ]
        },
        "stack": [
          "Sirenensteuerung",
          "MQTT",
          "FROST-Server",
          "NiFi",
          "Geoportal"
        ],
        "resources": {
          "cost": "M, unter 10.000 Euro",
          "effort": "M, unter 50 Tage",
          "costBand": "m",
          "setupCost": "m",
          "runningCost": "s",
          "effortBand": "m",
          "funding": "Förderprogramm für Sirenen, ergänzt aus Haushaltsmitteln",
          "note": "Die Sirenen selbst kommen aus dem Förderprogramm; hier geht es nur um die Anbindung ihrer Statusmeldungen."
        },
        "logicModel": {
          "input": "Standorte der Sirenen, Statusmeldungen der Sirenensteuerung und die Liste der Lautsprecherfahrzeuge.",
          "output": "Eine Karte der Warnmittel mit Betriebszustand, Reichweite und letztem Probealarm.",
          "outcome": "Die Leitstelle sieht vor einer Warnung, wo keine Sirene funktioniert.",
          "impact": "Lücken in der Warnung werden geschlossen, bevor sie im Ernstfall auffallen."
        },
        "collaboration": {
          "wanted": true,
          "seeking": "Kreise mit derselben Sirenensteuerung - für eine gemeinsame Anbindung der Statusmeldungen."
        },
        "reference": {
          "url": "https://musterland.example/bevoelkerungsschutz/warnung",
          "source": "Seite des Landkreises Musterland"
        }
      },
      "title": "Sirenen und Warnmittel",
      "summary": "Standorte und Betriebszustand der Sirenen, dazu Lautsprecherfahrzeuge und das in MoWaS geschulte Personal.",
      "description": "Die Sirenen im Kreis melden ihren Zustand an die Steuerung. Der Kreis führt sie zusammen mit den Lautsprecherfahrzeugen auf einer Karte, mit Reichweite und letztem Probealarm. In Entwicklung im Landkreis Musterland; ein installierbares Paket gibt es noch nicht.",
      "publisher": "Landkreis Musterland",
      "categories": [
        "Katastrophenschutz & Sicherheit"
      ],
      "curationTier": "experimental",
      "compatibility": [
        "2.0"
      ],
      "images": [
        {
          "url": "/dashboard-platzhalter.png",
          "caption": "Sirenen mit Betriebszustand und Reichweite"
        }
      ],
      "links": [
        {
          "title": "Ergebnisse der letzten Probewarnung",
          "url": "https://musterland.example/bevoelkerungsschutz/warnung/probewarnung",
          "description": "Welche Sirenen beim letzten Warntag ausgelöst haben und wo nachgebessert wird."
        }
      ],
      "trust": {
        "maintainer": {
          "name": "Landkreis Musterland",
          "contactUrl": "https://musterland.example/bevoelkerungsschutz"
        },
        "contactPerson": {
          "name": "Stabsstelle Bevölkerungsschutz",
          "role": "Landkreis Musterland",
          "email": "bevoelkerungsschutz@musterland.example"
        },
        "curatedBy": "Open Urban Apps",
        "curatedAt": "2026-11-19",
        "license": "EUPL-1.2"
      },
      "requirements": {
        "coreVersions": [
          "2.0"
        ],
        "components": [
          "PORTAL_BACKEND",
          "FROST",
          "NIFI"
        ],
        "connectors": [
          "MQTT"
        ]
      },
      "modelForge": {
        "datasetId": "urn:core:platform:civitas:dataset:common:Sirenen-Musterland:1.0.0"
      }
    }
  ],
  "dataStructures":   [
    {
      "id": "urn:core:platform:civitas:datastructure:common:GeoPoint:1.0.0",
      "type": "datastructure",
      "displayName": "GeoPoint",
      "description": "Geokoordinate (Breite, Länge) als gemeinsames Element. Wird von Anwendungsfällen mitbenutzt statt neu definiert — deshalb passen ihre Daten zusammen.",
      "version": "1.0.0",
      "maintainer": "Musterverbund Kommunaler Daten",
      "license": "EUPL-1.2",
      "keywords": [
        "geo",
        "basis",
        "element"
      ],
      "domain": "Basis",
      "addedAt": "2026-04-22"
    },
    {
      "id": "urn:core:platform:civitas:datastructure:mobility:TrafficCounterReading:1.0.0",
      "type": "datastructure",
      "displayName": "TrafficCounterReading",
      "description": "Eine Zählstellen-Messung: Fahrzeuganzahl, Durchschnittsgeschwindigkeit, Richtung und Standort — das Format hinter Verkehrszählungen.",
      "version": "1.0.0",
      "maintainer": "Stadt Musterhausen",
      "license": "EUPL-1.2",
      "keywords": [
        "verkehr",
        "zaehlstelle",
        "mobilitaet"
      ],
      "domain": "Mobilität",
      "addedAt": "2026-07-02"
    },
    {
      "id": "urn:core:platform:civitas:datastructure:environment:AirQualityReading:1.0.0",
      "type": "datastructure",
      "displayName": "AirQualityReading",
      "description": "Eine Luftqualitätsmessung: PM2.5 und PM10 mit Zeitpunkt und Standort — anschlussfähig an gängige Sensor-Bausätze.",
      "version": "1.0.0",
      "maintainer": "Stadt Musterhausen",
      "license": "EUPL-1.2",
      "keywords": [
        "luftqualitaet",
        "feinstaub",
        "umwelt"
      ],
      "domain": "Umwelt",
      "addedAt": "2026-05-20"
    },
    {
      "id": "urn:core:platform:civitas:datastructure:demo:TreeRecord:1.0.0",
      "type": "datastructure",
      "displayName": "TreeRecord",
      "description": "Ein Baumeintrag: Art, Standort, Pflanzjahr und Zustand — die gemeinsame Grundlage für Baumkataster und Pflegeplanung.",
      "version": "1.0.0",
      "maintainer": "Stadt Musterstadt",
      "license": "EUPL-1.2",
      "keywords": [
        "baum",
        "kataster",
        "gruenflaechen"
      ],
      "domain": "Umwelt",
      "addedAt": "2026-08-28"
    }
  ],
  "organisations": [
    {
      "id": "musterhausen",
      "name": "Stadt Musterhausen",
      "website": "https://musterhausen.example",
      "contact": {
        "name": "Digitalisierung und Smart City",
        "email": "digital@musterhausen.example"
      }
    },
    {
      "id": "musterstadt",
      "name": "Stadt Musterstadt",
      "website": "https://musterstadt.example"
    },
    {
      "id": "musterbach",
      "name": "Gemeinde Musterbach"
    },
    {
      "id": "openurbanapps",
      "name": "Open Urban Apps",
      "website": "https://openurbanapps.org"
    },
    {
      "id": "civitasconnect",
      "name": "Civitas Connect e. V.",
      "website": "https://civitasconnect.digital"
    },
    {
      "id": "musterland",
      "name": "Landkreis Musterland",
      "website": "https://musterland.example",
      "contact": {
        "name": "Stabsstelle Bevölkerungsschutz",
        "email": "bevoelkerungsschutz@musterland.example"
      }
    }
  ],
  "groups": [
    {
      "id": "saubere-luft-hauptstrasse",
      "title": "Saubere Luft an der Hauptstraße",
      "summary": "Verkehr, Feinstaub und bald Lärm an einer Straße gemeinsam messen, um Tempo 30 zu begründen.",
      "description": "Musterhausen misst an der Hauptstraße, was der Verkehr dort bewirkt. Die Verkehrszählung zeigt, wie viele Fahrzeuge wie schnell fahren, die Feinstaubmessung, was in der Luft ankommt. Beide nutzen dieselben Standorte, deshalb lassen sich die Werte nebeneinanderlegen.",
      "publisher": "Stadt Musterhausen",
      "publisherOrg": "musterhausen",
      "categories": ["Mobilität & Verkehr", "Umwelt & Klima"],
      "ordered": true,
      "members": [
        {
          "id": "musterhausen-trafficcounter",
          "note": "Zuerst: die Zählstellen legen die Standorte fest, an denen auch gemessen wird."
        },
        {
          "id": "musterhausen-feinstaub",
          "note": "Misst an denselben Standorten wie die Zählstellen."
        },
        {
          "id": "musterhausen-laermmessung",
          "optional": true,
          "note": "Geplant, noch kein Paket."
        }
      ],
      "story": {
        "problem": "An der Hauptstraße werden die Feinstaub-Grenzwerte an heißen Tagen überschritten, und Anwohnende klagen über Lärm. Ob Tempo 30 hilft, war bisher Meinung gegen Meinung.",
        "goal": "Verkehr, Luft und Lärm an denselben Punkten messen, damit der Stadtrat über Tempo 30 mit Zahlen entscheiden kann.",
        "next": "2027 kommen Lärmsensoren dazu. Danach ein halbes Jahr Tempo 30 zur Probe, mit Messung davor und danach."
      },
      "links": [
        {
          "title": "Ratsbeschluss: Tempo 30 zur Probe",
          "url": "https://musterhausen.example/rat/beschluesse/2026-041",
          "description": "Der Beschluss, der die Messung vor und nach der Probephase verlangt."
        },
        {
          "title": "Messwerte als offene Daten",
          "url": "https://opendata.musterhausen.example/hauptstrasse",
          "description": "Verkehrszählung und Feinstaub an der Hauptstraße zum Herunterladen."
        }
      ],
      "contact": { "name": "Digitalisierung und Smart City", "email": "digital@musterhausen.example" },
      "addedAt": "2026-11-02",
      "updatedAt": "2026-11-10"
    },
    {
      "id": "klimaresilienz-musterstadt",
      "title": "Klimaresilienz Musterstadt",
      "summary": "Stadtbäume, Hitzeinseln und Gießpatenschaften aus dem Smart-City-Projekt der Stadt Musterstadt.",
      "description": "Im Smart-City-Projekt bündelt Musterstadt, was gegen Hitze in der Innenstadt hilft: ein gemeinsamer Baumbestand, eine Karte der heißesten Orte und Anwohnende, die junge Bäume gießen. Jeder Teil läuft für sich; zusammen zeigen sie, wo Schatten fehlt und wer sich kümmert.",
      "publisher": "Stadt Musterstadt",
      "publisherOrg": "musterstadt",
      "categories": ["Umwelt & Klima"],
      "members": [
        {
          "id": "tree-register-starter",
          "note": "Die gemeinsame Grundlage: welcher Baum wo steht."
        },
        {
          "id": "musterstadt-hitzeinseln",
          "note": "Zeigt, wo Schatten am dringendsten fehlt."
        },
        {
          "id": "musterstadt-giesspatenschaften",
          "note": "Nutzt das Baumkataster für die Karte der Patenbäume."
        },
        {
          "id": "musterhausen-feinstaub",
          "optional": true,
          "note": "Von Musterhausen übernommen: misst an den Hitzefühlern auch die Luft."
        }
      ],
      "story": {
        "problem": "Die Innenstadt heizt sich im Sommer stark auf, und viele junge Straßenbäume vertrocknen in ihren ersten Jahren.",
        "goal": "Sehen, wo es am heißesten ist, die Bäume dort erhalten und Anwohnende beim Gießen einbinden.",
        "next": "2027 sollen Hitzeinseln und Gießpatenschaften als installierbare Pakete folgen."
      },
      "links": [
        {
          "title": "Smart-City-Strategie der Stadt Musterstadt",
          "url": "https://musterstadt.example/smart-city/strategie",
          "description": "Wo das Projekt herkommt: das Handlungsfeld Klima und seine Maßnahmen."
        }
      ],
      "contact": { "name": "Team Smart City", "email": "smartcity@musterstadt.example" },
      "addedAt": "2026-11-12",
      "updatedAt": "2026-11-12"
    },
    {
      "id": "kreisbeschreibung-musterland",
      "title": "Kreisbeschreibung Landkreis Musterland",
      "summary": "Die Grundlagendaten für die Zivile Verteidigung nach dem Muster des BBK - je Abschnitt ein Anwendungsfall, geteilt ohne Daten.",
      "description": "Mit der Kreisbeschreibung erfassen Kreise und kreisfreie Städte an einer Stelle, was sie für die Zivile Verteidigung wissen müssen: von der Bevölkerung über Wasser und Gesundheit bis zur Warnung. Der Landkreis Musterland führt die Abschnitte, die sich als Daten pflegen lassen, auf seiner Datenplattform. Jeder Abschnitt ist ein eigener Anwendungsfall. Geteilt werden Datenstrukturen, Karten und Auswertungen - die Daten selbst nie, denn gesammelt sind sie nur für den Dienstgebrauch (VS-NfD).",
      "publisher": "Landkreis Musterland",
      "publisherOrg": "musterland",
      "categories": [
        "Katastrophenschutz & Sicherheit"
      ],
      "members": [
        {
          "id": "musterhausen-trafficcounter",
          "optional": true,
          "note": "Abschnitt 5.4.2 Pendlerbewegungen: die Zählstellen der Stadt Musterhausen zeigen Pendlerströme und Stoßzeiten auf den Hauptachsen."
        },
        {
          "id": "musterland-tag-nacht-bevoelkerung",
          "note": "Abschnitt 5.4.3: wer tagsüber und nachts in jeder Gemeinde ist - die Grundlage für Evakuierungen."
        },
        {
          "id": "musterland-loeschwasser",
          "note": "Abschnitt 5.6.2 Löschwasser: Hydranten, Brunnen und Teiche mit Nennleistung."
        },
        {
          "id": "musterland-krankenhauskapazitaeten",
          "note": "Abschnitt 5.13.1 Krankenhäuser: freie Betten, Intensivbetten, Notstrom und Landeplatz."
        },
        {
          "id": "musterland-notunterkuenfte",
          "note": "Abschnitt 5.14.3 Betreuung und Unterbringung: Schulen, Hallen und Hotels mit ihren Plätzen."
        },
        {
          "id": "musterland-schutzraeume",
          "note": "Abschnitt 5.17 Schutzraumbauten: Schutzräume und mögliche Zufluchtsorte."
        },
        {
          "id": "musterland-sirenen",
          "note": "Abschnitt 5.18 Warnung der Bevölkerung: Sirenen und weitere Warnmittel."
        }
      ],
      "story": {
        "problem": "Die Angaben für die Kreisbeschreibung liegen verstreut in Fachämtern, Feuerwehrbedarfsplänen und Tabellen. Sie müssen regelmäßig aktualisiert werden, damit im Ereignisfall schnell und sicher entschieden werden kann.",
        "goal": "Jeden Abschnitt als Datensatz mit festen Feldern pflegen: Standort, Kapazität, Notstromversorgung und ein Kontakt, der rund um die Uhr erreichbar ist. So entsteht die Kreisbeschreibung aus aktuellen Daten statt aus einem Dokument.",
        "next": "2027 folgen Energie, Wasser und Ernährung. Das BBK erarbeitet ein ergänzendes Dokument zur digitalen Umsetzung - danach werden die Felder daran angeglichen."
      },
      "links": [
        {
          "title": "Muster: Kreisbeschreibung für Zwecke der Zivilen Verteidigung (BBK, Mai 2026)",
          "url": "https://www.bbk.bund.de/SharedDocs/Downloads/DE/Mediathek/Publikationen/KRITIS/kreisbeschreibung-zv.pdf?__blob=publicationFile&v=2",
          "description": "Die Vorlage mit allen 19 Themenbereichen, nach der die Abschnitte gegliedert sind."
        }
      ],
      "contact": {
        "name": "Stabsstelle Bevölkerungsschutz",
        "email": "bevoelkerungsschutz@musterland.example"
      },
      "addedAt": "2026-11-19",
      "updatedAt": "2026-11-19"
    }
  ]
};

export const mockRepoListIndex: RepoListIndex = repoListIndexSchema.parse(RAW_INDEX);
