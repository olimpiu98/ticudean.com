import React from 'react';

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-surface-hover border border-border ${className}`}
      {...props}
    />
  );
}

export function SkeletonProjectCard() {
  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden flex flex-col p-0 shadow-md">
      <div className="h-44 w-full bg-surface-hover animate-pulse flex flex-col justify-between p-5 border-b border-border">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-12 rounded-lg" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32 rounded" />
      </div>
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-5/6 rounded" />
        <div className="flex gap-2 pt-4 mt-auto">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCredentialCard() {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between shadow-md">
      <div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
        <Skeleton className="h-5 w-2/3 mb-3 rounded" />
        <Skeleton className="h-3 w-full mb-2 rounded" />
        <Skeleton className="h-3 w-4/5 mb-6 rounded" />
      </div>
      <div className="pt-4 border-t border-border mt-auto flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded" />
      </div>
    </div>
  );
}

export function SkeletonNoteCard() {
  return (
    <div className="p-5 rounded-2xl bg-surface border border-border flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
        </div>
        <Skeleton className="h-3 w-12 rounded" />
      </div>
      <Skeleton className="h-3 w-full pl-11 rounded" />
      <Skeleton className="h-3 w-3/4 pl-11 rounded" />
    </div>
  );
}
