import { useStudy } from '../context/useStudy';

export default function Achievements() {
  const { user, badges } = useStudy();

  const currentLevel = user?.level || 1;
  const currentXp = user?.xp || 0;
  
  // 200 XP per level
  const nextLevelThreshold = currentLevel * 200;
  const levelProgress = ((currentXp - (currentLevel - 1) * 200) / 200) * 100;
  const xpNeeded = Math.max(0, nextLevelThreshold - currentXp);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-sm">military_tech</span>
          Academic Milestones
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1b24] dark:text-white tracking-tight">
          Achievements & Badges
        </h2>
        <p className="text-sm font-medium text-[#4b4863] dark:text-[#bbb8d0]">
          Track your scholar level, XP progress, and earned milestone badges.
        </p>
      </div>

      {/* Gamification Panel */}
      <div className="bg-white dark:bg-surface-container p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {/* Level Circle */}
          <div className="w-24 h-24 rounded-full bg-primary-fixed text-primary border-4 border-primary/20 flex flex-col items-center justify-center shadow-inner shrink-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Level</span>
            <span className="text-3xl font-black leading-none">{currentLevel}</span>
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-bold text-[#1b1b24] dark:text-white">Scholar Progression</h3>
            <p className="text-xs text-[#5e5b79] dark:text-[#c4c1dc] font-medium leading-relaxed">
              You have earned a total of <span className="text-primary font-extrabold">{currentXp} XP</span>. 
              Only <span className="text-primary font-extrabold">{xpNeeded} XP</span> more to reach Level {currentLevel + 1}!
            </p>
            {/* Level progress bar */}
            <div className="h-3.5 w-64 md:w-80 bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/20">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(0, Math.min(100, levelProgress))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Badge summary */}
        <div className="bg-surface-container-low px-6 py-4 rounded-2xl border border-outline-variant/20 text-center shrink-0">
          <p className="text-[10px] font-extrabold text-[#5e5b79] dark:text-[#bbb8d0] uppercase tracking-wider mb-1">Badges Unlocked</p>
          <p className="text-3xl font-black text-primary">{unlockedCount} <span className="text-xs text-[#5e5b79] dark:text-[#a5a2bf] font-medium">/ {badges.length}</span></p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">Badge Showcase</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {badges.map((badge) => (
            <div 
              key={badge.id} 
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                badge.unlocked 
                  ? 'bg-white dark:bg-surface-container border-outline-variant/30 shadow-sm hover:border-primary/40' 
                  : 'bg-surface-container-low/60 border-outline-variant/20 opacity-75'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0 ${
                badge.unlocked ? 'bg-primary-fixed/40 border border-primary/20' : 'bg-surface-container border border-outline-variant/20'
              }`}>
                {badge.unlocked ? badge.icon : '🔒'}
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <h4 className="text-sm font-bold text-[#1b1b24] dark:text-white flex items-center gap-1.5">
                  <span className="truncate">{badge.title}</span>
                  {badge.unlocked && (
                    <span className="material-symbols-outlined text-tertiary text-sm font-bold shrink-0">check_circle</span>
                  )}
                </h4>
                <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf] leading-relaxed">{badge.description}</p>
                {badge.unlocked ? (
                  <p className="text-[10px] text-tertiary font-bold bg-tertiary-fixed/30 w-fit px-2 py-0.5 rounded-full mt-1">
                    Unlocked: {badge.unlockedAt || 'Active'}
                  </p>
                ) : (
                  <p className="text-[10px] text-[#5e5b79] dark:text-[#bbb8d0] font-semibold mt-1">
                    Complete task to unlock
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
