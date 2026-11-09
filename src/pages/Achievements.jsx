import { useStudy } from '../context/useStudy';

export default function Achievements() {
  const { user, badges } = useStudy();

  const currentLevel = user?.level || 1;
  const currentXp = user?.xp || 0;
  
  // 200 XP per level
  const nextLevelThreshold = currentLevel * 200;
  const levelProgress = ((currentXp - (currentLevel - 1) * 200) / 200) * 100;
  const xpNeeded = Math.max(0, nextLevelThreshold - currentXp);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-2 border-b border-edge">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lavender dark:bg-purple/20 text-purple dark:text-violet text-xs font-semibold mb-1">
          <span className="material-symbols-outlined text-xs">military_tech</span>
          <span>Scholar Gamification</span>
        </div>
        <h1 className="font-heading text-xl md:text-2xl font-bold text-content tracking-tight">Achievements & Badges</h1>
        <p className="text-xs text-content-sub">Earn XP through focused study intervals, habit consistency, and completed goals.</p>
      </div>

      {/* Level Progression Panel */}
      <div className="bg-card border border-edge p-6 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* Level Circle */}
          <div className="w-20 h-20 rounded-2xl bg-lavender dark:bg-purple/20 border border-purple/30 flex flex-col items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-purple">Level</span>
            <span className="font-heading text-3xl font-extrabold text-purple leading-none">{currentLevel}</span>
          </div>
          <div className="space-y-2 flex-1">
            <h2 className="font-heading text-base font-bold text-content">Academic Progression</h2>
            <p className="text-xs text-content-sub leading-relaxed">
              Total earned: <span className="font-semibold text-purple">{currentXp} XP</span>. 
              Earn <span className="font-semibold text-purple">{xpNeeded} XP</span> more to reach Level {currentLevel + 1}.
            </p>
            {/* Level progress bar */}
            <div className="h-2 w-full max-w-md bg-surface-alt rounded-full overflow-hidden border border-edge">
              <div 
                className="h-full bg-purple rounded-full transition-all duration-300" 
                style={{ width: `${Math.max(0, Math.min(100, levelProgress))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Badge summary */}
        <div className="bg-surface-alt px-5 py-3 rounded-xl border border-edge text-center shrink-0 w-full md:w-auto">
          <p className="text-[11px] font-medium text-content-dim mb-0.5">Badges Unlocked</p>
          <p className="font-heading text-2xl font-bold text-purple">{unlockedCount} <span className="text-xs font-normal text-content-dim">/ {badges.length}</span></p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-3">
        <h2 className="font-heading text-sm font-bold text-content">Badge Showcase</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id} 
              className={`p-4 rounded-xl border transition-colors flex items-start gap-3.5 ${
                badge.unlocked 
                  ? 'bg-card border-edge shadow-xs hover:border-purple/30' 
                  : 'bg-surface-alt/50 border-edge/60 opacity-60'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                badge.unlocked 
                  ? 'bg-lavender dark:bg-purple/20 border border-purple/30' 
                  : 'bg-surface-alt border border-edge'
              }`}>
                {badge.unlocked ? badge.icon : '🔒'}
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-content truncate">{badge.title}</h3>
                  {badge.unlocked && (
                    <span className="material-symbols-outlined text-success text-sm shrink-0">check_circle</span>
                  )}
                </div>
                <p className="text-[11px] text-content-sub leading-relaxed">{badge.description}</p>
                {badge.unlocked ? (
                  <span className="inline-block text-[10px] font-semibold text-success bg-success-soft px-2 py-0.5 rounded-md mt-0.5">
                    Unlocked
                  </span>
                ) : (
                  <span className="inline-block text-[10px] font-medium text-content-dim mt-0.5">
                    Locked milestone
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
