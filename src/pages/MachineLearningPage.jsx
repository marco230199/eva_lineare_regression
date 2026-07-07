import { useState } from "react";

const SORT_ZONES = [
  { key: "before", label: "Vor dem Training" },
  { key: "during", label: "Beim Training" },
  { key: "after", label: "Nach dem Training" },
  { key: "discard", label: "Ausgeschieden (falsch)" },
];

const SORT_CARDS = [
  {
    id: "A",
    text: "Die Entwickler legen die Frage fest: Wie hoch ist die Kaltmiete einer Wohnung, wenn bestimmte Eigenschaften der Wohnung bekannt sind?",
    zone: "before",
  },
  {
    id: "B",
    text: "Es werden Daten über viele bereits vermietete Wohnungen gesammelt (z. B. Wohnfläche und Kaltmiete).",
    zone: "before",
  },
  {
    id: "C",
    text: "Die Daten werden überprüft; fehlende oder falsche Angaben werden entfernt oder korrigiert.",
    zone: "before",
  },
  {
    id: "D",
    text: "Es wird festgelegt, welche Angaben das Modell verwenden soll (z. B. Wohnfläche als Eingabe, Kaltmiete als Ziel).",
    zone: "before",
  },
  {
    id: "E",
    text: "Die vorhandenen Daten werden in Trainingsdaten und Testdaten aufgeteilt.",
    zone: "before",
  },
  {
    id: "F",
    text: "Als Modell wird zunächst eine lineare Regression verwendet, die eine Gerade findet, die gut passt.",
    zone: "during",
  },
  {
    id: "G",
    text: "Das Modell macht mit den Trainingsdaten Vorhersagen und berechnet die Abweichungen zu den tatsächlichen Werten.",
    zone: "during",
  },
  {
    id: "H",
    text: "Die Lage der Regressionsgeraden wird schrittweise verändert, um Fehler zu minimieren — das ist Training.",
    zone: "during",
  },
  {
    id: "I",
    text: "Das fertige Modell wird mit Testdaten überprüft (Daten, die es beim Training nicht gesehen hat).",
    zone: "after",
  },
  {
    id: "J",
    text: "Vorhersagen werden mit den tatsächlichen Mieten aus den Testdaten verglichen, um die Qualität zu beurteilen.",
    zone: "after",
  },
  {
    id: "K",
    text: "Die Ergebnisse werden kritisch untersucht: Genauigkeit, Ausgewogenheit der Daten und Anwendbarkeit prüfen.",
    zone: "after",
  },
  {
    id: "L",
    text: "Das überprüfte Modell kann nun für eine neue Wohnung eine Miete vorhersagen.",
    zone: "after",
  },
  {
    id: "M",
    text: "Da die Maschine trainiert wurde, versteht sie nun selbstständig, was eine Wohnung ist und warum eine bestimmte Miete gerecht ist.",
    zone: "discard",
  },
  {
    id: "N",
    text: "Die Testdaten werden während des Trainings immer wieder verwendet, bis das Modell bei diesen Daten möglichst gute Ergebnisse erzielt.",
    zone: "discard",
  },
];

function shuffle(items) {
  return items
    .map((item) => ({
      item,
      order: Math.random(),
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ item }) => item);
}

export default function SortCardsActivity() {
  const [cards, setCards] = useState(() => shuffle(SORT_CARDS));
  const [placement, setPlacement] = useState({});
  const [checked, setChecked] = useState(false);
  const [selectedLearningAnswer, setSelectedLearningAnswer] = useState("");

  const zoneToCards = SORT_ZONES.reduce(
    (result, zone) => ({
      ...result,
      [zone.key]: Object.keys(placement).filter(
        (cardId) => placement[cardId] === zone.key
      ),
    }),
    {}
  );

  function handleDragStart(event, cardId) {
    event.dataTransfer.setData("text/plain", cardId);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDropToZone(event, zoneKey) {
    event.preventDefault();

    const cardId = event.dataTransfer.getData("text/plain");

    if (!cardId) {
      return;
    }

    setPlacement((current) => ({
      ...current,
      [cardId]: zoneKey,
    }));

    setChecked(false);
  }

  function handleReturn(cardId) {
    setPlacement((current) =>
      Object.fromEntries(
        Object.entries(current).filter(
          ([placedCardId]) => placedCardId !== cardId
        )
      )
    );

    setChecked(false);
  }

  function reset() {
    setCards(shuffle(SORT_CARDS));
    setPlacement({});
    setChecked(false);
  }

  const correctCount = Object.entries(placement).filter(
    ([cardId, zoneKey]) =>
      SORT_CARDS.find((card) => card.id === cardId)?.zone === zoneKey
  ).length;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        backgroundColor: "#0d1117",
        color: "#e6edf3",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "16px",
          border: "1px solid #30363d",
          borderRadius: "8px",
          backgroundColor: "#161b22",
        }}
      >
        <h1
          style={{
            margin: "0 0 12px",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          Wie lernt eine Maschine? — Kartensortierung
        </h1>

        <p style={{ marginTop: 0, color: "#c9d1d9" }}>
          Ziehe die Karten in die passende Phase:{" "}
          <strong>Vor dem Training</strong>,{" "}
          <strong>Beim Training</strong>,{" "}
          <strong>Nach dem Training</strong> oder{" "}
          <strong>Ausgeschieden</strong>.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <button onClick={() => setChecked(true)}>Prüfen</button>
          <button onClick={reset}>Neu mischen</button>

          <span style={{ marginLeft: "8px", color: "#8b949e" }}>
            {Object.keys(placement).length} / {SORT_CARDS.length} Karten
            einsortiert
          </span>

          {checked && (
            <span style={{ color: "#8b949e" }}>
              · {correctCount} von {SORT_CARDS.length} richtig
            </span>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 1fr) minmax(400px, 2fr)",
            gap: "12px",
          }}
        >
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();

              const cardId =
                event.dataTransfer.getData("text/plain");

              if (cardId) {
                handleReturn(cardId);
              }
            }}
            style={{
              padding: "12px",
              border: "1px solid #30363d",
              borderRadius: "8px",
              backgroundColor: "#0d1117",
            }}
          >
            <div
              style={{
                marginBottom: "8px",
                color: "#c9d1d9",
                fontWeight: 600,
              }}
            >
              Karten
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              {cards
                .filter((card) => !placement[card.id])
                .map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(event) =>
                      handleDragStart(event, card.id)
                    }
                    style={{
                      padding: "10px",
                      border: "1px solid #30363d",
                      borderRadius: "6px",
                      backgroundColor: "#111820",
                      color: "#c9d1d9",
                      cursor: "grab",
                    }}
                  >
                    {card.id}. {card.text}
                  </div>
                ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "8px",
            }}
          >
            {SORT_ZONES.map((zone) => (
              <div
                key={zone.key}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) =>
                  handleDropToZone(event, zone.key)
                }
                style={{
                  minHeight: "160px",
                  padding: "10px",
                  border: "2px dashed #30363d",
                  borderRadius: "8px",
                  backgroundColor: "#0d1117",
                }}
              >
                <div
                  style={{
                    marginBottom: "8px",
                    fontWeight: 700,
                    color: "#e6edf3",
                  }}
                >
                  {zone.label}
                </div>

                <div style={{ display: "grid", gap: "6px" }}>
                  {zoneToCards[zone.key].map((cardId) => {
                    const card = SORT_CARDS.find(
                      (item) => item.id === cardId
                    );

                    const isCorrect = checked
                      ? card?.zone === zone.key
                      : null;

                    return (
                      <div
                        key={cardId}
                        draggable
                        onDragStart={(event) =>
                          handleDragStart(event, cardId)
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px",
                          border: "1px solid #30363d",
                          borderRadius: "6px",
                          backgroundColor:
                            isCorrect === null
                              ? "#111820"
                              : isCorrect
                                ? "#163b1f"
                                : "#3d1010",
                          color: "#c9d1d9",
                          cursor: "grab",
                        }}
                      >
                        <div
                          style={{
                            paddingRight: "8px",
                            fontSize: "13px",
                          }}
                        >
                          {cardId}. {card?.text}
                        </div>

                        <button
                          type="button"
                          aria-label={`Karte ${cardId} zurücklegen`}
                          onClick={() => handleReturn(cardId)}
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#8b949e",
                            cursor: "pointer",
                          }}
                        >
                          ↩
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p
          style={{
            marginBottom: 0,
            color: "#8b949e",
            fontSize: "13px",
          }}
        >
          Hinweis: Zwei Karten sind absichtlich falsch oder irreführend
          und gehören in „Ausgeschieden“.
        </p>

        <section
          style={{
            marginTop: "24px",
            padding: "16px",
            border: "1px solid #30363d",
            borderRadius: "8px",
            backgroundColor: "#0f1720",
          }}
        >
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            Zusatzauftrag 2: Was bedeutet „lernen"?
          </h2>

          <p style={{ color: "#c9d1d9", marginTop: 0 }}>
            Entscheide, welche Aussage am besten beschreibt, was mit „Lernen"
            bei einer Maschine gemeint ist.
          </p>

          <div style={{ display: "grid", gap: "10px", marginTop: "16px" }}>
            {[
              {
                id: "1",
                label:
                  "Die Maschine denkt über die Aufgabe nach und versteht nach einiger Zeit das Problem.",
              },
              {
                id: "2",
                label:
                  "Das Modell verändert seine Einstellungen so, dass seine Vorhersagen bei den Trainingsdaten möglichst wenige Fehler machen.",
              },
              {
                id: "3",
                label:
                  "Die Maschine speichert jede einzelne Antwort und gibt bei einer neuen Aufgabe eine gespeicherte Antwort zurück.",
              },
            ].map((option) => (
              <label
                key={option.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${
                    selectedLearningAnswer === option.id
                      ? "#1f6feb"
                      : "#30363d"
                  }`,
                  backgroundColor: "#111820",
                  color: "#c9d1d9",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="learning-answer"
                  value={option.id}
                  checked={selectedLearningAnswer === option.id}
                  onChange={(event) =>
                    setSelectedLearningAnswer(event.target.value)
                  }
                  style={{ marginTop: "4px" }}
                />
                <span style={{ lineHeight: 1.5 }}>{option.label}</span>
              </label>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}