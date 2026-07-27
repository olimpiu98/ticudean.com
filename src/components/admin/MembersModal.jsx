import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Modal from '../ui/Modal';
import { Icon } from '../../data/icons';
import { Skeleton } from '../ui/Skeleton';

const MOCK_MEMBERS = [
  {
    uid: 'm-1',
    displayName: 'Olimpiu Ticudean',
    email: 'olimpiu.ticudean@gmail.com',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Admin',
    lastLogin: 'Active Now'
  },
  {
    uid: 'm-2',
    name: 'Sarah Chen',
    displayName: 'Sarah Chen',
    email: 'sarah.chen@tech.co',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    role: 'Member',
    lastLogin: '2 hours ago'
  },
  {
    uid: 'm-3',
    name: 'Alex Rivera',
    displayName: 'Alex Rivera',
    email: 'alex.rivera@dev.io',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    role: 'Member',
    lastLogin: '1 day ago'
  }
];

export default function MembersModal({ isOpen, onClose }) {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    async function fetchMembers() {
      if (!db) {
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'members'), orderBy('lastLogin', 'desc'));
        const snapshot = await getDocs(q);
        const fetched = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetched.push({
            uid: doc.id,
            ...data,
            lastLogin: data.lastLogin?.toDate ? data.lastLogin.toDate().toLocaleDateString() : 'Recently'
          });
        });

        if (fetched.length > 0) {
          setMembers(fetched);
        }
      } catch (err) {
        console.warn("Firestore members query notice:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [isOpen]);

  const filteredMembers = members.filter(m =>
    (m.displayName || m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 md:p-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Icon name="Users" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-text">Registered Members Directory</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                  Admin Only View
                </span>
              </div>
              <p className="text-xs text-muted">
                List of authenticated Google members registered in Cloud Firestore database.
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search members by name or email..."
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-accent transition-colors pl-10"
          />
          <Icon name="Search" size={16} className="absolute left-3.5 top-3 text-muted" />
        </div>

        {/* Members List */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="w-32 h-4 rounded" />
                      <Skeleton className="w-48 h-3 rounded" />
                    </div>
                  </div>
                  <Skeleton className="w-16 h-5 rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border/80 rounded-xl bg-surface/30">
              <span className="text-2xl mb-2 block">👥</span>
              <p className="text-xs text-muted">No members found matching your search.</p>
            </div>
          ) : (
            filteredMembers.map((member) => {
              const isAdminUser = member.email === 'olimpiu.ticudean@gmail.com' || member.role === 'Admin';

              return (
                <div
                  key={member.uid}
                  className="p-4 rounded-xl bg-surface border border-border hover:border-border-hover transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {member.photoURL ? (
                      <img src={member.photoURL} alt={member.displayName} className="w-10 h-10 rounded-full object-cover border border-border shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-sm shrink-0">
                        {(member.displayName || member.name || 'U')[0]}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-text truncate">{member.displayName || member.name || 'Google User'}</h4>
                        {isAdminUser && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-muted truncate">{member.email}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-muted block">Last Active</span>
                    <span className="text-[11px] font-semibold text-text">{member.lastLogin || 'Recently'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
          <span>Total Registered: <strong className="text-text">{members.length}</strong></span>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface/80 text-text font-semibold text-xs transition-colors">
            Close
          </button>
        </div>

      </div>
    </Modal>
  );
}
