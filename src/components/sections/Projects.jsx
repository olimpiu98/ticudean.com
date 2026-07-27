import React, { useState } from 'react';
import { Icon } from '../../data/icons';
import Modal from '../ui/Modal';
import TiltCard from '../ui/TiltCard';
import { useProjects } from '../../hooks/useProjects';
import { SkeletonProjectCard } from '../ui/Skeleton';

export default function Projects() {
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAllProjectsOpen, setIsAllProjectsOpen] = useState(false);

  return (
    <section id="projects" className="relative z-10 py-28 bg-surface/30 reveal-section">
      <div className="inner">
        <div className="section-label reveal-content">
          <h2 className="section-heading">Selected <strong>Projects</strong></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 reveal-content d1">
          {loading ? (
            <>
              <SkeletonProjectCard />
              <SkeletonProjectCard />
              <SkeletonProjectCard />
            </>
          ) : projects.length === 0 ? (
            <div className="col-span-full p-12 text-center border border-dashed border-border rounded-2xl bg-surface/40">
              <span className="text-3xl mb-3 block">🚀</span>
              <h3 className="text-sm font-bold text-text mb-1">No Projects Found</h3>
              <p className="text-xs text-muted">Use Admin Mode to add projects into your Cloud Firestore database.</p>
            </div>
          ) : (
            projects.slice(0, 3).map((project, idx) => {
              const displayNum = String(idx + 1).padStart(2, '0');

              return (
                <TiltCard
                  key={idx}
                  onClick={() => setSelectedProject({ ...project, displayNum })}
                  className="group cursor-pointer rounded-2xl bg-surface border border-border overflow-hidden hover:border-border-hover flex flex-col shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Rich Image / Gradient Preview Banner */}
                  <div 
                    className="h-44 w-full relative p-5 flex flex-col justify-between overflow-hidden border-b border-border group-hover:scale-[1.02] transition-transform duration-500"
                    style={{ background: project.gradient || 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                  >
                    {/* Real Image Rendering if Image URL is provided */}
                    {(project.image || project.imageUrl) ? (
                      <img 
                        src={project.image || project.imageUrl} 
                        alt={project.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : null}

                    {/* Subtle Glass Noise & Overlay */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-3xl font-extrabold font-mono text-white/80 drop-shadow-md">{displayNum}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-black/40 backdrop-blur-md border border-border rounded-full text-white shadow-sm">
                        Featured Project
                      </span>
                    </div>
                    <div className="relative z-10 flex items-center justify-between font-mono text-xs text-white/90 drop-shadow">
                      <span className="truncate max-w-[200px] font-semibold">{(project.title || '').toLowerCase().replace(/\s+/g, '-')}.app</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors">{project.title}</h3>
                      <Icon name="ArrowRight" size={16} className="text-muted group-hover:text-text transform -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </div>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-6 flex-grow">{project.desc}</p>
                    
                    {/* Border Tag Pills */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags?.map(tag => (
                        <span key={tag} className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 bg-surface-hover/80 border border-border rounded-md text-muted hover:border-border transition-colors">{tag}</span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              );
            })
          )}
        </div>

        {/* Pro Button CTA */}
        <div className="mt-14 text-center reveal-content d2">
          <button 
            onClick={() => setIsAllProjectsOpen(true)}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-surface border border-border text-text text-xs font-bold tracking-widest uppercase hover:bg-surface-hover active:scale-[0.98] transition-all duration-200 shadow-md group"
          >
            <span>View All Projects Showcase</span>
            <Icon name="ArrowRight" size={14} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Project Detail Modal */}
      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} size="lg" zIndex="z-[120]">
        {selectedProject && (
          <div className="flex flex-col md:flex-row h-full">
            <div 
              className="w-full md:w-2/5 p-8 flex flex-col justify-between min-h-[240px] relative border-b md:border-b-0 md:border-r border-border font-mono text-white overflow-hidden"
              style={{ background: selectedProject.gradient || 'linear-gradient(135deg, #6366f1, #a855f7)' }}
            >
              {(selectedProject.image || selectedProject.imageUrl) ? (
                <img 
                  src={selectedProject.image || selectedProject.imageUrl} 
                  alt={selectedProject.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : null}
              <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"></div>
              <div className="relative z-10">
                <span className="text-6xl font-extrabold font-mono text-white/50 block mb-2 drop-shadow">
                  {selectedProject.displayNum || selectedProject.num || '01'}
                </span>
                <span className="text-xs text-white font-bold block truncate drop-shadow">{selectedProject.title}</span>
              </div>
            </div>
            
            <div className="w-full md:w-3/5 p-8 md:p-10">
              <h3 className="text-2xl font-bold text-text mb-3">{selectedProject.title}</h3>
              <p className="text-xs text-muted leading-relaxed mb-6">{selectedProject.desc}</p>
              
              {selectedProject.features && selectedProject.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {selectedProject.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-text mt-1.5 shrink-0"></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-8">
                {selectedProject.tags?.map(tag => (
                  <span key={tag} className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 bg-surface-hover border border-border rounded-md text-text">{tag}</span>
                ))}
              </div>

              <button className="px-6 py-3 bg-text text-bg font-extrabold text-xs tracking-wider uppercase rounded-xl hover:opacity-95 active:scale-[0.98] transition-all shadow-md">
                Live Demo Preview
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* All Projects Grid Modal */}
      <Modal isOpen={isAllProjectsOpen} onClose={() => setIsAllProjectsOpen(false)} size="lg">
        <div className="p-8 md:p-10">
            <div className="pr-14 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-muted mb-1 block">Showcase Directory</span>
              <h3 className="text-2xl font-bold text-text mb-2">All Projects</h3>
              <p className="text-xs text-muted leading-relaxed">Explore the complete catalog of projects.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[55vh] overflow-y-auto pr-1.5 custom-scrollbar">
                {projects.map((project, idx) => {
                    const computedNum = String(idx + 1).padStart(2, '0');

                    return (
                      <TiltCard 
                          key={idx}
                          onClick={() => {
                              setIsAllProjectsOpen(false);
                              setSelectedProject({ ...project, displayNum: computedNum });
                          }}
                          className="group cursor-pointer rounded-xl bg-surface border border-border overflow-hidden hover:border-text/30 flex flex-col shadow-md"
                      >
                          <div 
                              className="h-28 w-full relative p-4 flex flex-col justify-between border-b border-border text-white overflow-hidden"
                              style={{ background: project.gradient || 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                          >
                              {(project.image || project.imageUrl) ? (
                                <img 
                                  src={project.image || project.imageUrl} 
                                  alt={project.title} 
                                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : null}
                              <div className="absolute inset-0 bg-black/30"></div>
                              <span className="relative z-10 text-xl font-bold font-mono text-white/80 drop-shadow">{computedNum}</span>
                          </div>
                          <div className="p-5 flex flex-col flex-grow">
                              <div className="mb-1.5">
                                <h3 className="text-base font-bold text-text group-hover:text-accent transition-colors">{project.title}</h3>
                              </div>
                              <p className="text-xs text-muted line-clamp-2 mb-4 flex-grow">{project.desc}</p>
                              <div className="flex flex-wrap gap-1.5 mt-auto">
                                  {project.tags?.map(tag => (
                                      <span key={tag} className="text-[9px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 bg-surface-hover border border-border rounded-md text-muted">{tag}</span>
                                  ))}
                              </div>
                          </div>
                      </TiltCard>
                    );
                })}
            </div>
        </div>
      </Modal>
    </section>
  );
}
