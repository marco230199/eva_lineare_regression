import { useState } from "react";

const STATEMENTS = [
  { id: 1, text: "Dem KI-Modell werden große Mengen an Daten bereitgestellt." },
  { id: 2, text: "Das KI-Modell sucht nach mathematischen Mustern in den Daten." },
  { id: 3, text: "Das KI-Modell berechnet (teilweise mit gewaltigem) Rechenaufwand den Zusammenhang der Daten." },
  { id: 4, text: "Für diese Berechnung werden meist auch Algorithmen wie das Newtonverfahren verwendet." },
  { id: 5, text: "Fachleute überprüfen, ob das Modell bei den Fachleuten bekannten Daten richtige Vorhersagen trifft." },
  { id: 6, text: "Das KI-Modell wird veröffentlicht und trifft Vorhersagen zu unbekannten Daten." },
];

function shuffle(array) {
  return array
    .map((item) => ({ item, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ item }) => item);
}

export default function MachineLearningPage() {
  const [items, setItems] = useState(() => shuffle(STATEMENTS));
  const [dragIndex, setDragIndex] = useState(null);
  const [result, setResult] = useState(null);

  function handleDragStart(e, index) {
    e.dataTransfer.setData("text/plain", String(index));
    setDragIndex(index);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e, index) {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/plain"));
    if (Number.isNaN(from)) return;

    const copy = items.slice();
    const [moved] = copy.splice(from, 1);
    copy.splice(index, 0, moved);
    setItems(copy);
    setDragIndex(null);
    setResult(null);
  }

  function checkOrder() {
    const correct = items.every((it, i) => it.id === i + 1);
    const correctCount = items.filter((it, i) => it.id === i + 1).length;
    setResult({ correct, correctCount });
  }

  function reshuffle() {
    setItems(shuffle(STATEMENTS));
    setResult(null);
  }

  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <section style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 22, marginBottom: 6 }}>Ordnungsaufgabe: Ablauf von KI-Modellen</h1>

        <p style={{ color: "#333" }}>
          Ziehe die Aussagen in die richtige Reihenfolge (von 1 → 6) und klicke auf <strong>Prüfen</strong>.
        </p>

        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              style={{
                padding: 12,
                border: "1px solid #ccc",
                borderRadius: 6,
                background: "#fff",
                cursor: "grab",
              }}
            >
              <strong style={{ marginRight: 8 }}>{idx + 1}.</strong>
              {item.text}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
          <button onClick={checkOrder}>Prüfen</button>
          <button onClick={reshuffle}>Neu mischen</button>
          {result && (
            <span style={{ alignSelf: "center", color: result.correct ? "green" : "#333" }}>
              {result.correct ? "Alle Aussagen richtig angeordnet." : `${result.correctCount} von ${STATEMENTS.length} richtig`}
            </span>
          )}
        </div>
      </section>
    </main>
  );
}