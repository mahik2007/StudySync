import { useStudy } from '../context/useStudy';

export default function Achievements() {
  const { user, badges } = useStudy();

  const currentLevel = user?.level || 1;
  const currentXp = user?.xp || 0;
  
  // 200 XP per level
  const nextLevelThreshold = currentLevel * 200;
  const levelProgress = ((currentXp - (currentLevel - 1) * 200) / 200) * 100;
  const xpNeeded = nextLevelThreshold - currentXp;

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Achievements & Badges</h2>
        <p className="text-sm text-on-surface-variant">Track your academic level, XP progress, and unlocked badges.</p>
      </div>

      {/* Gamification Panel */}
      <div className="bg-white dark:bg-inverse-surface p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {/* Level Circle */}
          <div className="w-24 h-24 rounded-full bg-primary-fixed text-primary border-4 border-primary/20 flex flex-col items-center justify-center shadow-inner">
            <span className="text-[10px] font-bold uppercase tracking-wider">Level</span>
            <span className="text-3xl font-extrabold leading-none">{currentLevel}</span>
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-bold text-on-background">Scholar Milestone</h3>
            <p className="text-xs text-on-surface-variant">
              You have earned a total of <span className="text-primary font-bold">{currentXp} XP</span>. 
              Only <span className="text-primary font-bold">{xpNeeded} XP</span> more to reach Level {currentLevel + 1}!
            </p>
            {/* Level progress bar */}
            <div className="h-3 w-64 bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(0, Math.min(100, levelProgress))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Badge summary */}
        <div className="bg-surface-container px-6 py-4 rounded-xl text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Badges Unlocked</p>
          <p className="text-3xl font-extrabold text-primary">{unlockedCount} <span className="text-xs text-on-surface-variant font-normal">/ {badges.length}</span></p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold">Badge Showcase</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div 
              key={badge.id} 
              className={`p-6 rounded-2xl border shadow-sm transition-all duration-300 flex items-start gap-4 ${
                badge.unlocked 
                  ? 'bg-white dark:bg-inverse-surface border-outline-variant/30 opacity-100 hover:shadow-md' 
                  : 'bg-white/40 dark:bg-inverse-surface/40 border-outline-variant/10 opacity-60'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-sm ${
                badge.unlocked ? 'bg-primary-container/10 border border-primary-container/20' : 'bg-surface-container'
              }`}>
                {badge.unlocked ? badge.icon : '🔒'}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-bold text-on-background flex items-center gap-1.5">
                  {badge.title}
                  {badge.unlocked && (
                    <span className="material-symbols-outlined text-emerald-600 text-xs font-bold">check_circle</span>
                  )}
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{badge.description}</p>
                {badge.unlocked && (
                  <p className="text-[9px] text-emerald-700 font-semibold bg-emerald-50 w-fit px-2 py-0.5 rounded-full mt-1">
                    Unlocked: {badge.unlockedAt}
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
