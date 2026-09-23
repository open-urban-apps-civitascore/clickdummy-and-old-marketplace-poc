import { repoListIndexSchema, type RepoListIndex } from "@/types/repo-list";

/**
 * Mock catalog fixture — the real repo-list `index.json`
 * (civitas-marketplace-catalog, v1.3.1) **plus local enrichment**, so the mock
 * UI can exercise screens the published catalog has no data for yet. Parsed
 * through the real zod schema at module load: if the fixture ever drifts from
 * the schema, the app fails loudly, not subtly.
 *
 * The enrichment is the optional blocks `trust`, `requirements`, `provides`,
 * `roles`, `implementation` and `addedAt`, the whole `dataStructures` section,
 * plus the trust vocabulary `curationTier` / `deprecated` — see
 * `types/use-cases.ts`, `types/implementation.ts` and `types/curation-tier.ts`.
 * They are NOT in the published index.json yet, because nothing authors or
 * curates them so far.
 *
 * `implementation` (Kosten, Aufwand, Wirkungslogik, Beteiligte) is INVENTED,
 * like the municipalities it describes — Musterstadt and Musterhausen do not
 * exist. Nothing here may be read as a claim about a real commune.
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
      "addedAt": "2026-08-28",
      "implementation": {
        "status": "prototyp",
        "operator": "Stadt Musterstadt",
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
      "title": "Baumkataster Starter App",
      "summary": "Ein kleines, wiederverwendbares Starterpaket für einen kommunalen Baumkataster-Datensatz.",
      "description": "Dieser Demo-Anwendungsfall installiert einen einfachen CORE-Datensatz inklusive einer Datenstruktur für Baumeinträge über das CivitasCore Portal-Backend. Er dient als prototypischer Installationsfluss im Marketplace Add-on.",
      "publisher": "Stadt Musterstadt",
      "categories": [
        "Umwelt",
        "Grünflächen",
        "Kataster"
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
        "productionReferences": [],
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
      "addedAt": "2026-07-02",
      "implementation": {
        "status": "produktiv",
        "operator": "Stadt Musterhausen",
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
        "Mobilität",
        "Verkehr"
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
        "note": "Die Beispieldaten laufen über eine vorkonfigurierte Quelle — Ihre eigenen Displays binden Sie später an, ohne neu zu installieren."
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
        },
        {
          "url": "https://placehold.co/1600x900/eef2f7/5a6b7d.png?text=Platzhalter%0AIm+CIVITAS%2FCORE-Portal",
          "caption": "Der Anwendungsfall im Portal",
          "highlights": [
            "Läuft als Teil der eigenen CIVITAS/CORE-Instanz",
            "Datensatz, Datenstrukturen und Pipeline an einer Stelle",
            "Kein zusätzliches System, keine zweite Anmeldung"
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
        "productionReferences": [
          { "municipality": "Stadt Musterhausen", "since": "2026" },
          { "municipality": "Gemeinde Musterbach", "since": "2026" }
        ],
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
      "addedAt": "2026-05-20",
      "implementation": {
        "status": "produktiv",
        "operator": "Stadt Musterhausen",
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
      "summary": "Feinstaub-Messwerte (PM2.5/PM10) je Messstation als wiederverwendbares Use-Case-Paket.",
      "description": "Die Stadt Musterhausen erfasst Feinstaub (PM2.5/PM10) an Messstationen. Beim Installieren wird der Inhalt direkt aus dem Artefakt-Repo (Tag v1.0.0) geladen und über das CivitasCore Portal-Backend angelegt — der Marketplace liefert nichts davon mit.",
      "publisher": "Stadt Musterhausen",
      "categories": [
        "Umwelt",
        "Luftqualität"
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
        "productionReferences": [{ "municipality": "Stadt Musterhausen", "since": "2026" }],
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
  ]
};

export const mockRepoListIndex: RepoListIndex = repoListIndexSchema.parse(RAW_INDEX);
