import React from "react";
import ProgressBar from "./ProgressBar";

function clamp0to100(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

// PUBLIC_INTERFACE
export default function SkillProgressList({
  skills,
  onAdjustProgress,
  onSetProgress,
  onSetTarget,
}) {
  /** List of per-skill rows with progress bars and controls. */
  return (
    <section className="card skillsCard" aria-label="Skill progress list">
      <div className="skillsHeader">
        <h2 className="sectionTitle">Progress</h2>
        <p className="sectionSubtitle">Update your progress and targets. Values are clamped to 0–100.</p>
      </div>

      <div className="skillsList" role="list">
        {skills.map((skill) => {
          const onTrack = skill.progress >= skill.target;
          return (
            <div className="skillRow" role="listitem" key={skill.id}>
              <div className="skillTop">
                <div className="skillName">{skill.name}</div>
                <div className={`pill ${onTrack ? "pillSuccess" : "pillNeutral"}`}>
                  {onTrack ? "On track" : "Behind"}
                </div>
              </div>

              <div className="skillMeta">
                <div className="metaItem">
                  <span className="metaLabel">Current</span>
                  <div className="metaControl">
                    <button
                      className="iconBtn"
                      type="button"
                      onClick={() => onAdjustProgress(skill.id, -5)}
                      aria-label={`Decrease ${skill.name} progress by 5`}
                    >
                      −
                    </button>
                    <input
                      className="numberInput"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={100}
                      value={skill.progress}
                      onChange={(e) => onSetProgress(skill.id, clamp0to100(e.target.value))}
                      aria-label={`${skill.name} progress`}
                    />
                    <button
                      className="iconBtn"
                      type="button"
                      onClick={() => onAdjustProgress(skill.id, 5)}
                      aria-label={`Increase ${skill.name} progress by 5`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="metaItem">
                  <span className="metaLabel">Target</span>
                  <input
                    className="numberInput"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={100}
                    value={skill.target}
                    onChange={(e) => onSetTarget(skill.id, clamp0to100(e.target.value))}
                    aria-label={`${skill.name} target`}
                  />
                </div>

                <div className="metaItem metaRight">
                  <span className="metaLabel">Gap</span>
                  <span className="metaValue">
                    {Math.max(0, skill.target - skill.progress)}
                  </span>
                </div>
              </div>

              <div className="skillBarRow">
                <ProgressBar
                  value={skill.progress}
                  label={`${skill.name} progress ${skill.progress} of 100`}
                  variant={onTrack ? "success" : "primary"}
                />
                <div className="skillBarText">
                  <span>{skill.progress}</span>
                  <span className="skillBarTextMuted">/100</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
