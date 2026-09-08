import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full overflow-y-auto bg-slate-950 text-white font-sans">
      
      <!-- Main Content -->
      <main class="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h2 class="text-2xl font-bold text-white mb-1">Staff Management</h2>
                <p class="text-slate-400 text-sm">Manage, monitor, and optimize hotel personnel.</p>
            </div>
            <button class="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm">
                + ADD NEW STAFF
            </button>
        </div>

        <!-- Dashboard Widgets -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Total Staff Members -->
            <div class="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col justify-between relative overflow-hidden">
                <div class="flex justify-between items-start mb-6">
                    <p class="text-slate-400 font-bold text-sm">Total Staff Members</p>
                    <span class="bg-teal-500/20 text-teal-400 text-xs font-bold px-3 py-1 rounded-full">88% Active</span>
                </div>
                <h3 class="text-5xl font-bold text-white">124</h3>
                <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
            </div>

            <!-- Shift Distribution -->
            <div class="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h3 class="text-slate-400 font-bold text-sm mb-4">Shift Distribution</h3>
                <div class="space-y-3">
                    <div class="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">☀️</div>
                            <div>
                                <p class="text-white font-bold text-sm">Morning Shift</p>
                                <p class="text-slate-500 text-xs">06:00 - 14:00</p>
                            </div>
                        </div>
                        <p class="text-white font-bold text-lg">42 <span class="text-slate-500 text-xs font-normal">Staff</span></p>
                    </div>
                    <div class="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">⛅</div>
                            <div>
                                <p class="text-white font-bold text-sm">Afternoon Shift</p>
                                <p class="text-slate-500 text-xs">14:00 - 22:00</p>
                            </div>
                        </div>
                        <p class="text-white font-bold text-lg">38 <span class="text-slate-500 text-xs font-normal">Upcoming</span></p>
                    </div>
                    <div class="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">🌙</div>
                            <div>
                                <p class="text-white font-bold text-sm">Night Shift</p>
                                <p class="text-slate-500 text-xs">22:00 - 06:00</p>
                            </div>
                        </div>
                        <p class="text-white font-bold text-lg">14 <span class="text-slate-500 text-xs font-normal">On Deck</span></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Staff Directory Table -->
        <div class="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 overflow-hidden">
            <div class="p-5 border-b border-slate-700 flex justify-between items-center">
                <h3 class="text-white font-bold text-lg">Staff Directory</h3>
            </div>
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider font-bold">
                        <th class="py-4 px-6">Member</th>
                        <th class="py-4 px-6">Department</th>
                        <th class="py-4 px-6">Status</th>
                        <th class="py-4 px-6">Active Tasks</th>
                        <th class="py-4 px-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-700/50">
                    <tr class="hover:bg-slate-700/30 transition-colors">
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-3">
                                <img src="https://i.pravatar.cc/150?img=33" alt="Maria" class="w-10 h-10 rounded-full">
                                <div>
                                    <p class="font-bold text-white text-sm">Maria Schneider</p>
                                    <p class="text-xs text-slate-500">ID: LUX-1433</p>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6 text-sm text-slate-300">Housekeeping</td>
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-1.5">
                                <div class="w-2 h-2 rounded-full bg-teal-400"></div>
                                <span class="text-teal-400 text-xs font-bold uppercase tracking-wider">Active</span>
                            </div>
                        </td>
                        <td class="py-4 px-6 text-sm text-white font-bold">
                            <div class="flex items-center gap-2">
                                <span>2 Tasks</span>
                                <div class="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div class="bg-teal-400 h-full w-2/3"></div>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6 text-right space-x-3">
                            <button class="text-slate-400 hover:text-white font-medium text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                            <button class="text-red-400 hover:text-white font-medium text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                        </td>
                    </tr>
                    <tr class="hover:bg-slate-700/30 transition-colors">
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-3">
                                <img src="https://i.pravatar.cc/150?img=11" alt="James" class="w-10 h-10 rounded-full">
                                <div>
                                    <p class="font-bold text-white text-sm">James Thompson</p>
                                    <p class="text-xs text-slate-500">ID: LUX-0941</p>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6 text-sm text-slate-300">Maintenance</td>
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-1.5">
                                <div class="w-2 h-2 rounded-full bg-orange-400"></div>
                                <span class="text-orange-400 text-xs font-bold uppercase tracking-wider">On Break</span>
                            </div>
                        </td>
                        <td class="py-4 px-6 text-sm text-white font-bold">
                            <div class="flex items-center gap-2">
                                <span>1 Task</span>
                                <div class="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div class="bg-orange-400 h-full w-1/3"></div>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6 text-right space-x-3">
                            <button class="text-slate-400 hover:text-white font-medium text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                            <button class="text-red-400 hover:text-white font-medium text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                        </td>
                    </tr>
                    <tr class="hover:bg-slate-700/30 transition-colors">
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-3">
                                <img src="https://i.pravatar.cc/150?img=12" alt="Carlos" class="w-10 h-10 rounded-full">
                                <div>
                                    <p class="font-bold text-white text-sm">Carlos Rodriguez</p>
                                    <p class="text-xs text-slate-500">ID: LUX-2199</p>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6 text-sm text-slate-300">Security</td>
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-1.5">
                                <div class="w-2 h-2 rounded-full bg-teal-400"></div>
                                <span class="text-teal-400 text-xs font-bold uppercase tracking-wider">Active</span>
                            </div>
                        </td>
                        <td class="py-4 px-6 text-sm text-white font-bold">
                            <div class="flex items-center gap-2">
                                <span>0 Tasks</span>
                                <div class="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div class="bg-slate-600 h-full w-0"></div>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6 text-right space-x-3">
                            <button class="text-slate-400 hover:text-white font-medium text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                            <button class="text-red-400 hover:text-white font-medium text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- Pagination Placeholder -->
            <div class="p-4 border-t border-slate-700 flex justify-center items-center gap-4">
                <button class="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400">&lt;</button>
                <span class="text-slate-400 text-sm">13 / 17</span>
                <button class="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white">&gt;</button>
            </div>
        </div>
      </main>
    </div>
  `
})
export class StaffManagementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
  }
}
