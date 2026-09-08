import re

with open("c:/Users/Sithum/.gemini/antigravity-ide/scratch/smart-hotel-system/frontend/src/app/features/admin/admin-dashboard/admin-dashboard.component.ts", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove Staff Report button
content = re.sub(
    r'<button \(click\)="showStaffModal = true"[\s\S]*?</button>\s*',
    '',
    content
)

# 2. Replace Tabbed Main Content (Kanban) with Staff Overview
staff_overview_html = """          <!-- ─── Staff Overview Main Content ─── -->
          <div class="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl">
            <div class="px-5 pt-5 flex justify-between items-center shrink-0">
              <div>
                <h2 class="font-black text-white text-lg">Staff Overview</h2>
                <p class="text-slate-500 text-xs mt-0.5">{{ availableStaff.length }} members · Live workload</p>
              </div>
            </div>

            <!-- Tabs -->
            <div class="flex bg-slate-950/50 p-1 mx-5 mt-2 rounded-xl gap-1 shrink-0 w-fit">
              <button (click)="dashboardTab = 'availability'"
                      [ngClass]="dashboardTab === 'availability' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'"
                      class="px-5 py-2 text-xs font-bold rounded-lg transition-all">Availability</button>
              <button (click)="dashboardTab = 'performance'"
                      [ngClass]="dashboardTab === 'performance' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'"
                      class="px-5 py-2 text-xs font-bold rounded-lg transition-all">Performance</button>
            </div>

            <div class="p-5 flex flex-col gap-3 flex-1 overflow-y-auto custom-scroll">
              <!-- Availability Tab -->
              <ng-container *ngIf="dashboardTab === 'availability'">
                <div *ngFor="let staff of availableStaff"
                     class="flex flex-col gap-2 p-3.5 rounded-xl border transition-all"
                     [ngClass]="staff.load === 0 ? 'bg-teal-500/5 border-teal-500/20' : 'bg-slate-800 border-slate-700'">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 shrink-0"
                         [ngClass]="staff.load === 0 ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-slate-700 text-slate-300 border-slate-600'">
                      {{ staff.name.charAt(0) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold text-white text-sm truncate">{{ staff.name.split(' (')[0] }}</p>
                      <p class="text-slate-500 text-[10px] uppercase tracking-wider">{{ staff.name.split(' (')[1]?.replace(')', '') || 'Staff' }}</p>
                    </div>
                    <div class="flex flex-col items-end gap-1.5 shrink-0">
                      <span class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border"
                            [ngClass]="staff.load === 0 ? 'bg-teal-500/15 text-teal-400 border-teal-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'">
                        {{ staff.load === 0 ? 'Available' : staff.load + ' Task' + (staff.load > 1 ? 's' : '') }}
                      </span>
                      <!-- Workload bar -->
                      <div class="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-500"
                             [ngClass]="staff.load === 0 ? 'bg-teal-400' : staff.load === 1 ? 'bg-amber-400' : 'bg-red-400'"
                             [style.width]="Math.min(staff.load / 3 * 100, 100) + '%'"></div>
                      </div>
                    </div>
                  </div>
                  <!-- Assigned Tasks List -->
                  <div *ngIf="staff.tasks && staff.tasks.length > 0" class="mt-2 pt-2 border-t border-slate-700/50 flex flex-col gap-1.5">
                    <div *ngFor="let task of staff.tasks" class="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                       <div class="flex items-center gap-2">
                         <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{{ task.type || 'Service' }}</span>
                         <span class="text-xs text-slate-400">Room {{ task.roomToken }}</span>
                       </div>
                       <span class="text-[9px] font-bold uppercase" [ngClass]="task.status === 'IN_PROGRESS' ? 'text-blue-400' : 'text-amber-400'">
                         {{ task.status === 'IN_PROGRESS' ? 'Active' : 'Queued' }}
                       </span>
                    </div>
                  </div>
                </div>
              </ng-container>

              <!-- Performance Tab -->
              <ng-container *ngIf="dashboardTab === 'performance'">
                <div class="flex justify-between items-center mb-1">
                  <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Leaderboard</h3>
                  <button (click)="downloadPerformancePDF()"
                          class="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all border border-indigo-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Export PDF
                  </button>
                </div>
                <div *ngFor="let staff of staffPerformanceList; let i = index"
                     class="p-3.5 rounded-xl border border-slate-700 bg-slate-800">
                  <div class="flex justify-between items-center mb-2.5">
                    <div class="flex items-center gap-2.5">
                      <span class="text-lg w-7 text-center leading-none">{{ i === 0 && staff.completed > 0 ? '🏆' : i === 1 && staff.completed > 0 ? '🥈' : i === 2 && staff.completed > 0 ? '🥉' : '' }}</span>
                      <span class="font-bold text-white text-sm">{{ staff.name.split(' (')[0] }}</span>
                    </div>
                    <span class="text-xs font-black px-2.5 py-0.5 rounded-full"
                          [ngClass]="staff.completed > 0 ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-700 text-slate-500'">
                      {{ staff.completed }} Done
                    </span>
                  </div>
                  <div class="w-full bg-slate-700 rounded-full h-1.5">
                    <div class="h-1.5 rounded-full transition-all duration-700"
                         [ngClass]="i === 0 ? 'bg-teal-400' : i === 1 ? 'bg-slate-300' : i === 2 ? 'bg-amber-600' : 'bg-indigo-400'"
                         [style.width.%]="staff.completed > 0 ? staff.percentage : 0"></div>
                  </div>
                </div>
              </ng-container>
            </div>
          </div><!-- /Staff Overview Main Content -->"""

content = re.sub(
    r'<!-- ─── Tabbed Main Content ─── -->[\s\S]*?</div><!-- /Tabbed Main Content -->',
    staff_overview_html,
    content
)

# 3. Remove Modals (Staff Modal and Task Detail Modal)
content = re.sub(
    r'<!-- ═══════════════ STAFF MODAL ═══════════════ -->[\s\S]*?</div><!-- /root -->',
    '</div><!-- /root -->',
    content
)

# 4. Remove component class variables that are no longer needed
content = content.replace("activeScreen: 'new_accepted' | 'in_progress' | 'completed' = 'new_accepted';", "")
content = content.replace("showStaffModal: boolean = false;", "")
content = content.replace("modalTab: 'availability' | 'performance' = 'availability';", "dashboardTab: 'availability' | 'performance' = 'availability';")
content = content.replace("selectedTask: any = null;", "")

with open("c:/Users/Sithum/.gemini/antigravity-ide/scratch/smart-hotel-system/frontend/src/app/features/admin/admin-dashboard/admin-dashboard.component.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated admin-dashboard.component.ts successfully.")
