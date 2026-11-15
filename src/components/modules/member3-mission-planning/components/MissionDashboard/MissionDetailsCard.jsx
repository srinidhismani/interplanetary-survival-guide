import React, { useState } from 'react';
import styles from '../../styles/missionDashboard.module.css';

/**
 * Mission Details Card
 * Allows entering and editing mission name and managing exploration objectives.
 */
export default function MissionDetailsCard({
  missionDetails,
  onUpdateMissionName,
  onAddObjective,
  onToggleObjective,
  onRemoveObjective,
  onResetObjectives
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(missionDetails.name);
  const [newObjectiveText, setNewObjectiveText] = useState('');

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateMissionName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newObjectiveText.trim()) {
      onAddObjective(newObjectiveText.trim());
      setNewObjectiveText('');
    }
  };

  const completedCount = missionDetails.objectives.filter(o => o.completed).length;
  const totalObjectives = missionDetails.objectives.length;

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.cardSectionBadge}>OPERATIONAL PARAMETERS</span>
          <div className={styles.missionTitleRow}>
            {isEditingName ? (
              <div className={styles.nameEditGroup}>
                <input
                  type="text"
                  className={styles.nameInput}
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  autoFocus
                />
                <button type="button" className={styles.saveBtn} onClick={handleSaveName}>
                  Save
                </button>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsEditingName(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className={styles.titleDisplayGroup}>
                <h3 className={styles.missionMainTitle}>{missionDetails.name}</h3>
                <button
                  type="button"
                  className={styles.editIconBtn}
                  onClick={() => {
                    setTempName(missionDetails.name);
                    setIsEditingName(true);
                  }}
                  title="Edit Mission Name"
                >
                  ✏️ Edit
                </button>
              </div>
            )}
          </div>
          <p className={styles.missionSubtext}>
            {missionDetails.description} • <strong>Sol {missionDetails.sol}</strong> • {missionDetails.roverModel}
          </p>
        </div>

        <div className={styles.objectiveProgressPill}>
          <span>Objectives:</span>
          <strong>{completedCount} / {totalObjectives} Done</strong>
        </div>
      </div>

      {/* Exploration Objectives Management */}
      <div className={styles.objectivesSection}>
        <div className={styles.subHeaderRow}>
          <span className={styles.subTitle}>Exploration Objectives ({totalObjectives}):</span>
          <span className={styles.hintText}>Click checkbox to toggle status</span>
        </div>

        {/* Objectives List */}
        <div className={styles.objectivesList}>
          {missionDetails.objectives.map((obj) => (
            <div key={obj.id} className={styles.objectiveItem}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={obj.completed}
                  onChange={() => onToggleObjective(obj.id)}
                  className={styles.customCheckbox}
                />
                <span className={obj.completed ? styles.objectiveTextDone : styles.objectiveText}>
                  {obj.text}
                </span>
              </label>

              <button
                type="button"
                className={styles.removeObjBtn}
                onClick={() => onRemoveObjective(obj.id)}
                title="Remove Objective"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add New Objective Form */}
        <form onSubmit={handleAddSubmit} className={styles.addObjectiveForm}>
          <input
            type="text"
            className={styles.addObjectiveInput}
            placeholder="Add new science or navigational objective..."
            value={newObjectiveText}
            onChange={(e) => setNewObjectiveText(e.target.value)}
          />
          <button type="submit" className={styles.addObjButton} disabled={!newObjectiveText.trim()}>
            + Add Objective
          </button>
        </form>
      </div>
    </div>
  );
}
