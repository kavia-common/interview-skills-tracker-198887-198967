import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import SummaryCards from "./components/SummaryCards";
import RadarChart from "./components/RadarChart";
import SkillProgressList from "./components/SkillProgressList";
import { loadModel, resetModel, saveModel } from "./utils/storage";

function clamp0to100(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function computeMostRecentHistoryAt(skillsMap) {
  const skills = Object.values(skillsMap);
  let mostRecent = null;

  skills.forEach((s) => {
    if (!Array.isArray(s.history)) return;
    s.history.forEach((h) => {
      if (!h || typeof h.at !== "string") return;
      if (!mostRecent || h.at > mostRecent) mostRecent = h.at;
    });
  });

  return mostRecent;
}

// PUBLIC_INTERFACE
function App() {
  /** Interview Prep Tracker dashboard (frontend-only) with localStorage persistence. */
  const [theme, setTheme] = useState("light");
  const [model, setModel] = useState(() => loadModel());

  // Persist model changes.
  useEffect(() => {
    saveModel(model);
  }, [model]);

  const skillsArray = useMemo(() => Object.values(model.skills), [model.skills]);

  const derived = useMemo(() => {
    const progressAvg =
      skillsArray.reduce((acc, s) => acc + clamp0to100(s.progress), 0) / skillsArray.length;

    const onTrack = skillsArray.filter((s) => clamp0to100(s.progress) >= clamp0to100(s.target))
      .length;

    const mostRecent = computeMostRecentHistoryAt(model.skills) || model.lastUpdatedAt;

    return {
      overallProgress: progressAvg,
      onTrackCount: onTrack,
      mostRecentAt: mostRecent,
    };
  }, [skillsArray, model.skills, model.lastUpdatedAt]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setModel(resetModel());
  };

  function updateSkill(skillId, patch, note) {
    const nowIso = new Date().toISOString();

    setModel((prev) => {
      const prevSkill = prev.skills[skillId];
      if (!prevSkill) return prev;

      const nextSkill = {
        ...prevSkill,
        ...patch,
      };

      // Append history entry for progress updates only.
      if (Object.prototype.hasOwnProperty.call(patch, "progress")) {
        const nextProgress = clamp0to100(nextSkill.progress);
        nextSkill.progress = nextProgress;
        nextSkill.history = [
          ...(Array.isArray(prevSkill.history) ? prevSkill.history : []),
          { at: nowIso, progress: nextProgress, note: note || "Updated" },
        ].slice(-200);
      }

      if (Object.prototype.hasOwnProperty.call(patch, "target")) {
        nextSkill.target = clamp0to100(nextSkill.target);
      }

      return {
        ...prev,
        lastUpdatedAt: nowIso,
        skills: {
          ...prev.skills,
          [skillId]: nextSkill,
        },
      };
    });
  }

  // PUBLIC_INTERFACE
  const adjustProgress = (skillId, delta) => {
    const skill = model.skills[skillId];
    if (!skill) return;
    updateSkill(skillId, { progress: clamp0to100(skill.progress + delta) }, `Adjusted by ${delta}`);
  };

  // PUBLIC_INTERFACE
  const setProgress = (skillId, value) => {
    updateSkill(skillId, { progress: clamp0to100(value) }, "Set progress");
  };

  // PUBLIC_INTERFACE
  const setTarget = (skillId, value) => {
    updateSkill(skillId, { target: clamp0to100(value) }, "Set target");
  };

  const radarLabels = skillsArray.map((s) => s.name);
  const radarValues = skillsArray.map((s) => s.progress);
  const radarTargets = skillsArray.map((s) => s.target);

  return (
    <div className="App" data-theme={theme}>
      <Navbar theme={theme} onToggleTheme={toggleTheme} onReset={handleReset} />

      <main className="container">
        <SummaryCards
          overallProgress={derived.overallProgress}
          onTrackCount={derived.onTrackCount}
          lastUpdatedAt={derived.mostRecentAt}
        />

        <section className="mainGrid" aria-label="Dashboard content">
          <RadarChart labels={radarLabels} values={radarValues} targetValues={radarTargets} />
          <SkillProgressList
            skills={skillsArray}
            onAdjustProgress={adjustProgress}
            onSetProgress={setProgress}
            onSetTarget={setTarget}
          />
        </section>

        <footer className="footer">
          <div className="footerText">
            Data is stored locally in your browser (localStorage). No backend required.
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
